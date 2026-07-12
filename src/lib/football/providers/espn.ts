import { footballConfig, type CompetitionKey } from "@/config/football";
import type {
  AssistStat,
  Fixture,
  MatchResult,
  MatchResultOutcome,
  Player,
  PlayerPosition,
  ScorerStat,
  SquadGroup,
  StandingRow,
} from "@/types/football";
import { withCache } from "../cache/cache";
import type {
  LiveMatchDetail,
  MatchEvent,
  MatchLineups,
  PlayerProfile,
  PlayerSeasonStats,
  RatedPlayer,
  TeamInfo,
} from "../types/domain";
import type {
  EspnAthleteRef,
  EspnAthleteResponse,
  EspnCompetitor,
  EspnEvent,
  EspnEventsResponse,
  EspnKeyEvent,
  EspnRosterGroup,
  EspnRosterResponse,
  EspnStandingsResponse,
  EspnStatus,
  EspnSummaryResponse,
  EspnTeam,
  EspnTeamResponse,
  EspnTeamRoster,
} from "../types/espn";
import { espnFetch } from "./espnClient";
import { slugifyPlayerName } from "../slug";
import type { FootballProvider } from "./types";

/**
 * ESPN's unofficial site API. See docs/ESPN_GUIDE.md for the endpoint
 * audit this was built against — three features (player season stats, top
 * scorers, top assists) aren't reliably available from ESPN for soccer, so
 * those methods intentionally always return null rather than fabricate
 * data; callers already treat null as "fall back to Sanity/placeholder".
 */

const TEAM_ID = footballConfig.espn.teamId;

function isRealMadrid(team: EspnTeam | undefined): boolean {
  return String(team?.id) === TEAM_ID;
}

function mapPosition(position: { name?: string; abbreviation?: string } | undefined): PlayerPosition {
  const value = (position?.name ?? position?.abbreviation ?? "").toLowerCase();
  if (value.startsWith("g")) return "Goalkeeper";
  if (value.startsWith("d") || value.includes("back")) return "Defender";
  if (value.startsWith("m")) return "Midfielder";
  if (value.startsWith("f") || value.includes("forward") || value.includes("attack") || value.includes("strik")) return "Forward";
  return "Midfielder";
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatKickOff(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: footballConfig.timezone });
}

function mapEventStatus(status: EspnStatus | undefined): LiveMatchDetail["status"] {
  const name = status?.type?.name?.toUpperCase() ?? "";
  if (name.includes("POSTPONED")) return "postponed";
  if (name.includes("CANCEL")) return "canceled";
  switch (status?.type?.state) {
    case "in":
      return "live";
    case "post":
      return "finished";
    default:
      return "scheduled";
  }
}

function extractScore(competitor: EspnCompetitor | undefined): number | null {
  const value = competitor?.score !== undefined ? parseInt(competitor.score, 10) : NaN;
  return Number.isNaN(value) ? null : value;
}

function teamName(team: EspnTeam | undefined): string {
  return team?.displayName ?? team?.name ?? "Unknown";
}

function mapFixture(event: EspnEvent, competitionName: string): Fixture | null {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors;
  const home = competitors?.find((c) => c.homeAway === "home");
  const away = competitors?.find((c) => c.homeAway === "away");
  if (!home?.team || !away?.team) return null;

  const weAreHome = isRealMadrid(home.team);
  const opponent = weAreHome ? teamName(away.team) : teamName(home.team);
  const iso = competition?.date ?? event.date;

  return {
    id: event.id,
    opponent: weAreHome ? `Real Madrid vs ${opponent}` : `${opponent} vs Real Madrid`,
    competition: competitionName,
    date: formatDate(iso),
    kickOff: formatKickOff(iso),
    venue: competition?.venue?.fullName,
    isHome: weAreHome,
  };
}

function mapResult(event: EspnEvent, competitionName: string): MatchResult | null {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors;
  const home = competitors?.find((c) => c.homeAway === "home");
  const away = competitors?.find((c) => c.homeAway === "away");
  if (!home?.team || !away?.team) return null;

  const homeScore = extractScore(home);
  const awayScore = extractScore(away);
  if (homeScore === null || awayScore === null) return null;

  const weAreHome = isRealMadrid(home.team);
  const ourGoals = weAreHome ? homeScore : awayScore;
  const theirGoals = weAreHome ? awayScore : homeScore;
  const outcome: MatchResultOutcome = ourGoals === theirGoals ? "D" : ourGoals > theirGoals ? "W" : "L";

  return {
    id: event.id,
    match: `${teamName(home.team)} ${homeScore}–${awayScore} ${teamName(away.team)}`,
    competition: competitionName,
    outcome,
  };
}

function mapKeyEventToMatchEvent(keyEvent: EspnKeyEvent, index: number, homeTeamId: string | undefined): MatchEvent | null {
  const text = (keyEvent.type?.text ?? keyEvent.text ?? "").toLowerCase();
  const minute = parseInt(keyEvent.clock?.displayValue ?? "", 10) || 0;
  const team: MatchEvent["team"] = keyEvent.team?.id && homeTeamId && keyEvent.team.id === homeTeamId ? "home" : "away";
  const player = keyEvent.athletesInvolved?.[0]?.displayName ?? "Unknown";
  const secondaryPlayer = keyEvent.athletesInvolved?.[1]?.displayName;
  const id = keyEvent.id ?? `${minute}-${index}`;

  if (text.includes("yellow")) return { id, minute, type: "yellow-card", team, player };
  if (text.includes("red")) return { id, minute, type: "red-card", team, player };
  if (text.includes("substitution")) return { id, minute, type: "substitution", team, player, secondaryPlayer };
  if (text.includes("own goal")) return { id, minute, type: "own-goal", team, player };
  if (text.includes("penalty") && text.includes("goal")) return { id, minute, type: "penalty", team, player, secondaryPlayer };
  if (text.includes("goal")) return { id, minute, type: "goal", team, player, secondaryPlayer };
  return null;
}

function mapRosterSide(roster: EspnTeamRoster | undefined) {
  const players = (roster?.roster ?? [])
    .filter((entry) => entry.athlete?.displayName)
    .map((entry) => ({
      id: entry.athlete?.id ?? "",
      name: entry.athlete?.displayName ?? "Unknown",
      number: entry.jersey ?? entry.athlete?.jersey ?? "—",
      position: entry.position?.abbreviation ?? "—",
      isSubstitute: entry.starter === false,
      rating: entry.stats?.find((s) => s.name?.toLowerCase() === "rating")?.value,
    }));
  return { formation: roster?.formation, players };
}

function mapLineups(rosters: EspnTeamRoster[] | undefined): MatchLineups | null {
  const home = rosters?.find((r) => r.homeAway === "home");
  const away = rosters?.find((r) => r.homeAway === "away");
  if (!home || !away) return null;
  return { home: mapRosterSide(home), away: mapRosterSide(away) };
}

function mapStatistics(boxscore: EspnSummaryResponse["boxscore"]) {
  const home = boxscore?.teams?.find((t) => t.homeAway === "home");
  const away = boxscore?.teams?.find((t) => t.homeAway === "away");
  if (!home?.statistics || !away?.statistics) return [];
  const stats: { label: string; home: string; away: string }[] = [];
  for (const homeStat of home.statistics) {
    const awayStat = away.statistics.find((s) => s.name === homeStat.name);
    if (homeStat.label && homeStat.displayValue !== undefined && awayStat?.displayValue !== undefined) {
      stats.push({ label: homeStat.label, home: homeStat.displayValue, away: awayStat.displayValue });
    }
  }
  return stats;
}

function buildMatchDetailFromSummary(summary: EspnSummaryResponse | null, matchId: string, competitionName: string): LiveMatchDetail | null {
  const competition = summary?.header?.competitions?.[0];
  const competitors = competition?.competitors;
  const home = competitors?.find((c) => c.homeAway === "home");
  const away = competitors?.find((c) => c.homeAway === "away");
  if (!home?.team || !away?.team) return null;

  const status = mapEventStatus(competition?.status);
  const minute = status === "live" ? parseInt(competition?.status?.displayClock ?? "", 10) || null : null;

  const events = (summary?.keyEvents ?? [])
    .map((keyEvent, index) => mapKeyEventToMatchEvent(keyEvent, index, home.team?.id))
    .filter((event): event is MatchEvent => event !== null);

  return {
    id: matchId,
    status,
    minute,
    competition: competitionName,
    kickOff: formatKickOff(competition?.date),
    venue: competition?.venue?.fullName,
    home: { name: teamName(home.team), score: extractScore(home) },
    away: { name: teamName(away.team), score: extractScore(away) },
    events,
    lineups: mapLineups(summary?.rosters),
    statistics: mapStatistics(summary?.boxscore),
  };
}

function isRosterGroup(entry: EspnRosterGroup | EspnAthleteRef): entry is EspnRosterGroup {
  return "items" in entry;
}

async function fetchTeamSchedule(leagueSlug: string): Promise<EspnEvent[]> {
  const data = await espnFetch<EspnEventsResponse>(`${footballConfig.espn.baseUrl}/${leagueSlug}/teams/${TEAM_ID}/schedule`);
  return data?.events ?? [];
}

/**
 * ESPN's schedule endpoint is scoped to a single competition, unlike
 * Sofascore's team-wide fixtures endpoint — so fixtures/results are
 * assembled from every configured competition (La Liga + Champions
 * League) rather than just one. A match in an unconfigured competition
 * (Copa del Rey, Club World Cup, etc.) won't appear; that's a known,
 * disclosed gap, not a bug.
 */
async function fetchAllScheduleEvents(): Promise<{ event: EspnEvent; competitionName: string }[]> {
  const leagues = Object.entries(footballConfig.espn.leagues) as [CompetitionKey, string][];
  const grouped = await Promise.all(
    leagues.map(async ([key, slug]) => {
      const events = await fetchTeamSchedule(slug);
      const competitionName = footballConfig.competitions[key].name;
      return events.map((event) => ({ event, competitionName }));
    })
  );
  return grouped.flat();
}

export const espnProvider: FootballProvider = {
  async getTeamInfo(): Promise<TeamInfo | null> {
    return withCache(
      "team-info",
      async () => {
        const data = await espnFetch<EspnTeamResponse>(`${footballConfig.espn.baseUrl}/${footballConfig.espn.leagues.laLiga}/teams/${TEAM_ID}`);
        if (!data?.team) return null;
        return {
          id: TEAM_ID,
          name: teamName(data.team),
          country: data.team.venue?.address?.country,
          venue: data.team.venue?.fullName,
          coach: data.team.coach?.[0]?.name,
        };
      },
      { ttlSeconds: footballConfig.cache.squad }
    );
  },

  async getUpcomingFixtures(count): Promise<Fixture[] | null> {
    return withCache(
      `fixtures:next:${count}`,
      async () => {
        const all = await fetchAllScheduleEvents();
        const upcoming = all
          .filter(({ event }) => event.competitions?.[0]?.status?.type?.state === "pre")
          .sort((a, b) => new Date(a.event.date ?? 0).getTime() - new Date(b.event.date ?? 0).getTime())
          .map(({ event, competitionName }) => mapFixture(event, competitionName))
          .filter((fixture): fixture is Fixture => fixture !== null);
        return upcoming.length > 0 ? upcoming.slice(0, count) : null;
      },
      { ttlSeconds: footballConfig.cache.fixtures }
    );
  },

  async getRecentResults(count): Promise<MatchResult[] | null> {
    return withCache(
      `fixtures:last:${count}`,
      async () => {
        const all = await fetchAllScheduleEvents();
        const results = all
          .filter(({ event }) => event.competitions?.[0]?.status?.type?.state === "post")
          .sort((a, b) => new Date(b.event.date ?? 0).getTime() - new Date(a.event.date ?? 0).getTime())
          .map(({ event, competitionName }) => mapResult(event, competitionName))
          .filter((result): result is MatchResult => result !== null);
        return results.length > 0 ? results.slice(0, count) : null;
      },
      { ttlSeconds: footballConfig.cache.historical }
    );
  },

  async getLiveMatch(): Promise<LiveMatchDetail | null> {
    // Never cached — refreshed on its own short interval by the caller.
    const leagues = Object.entries(footballConfig.espn.leagues) as [CompetitionKey, string][];
    for (const [key, slug] of leagues) {
      const data = await espnFetch<EspnEventsResponse>(`${footballConfig.espn.baseUrl}/${slug}/scoreboard`);
      const liveEvent = data?.events?.find((event) => {
        const competition = event.competitions?.[0];
        const involvesUs = competition?.competitors?.some((c) => isRealMadrid(c.team));
        return involvesUs && competition?.status?.type?.state === "in";
      });
      if (liveEvent) {
        const summary = await espnFetch<EspnSummaryResponse>(`${footballConfig.espn.baseUrl}/${slug}/summary?event=${liveEvent.id}`);
        const detail = buildMatchDetailFromSummary(summary, liveEvent.id, footballConfig.competitions[key].name);
        if (detail) return detail;
      }
    }
    return null;
  },

  async getMatchDetail(matchId): Promise<LiveMatchDetail | null> {
    return withCache(
      `match:${matchId}`,
      async () => {
        // ESPN nests match detail under a competition slug, unlike
        // Sofascore's flat event ID space — try each configured league
        // until one resolves the match.
        const leagues = Object.entries(footballConfig.espn.leagues) as [CompetitionKey, string][];
        for (const [key, slug] of leagues) {
          const summary = await espnFetch<EspnSummaryResponse>(`${footballConfig.espn.baseUrl}/${slug}/summary?event=${matchId}`);
          const detail = buildMatchDetailFromSummary(summary, matchId, footballConfig.competitions[key].name);
          if (detail) return detail;
        }
        return null;
      },
      { ttlSeconds: footballConfig.cache.liveMatch }
    );
  },

  async getSquad(): Promise<SquadGroup[] | null> {
    return withCache(
      "squad",
      async () => {
        const data = await espnFetch<EspnRosterResponse>(
          `${footballConfig.espn.baseUrl}/${footballConfig.espn.leagues.laLiga}/teams/${TEAM_ID}/roster`
        );
        const raw = data?.athletes;
        if (!raw || raw.length === 0) return null;

        const flatAthletes = raw.flatMap((entry) => (isRosterGroup(entry) ? entry.items ?? [] : [entry]));
        if (flatAthletes.length === 0) return null;

        const players: Player[] = flatAthletes
          .filter((athlete) => athlete.displayName)
          .map((athlete) => ({
            id: athlete.id ?? "",
            number: athlete.jersey ?? "—",
            name: athlete.displayName ?? athlete.fullName ?? "Unknown",
            role: mapPosition(athlete.position),
            position: mapPosition(athlete.position),
            image: athlete.headshot?.href ?? (athlete.id ? `https://a.espncdn.com/i/headshots/soccer/players/full/${athlete.id}.png` : ""),
            nationality: athlete.citizenship ?? athlete.birthPlace?.country,
          }));

        const groups: { position: PlayerPosition; label: string }[] = [
          { position: "Goalkeeper", label: "GOALKEEPERS" },
          { position: "Defender", label: "DEFENDERS" },
          { position: "Midfielder", label: "MIDFIELDERS" },
          { position: "Forward", label: "FORWARDS" },
        ];

        return groups
          .map(({ position, label }) => ({ label, players: players.filter((player) => player.position === position) }))
          .filter((group) => group.players.length > 0);
      },
      { ttlSeconds: footballConfig.cache.squad }
    );
  },

  async getPlayerProfile(playerId): Promise<PlayerProfile | null> {
    return withCache(
      `player:${playerId}`,
      async () => {
        const data = await espnFetch<EspnAthleteResponse>(
          `${footballConfig.espn.baseUrl}/${footballConfig.espn.leagues.laLiga}/athletes/${playerId}`
        );
        const athlete = data?.athlete;
        if (!athlete?.displayName) return null;
        const age = athlete.dateOfBirth
          ? Math.floor((Date.now() - new Date(athlete.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : undefined;
        return {
          id: playerId,
          slug: slugifyPlayerName(athlete.displayName),
          name: athlete.displayName,
          position: mapPosition(athlete.position),
          number: athlete.jersey ?? "—",
          nationality: athlete.citizenship ?? athlete.birthPlace?.country,
          age,
          photo: athlete.headshot?.href ?? `https://a.espncdn.com/i/headshots/soccer/players/full/${playerId}.png`,
        };
      },
      { ttlSeconds: footballConfig.cache.squad }
    );
  },

  /** Not reliably available from ESPN's soccer endpoints — see docs/ESPN_GUIDE.md. Callers fall back to Sanity/placeholder. */
  async getPlayerSeasonStats(): Promise<PlayerSeasonStats | null> {
    return null;
  },

  async getStandings(competition): Promise<StandingRow[] | null> {
    const leagueSlug = footballConfig.espn.leagues[competition];
    return withCache(
      `standings:${competition}`,
      async () => {
        const data = await espnFetch<EspnStandingsResponse>(`${footballConfig.espn.standingsBaseUrl}/${leagueSlug}/standings`);
        const entries = data?.standings?.entries ?? data?.children?.flatMap((child) => child.standings?.entries ?? []) ?? [];
        if (entries.length === 0) return null;

        const statValue = (entry: (typeof entries)[number], names: string[]) =>
          entry.stats?.find((stat) => names.includes((stat.name ?? stat.abbreviation ?? "").toLowerCase()))?.value;

        return entries
          .filter((entry) => entry.team?.displayName || entry.team?.name)
          .map((entry, index) => ({
            position: statValue(entry, ["rank"]) ?? index + 1,
            team: teamName(entry.team),
            points: statValue(entry, ["points"]) ?? 0,
            isHighlighted: isRealMadrid(entry.team),
            played: statValue(entry, ["gamesplayed"]),
            won: statValue(entry, ["wins"]),
            drawn: statValue(entry, ["ties", "draws"]),
            lost: statValue(entry, ["losses"]),
          }));
      },
      { ttlSeconds: footballConfig.cache.standings }
    );
  },

  /** Not reliably available from ESPN's soccer endpoints — see docs/ESPN_GUIDE.md. Callers fall back to Sanity/placeholder. */
  async getTopScorers(): Promise<ScorerStat[] | null> {
    return null;
  },

  /** Not reliably available from ESPN's soccer endpoints — see docs/ESPN_GUIDE.md. Callers fall back to Sanity/placeholder. */
  async getTopAssists(): Promise<AssistStat[] | null> {
    return null;
  },

  /** Not reliably available from ESPN's soccer endpoints — see docs/ESPN_GUIDE.md. Callers fall back to Sanity/placeholder. */
  async getBestRatedPlayers(): Promise<RatedPlayer[] | null> {
    return null;
  },
};
