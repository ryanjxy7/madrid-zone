import { footballConfig, type CompetitionKey } from "@/config/football";
import type { AssistStat, Fixture, MatchResult, ScorerStat, SquadGroup, StandingRow, Player, PlayerPosition } from "@/types/football";
import { placeholderImage } from "@/lib/utils/images";
import { withCache } from "../cache/cache";
import type {
  LiveMatchDetail,
  MatchEvent,
  MatchLineups,
  MatchStatistic,
  PlayerProfile,
  PlayerSeasonStats,
  RatedPlayer,
  TeamInfo,
} from "../types/domain";
import type {
  SofascoreEvent,
  SofascoreEventsResponse,
  SofascoreIncident,
  SofascoreIncidentsResponse,
  SofascoreLineupsResponse,
  SofascorePlayerResponse,
  SofascorePlayerStatisticsResponse,
  SofascoreSeasonsResponse,
  SofascoreSingleEventResponse,
  SofascoreSquadResponse,
  SofascoreStandingsResponse,
  SofascoreStatisticsResponse,
  SofascoreTeam,
  SofascoreTopPlayersResponse,
} from "../types/sofascore";
import { sofascoreFetch } from "./sofascoreClient";
import type { FootballProvider } from "./types";
import { slugifyPlayerName } from "../slug";

const TEAM_ID = footballConfig.teamId;

function formatDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatKickOff(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: footballConfig.timezone,
  });
}

function isRealMadrid(team: SofascoreTeam | undefined): boolean {
  return String(team?.id) === TEAM_ID;
}

/** Sofascore's short position codes -> ours. Falls back to full words if ever sent instead. */
function mapPosition(code: string | undefined): PlayerPosition {
  switch (code) {
    case "G":
    case "Goalkeeper":
      return "Goalkeeper";
    case "D":
    case "Defender":
      return "Defender";
    case "M":
    case "Midfielder":
      return "Midfielder";
    case "F":
    case "Forward":
    case "Attacker":
      return "Forward";
    default:
      return "Midfielder";
  }
}

async function resolveCurrentSeasonId(competitionId: string): Promise<number | null> {
  return withCache(
    `season:${competitionId}`,
    async () => {
      const data = await sofascoreFetch<SofascoreSeasonsResponse>(`/unique-tournament/${competitionId}/seasons`);
      // Sofascore returns seasons newest-first.
      return data?.seasons?.[0]?.id ?? null;
    },
    { ttlSeconds: footballConfig.cache.standings }
  );
}

function mapFixture(event: SofascoreEvent): Fixture {
  const opponent = isRealMadrid(event.homeTeam) ? event.awayTeam.name : event.homeTeam.name;
  return {
    id: String(event.id),
    opponent,
    competition: event.tournament?.name ?? event.tournament?.uniqueTournament?.name ?? "Unknown competition",
    date: formatDate(event.startTimestamp),
    kickOff: formatKickOff(event.startTimestamp),
    venue: event.venue?.name,
    isHome: isRealMadrid(event.homeTeam),
  };
}

function mapResult(event: SofascoreEvent): MatchResult | null {
  const homeGoals = event.homeScore?.current;
  const awayGoals = event.awayScore?.current;
  if (homeGoals === undefined || awayGoals === undefined) return null;

  const madridGoals = isRealMadrid(event.homeTeam) ? homeGoals : awayGoals;
  const oppGoals = isRealMadrid(event.homeTeam) ? awayGoals : homeGoals;
  const outcome = madridGoals === oppGoals ? "D" : madridGoals > oppGoals ? "W" : "L";

  return {
    id: String(event.id),
    match: `${event.homeTeam.name} ${homeGoals}–${awayGoals} ${event.awayTeam.name}`,
    competition: event.tournament?.name ?? event.tournament?.uniqueTournament?.name ?? "Unknown competition",
    outcome,
  };
}

function mapMatchStatus(status: SofascoreEvent["status"]): LiveMatchDetail["status"] {
  switch (status?.type) {
    case "inprogress":
      return "live";
    case "finished":
      return "finished";
    case "postponed":
      return "postponed";
    case "canceled":
      return "canceled";
    default:
      return "scheduled";
  }
}

function mapIncidentToEvent(incident: SofascoreIncident, index: number): MatchEvent | null {
  const team = incident.isHome ? "home" : "away";
  const minute = incident.time ?? 0;

  switch (incident.incidentType) {
    case "goal":
      return {
        id: `${minute}-${index}`,
        minute,
        type: incident.incidentClass === "ownGoal" ? "own-goal" : incident.incidentClass === "penalty" ? "penalty" : "goal",
        team,
        player: incident.player?.name ?? "Unknown",
        secondaryPlayer: incident.assist1?.name,
      };
    case "card":
      return {
        id: `${minute}-${index}`,
        minute,
        type: incident.incidentClass === "red" || incident.incidentClass === "yellowRed" ? "red-card" : "yellow-card",
        team,
        player: incident.player?.name ?? "Unknown",
      };
    case "substitution":
      return {
        id: `${minute}-${index}`,
        minute,
        type: "substitution",
        team,
        player: incident.playerOut?.name ?? "Unknown",
        secondaryPlayer: incident.playerIn?.name,
      };
    default:
      return null;
  }
}

function mapLineups(data: SofascoreLineupsResponse | null): MatchLineups | null {
  if (!data?.home?.players || !data?.away?.players) return null;

  const mapSide = (side: NonNullable<SofascoreLineupsResponse["home"]>) => ({
    formation: side.formation,
    players: (side.players ?? [])
      .filter((entry) => entry.player?.name)
      .map((entry) => ({
        id: String(entry.player?.id ?? ""),
        name: entry.player?.name ?? "Unknown",
        number: entry.jerseyNumber ?? entry.player?.jerseyNumber ?? "—",
        position: entry.position ?? entry.player?.position ?? "—",
        isSubstitute: Boolean(entry.substitute),
        rating: entry.statistics?.rating,
      })),
  });

  return { home: mapSide(data.home), away: mapSide(data.away) };
}

function mapStatistics(data: SofascoreStatisticsResponse | null): MatchStatistic[] {
  const allGroups = data?.statistics?.find((period) => period.period === "ALL")?.groups ?? data?.statistics?.[0]?.groups ?? [];
  const items = allGroups.flatMap((group) => group.statisticsItems ?? []);
  return items
    .filter((item) => item.name && item.home !== undefined && item.away !== undefined)
    .map((item) => ({ label: item.name as string, home: item.home as string, away: item.away as string }));
}

async function buildMatchDetail(event: SofascoreEvent): Promise<LiveMatchDetail> {
  const eventId = event.id;
  const [incidentsData, lineupsData, statisticsData] = await Promise.all([
    sofascoreFetch<SofascoreIncidentsResponse>(`/event/${eventId}/incidents`),
    sofascoreFetch<SofascoreLineupsResponse>(`/event/${eventId}/lineups`),
    sofascoreFetch<SofascoreStatisticsResponse>(`/event/${eventId}/statistics`),
  ]);

  const events = (incidentsData?.incidents ?? [])
    .map((incident, index) => mapIncidentToEvent(incident, index))
    .filter((incident): incident is MatchEvent => incident !== null)
    .sort((a, b) => a.minute - b.minute);

  return {
    id: String(eventId),
    status: mapMatchStatus(event.status),
    minute: mapMatchStatus(event.status) === "live" ? Math.floor((Date.now() / 1000 - (event.time?.currentPeriodStartTimestamp ?? event.startTimestamp)) / 60) : null,
    competition: event.tournament?.name ?? event.tournament?.uniqueTournament?.name ?? "Unknown competition",
    kickOff: formatKickOff(event.startTimestamp),
    venue: event.venue?.name,
    home: { name: event.homeTeam.name, score: event.homeScore?.current ?? null },
    away: { name: event.awayTeam.name, score: event.awayScore?.current ?? null },
    events,
    lineups: mapLineups(lineupsData),
    statistics: mapStatistics(statisticsData),
  };
}

export const sofascoreProvider: FootballProvider = {
  async getTeamInfo(): Promise<TeamInfo | null> {
    return withCache(
      "team-info",
      async () => {
        const data = await sofascoreFetch<{ team: SofascoreTeam }>(`/team/${TEAM_ID}`);
        if (!data?.team) return null;
        return {
          id: String(data.team.id),
          name: data.team.name,
          country: data.team.country?.name,
          venue: data.team.venue?.name,
          coach: data.team.manager?.name,
        };
      },
      { ttlSeconds: footballConfig.cache.squad }
    );
  },

  async getUpcomingFixtures(count): Promise<Fixture[] | null> {
    return withCache(
      `fixtures:next:${count}`,
      async () => {
        const data = await sofascoreFetch<SofascoreEventsResponse>(`/team/${TEAM_ID}/events/next/0`);
        if (!data?.events || data.events.length === 0) return null;
        return data.events.slice(0, count).map(mapFixture);
      },
      { ttlSeconds: footballConfig.cache.fixtures }
    );
  },

  async getRecentResults(count): Promise<MatchResult[] | null> {
    return withCache(
      `fixtures:last:${count}`,
      async () => {
        const data = await sofascoreFetch<SofascoreEventsResponse>(`/team/${TEAM_ID}/events/last/0`);
        if (!data?.events || data.events.length === 0) return null;
        const results = data.events.map(mapResult).filter((result): result is MatchResult => result !== null);
        return results.length > 0 ? results.slice(0, count) : null;
      },
      { ttlSeconds: footballConfig.cache.historical }
    );
  },

  async getLiveMatch(): Promise<LiveMatchDetail | null> {
    // Never cached — live data is refreshed on its own short interval by
    // the caller (see services/matches.ts), not by this cache layer.
    const data = await sofascoreFetch<SofascoreEventsResponse>(`/sport/football/events/live`);
    const match = data?.events?.find((event) => isRealMadrid(event.homeTeam) || isRealMadrid(event.awayTeam));
    if (!match) return null;
    return buildMatchDetail(match);
  },

  async getMatchDetail(matchId): Promise<LiveMatchDetail | null> {
    return withCache(
      `match:${matchId}`,
      async () => {
        const data = await sofascoreFetch<SofascoreSingleEventResponse>(`/event/${matchId}`);
        if (!data?.event) return null;
        return buildMatchDetail(data.event);
      },
      { ttlSeconds: footballConfig.cache.liveMatch }
    );
  },

  async getSquad(): Promise<SquadGroup[] | null> {
    return withCache(
      "squad",
      async () => {
        const data = await sofascoreFetch<SofascoreSquadResponse>(`/team/${TEAM_ID}/players`);
        if (!data?.players || data.players.length === 0) return null;

        const players: Player[] = data.players
          .filter((entry) => entry.player?.name)
          .map((entry) => ({
            id: String(entry.player?.id ?? ""),
            number: entry.player?.jerseyNumber ?? "—",
            name: entry.player?.name ?? "Unknown",
            role: mapPosition(entry.player?.position),
            position: mapPosition(entry.player?.position),
            image: entry.player?.id ? `https://api.sofascore.com/api/v1/player/${entry.player.id}/image` : "",
            nationality: entry.player?.country?.name,
          }));

        const groups: { position: PlayerPosition; label: string }[] = [
          { position: "Forward", label: "FORWARDS" },
          { position: "Midfielder", label: "MIDFIELDERS" },
          { position: "Defender", label: "DEFENDERS" },
          { position: "Goalkeeper", label: "GOALKEEPERS" },
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
        const data = await sofascoreFetch<SofascorePlayerResponse>(`/player/${playerId}`);
        if (!data?.player) return null;
        const age = data.player.dateOfBirthTimestamp
          ? Math.floor((Date.now() / 1000 - data.player.dateOfBirthTimestamp) / (365.25 * 24 * 60 * 60))
          : undefined;
        return {
          id: String(data.player.id),
          slug: slugifyPlayerName(data.player.name ?? "player"),
          name: data.player.name ?? "Unknown",
          position: mapPosition(data.player.position),
          number: data.player.jerseyNumber ?? "—",
          nationality: data.player.country?.name,
          age,
          photo: `https://api.sofascore.com/api/v1/player/${playerId}/image`,
        };
      },
      { ttlSeconds: footballConfig.cache.squad }
    );
  },

  async getPlayerSeasonStats(playerId): Promise<PlayerSeasonStats | null> {
    return withCache(
      `player-stats:${playerId}`,
      async () => {
        const seasonId = await resolveCurrentSeasonId(footballConfig.competitions.laLiga.id);
        if (!seasonId) return null;
        const data = await sofascoreFetch<SofascorePlayerStatisticsResponse>(
          `/player/${playerId}/unique-tournament/${footballConfig.competitions.laLiga.id}/season/${seasonId}/statistics/overall`
        );
        if (!data?.statistics) return null;
        return {
          appearances: data.statistics.appearances ?? 0,
          minutes: data.statistics.minutesPlayed ?? 0,
          goals: data.statistics.goals ?? 0,
          assists: data.statistics.goalAssist ?? 0,
          yellowCards: data.statistics.yellowCards ?? 0,
          redCards: data.statistics.redCards ?? 0,
          rating: data.statistics.rating ?? null,
        };
      },
      { ttlSeconds: footballConfig.cache.playerStatistics }
    );
  },

  async getStandings(competition: CompetitionKey): Promise<StandingRow[] | null> {
    const competitionId = footballConfig.competitions[competition].id;
    return withCache(
      `standings:${competitionId}`,
      async () => {
        const seasonId = await resolveCurrentSeasonId(competitionId);
        if (!seasonId) return null;
        const data = await sofascoreFetch<SofascoreStandingsResponse>(`/unique-tournament/${competitionId}/season/${seasonId}/standings/total`);
        const rows = data?.standings?.[0]?.rows;
        if (!rows || rows.length === 0) return null;
        return rows
          .filter((row) => row.position && row.team?.name)
          .map((row) => ({
            position: row.position as number,
            team: row.team?.name as string,
            points: row.points ?? 0,
            isHighlighted: String(row.team?.id) === TEAM_ID,
            played: row.matches,
            won: row.wins,
            drawn: row.draws,
            lost: row.losses,
          }));
      },
      { ttlSeconds: footballConfig.cache.standings }
    );
  },

  async getTopScorers(competition: CompetitionKey): Promise<ScorerStat[] | null> {
    const competitionId = footballConfig.competitions[competition].id;
    return withCache(
      `top-scorers:${competitionId}`,
      async () => {
        const seasonId = await resolveCurrentSeasonId(competitionId);
        if (!seasonId) return null;
        const data = await sofascoreFetch<SofascoreTopPlayersResponse>(`/unique-tournament/${competitionId}/season/${seasonId}/top-players/overall`);
        const entries = data?.topPlayers?.goals;
        if (!entries || entries.length === 0) return null;
        const top = entries[0]?.statistics?.goals ?? 1;
        return entries
          .filter((entry) => entry.player?.name)
          .map((entry, index) => ({
            rank: index + 1,
            name: entry.player?.name as string,
            goals: entry.statistics?.goals ?? 0,
            barPercent: Math.round(((entry.statistics?.goals ?? 0) / top) * 100),
            team: entry.team?.name,
            image: placeholderImage(entry.player?.name as string, 80, 80),
          }));
      },
      { ttlSeconds: footballConfig.cache.fixtures }
    );
  },

  async getTopAssists(competition: CompetitionKey): Promise<AssistStat[] | null> {
    const competitionId = footballConfig.competitions[competition].id;
    return withCache(
      `top-assists:${competitionId}`,
      async () => {
        const seasonId = await resolveCurrentSeasonId(competitionId);
        if (!seasonId) return null;
        const data = await sofascoreFetch<SofascoreTopPlayersResponse>(`/unique-tournament/${competitionId}/season/${seasonId}/top-players/overall`);
        const entries = data?.topPlayers?.goalAssist;
        if (!entries || entries.length === 0) return null;
        return entries
          .filter((entry) => entry.player?.name)
          .map((entry, index) => ({
            rank: index + 1,
            name: entry.player?.name as string,
            assists: entry.statistics?.goalAssist ?? 0,
            team: entry.team?.name,
            image: placeholderImage(entry.player?.name as string, 80, 80),
          }));
      },
      { ttlSeconds: footballConfig.cache.fixtures }
    );
  },

  async getBestRatedPlayers(competition: CompetitionKey): Promise<RatedPlayer[] | null> {
    const competitionId = footballConfig.competitions[competition].id;
    return withCache(
      `top-rated:${competitionId}`,
      async () => {
        const seasonId = await resolveCurrentSeasonId(competitionId);
        if (!seasonId) return null;
        const data = await sofascoreFetch<SofascoreTopPlayersResponse>(`/unique-tournament/${competitionId}/season/${seasonId}/top-players/overall`);
        const entries = data?.topPlayers?.rating;
        if (!entries || entries.length === 0) return null;
        return entries
          .filter((entry) => entry.player?.name)
          .map((entry, index) => ({
            rank: index + 1,
            name: entry.player?.name as string,
            team: entry.team?.name ?? "",
            goals: entry.statistics?.goals ?? 0,
            assists: entry.statistics?.goalAssist ?? 0,
            rating: entry.statistics?.rating ?? null,
          }));
      },
      { ttlSeconds: footballConfig.cache.fixtures }
    );
  },
};
