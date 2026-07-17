import { footballConfig } from "@/config/football";
import {
  apiFootballFetch,
  fetchRecentResults,
  fetchUpcomingFixtures,
  isApiFootballConfigured,
  REAL_MADRID_TEAM_ID,
} from "@/lib/sports-api/api-football";
import type {
  AssistStat,
  Fixture,
  MatchResult,
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
  ApiFootballEvent,
  ApiFootballEventFixture,
  ApiFootballEventsResponse,
  ApiFootballLineupsResponse,
  ApiFootballLineupSide,
  ApiFootballStatisticsResponse,
} from "../types/apiFootball";
import type { FootballProvider } from "./types";

/**
 * API-Football, reactivated for fixtures and the live match centre only —
 * see docs/API_FOOTBALL_LIVE_GUIDE.md. Squad, team info, player stats,
 * standings and leaderboards are deliberately NOT wired up here (they
 * return null, same graceful-fallback contract as every other provider's
 * unsupported methods) — that data source is still being decided; nothing
 * stops it from being enabled later, since fetchSquad/fetchStandings/
 * fetchTopScorers/etc. already exist and work in
 * src/lib/sports-api/api-football, unused for now on purpose.
 */

function isRealMadrid(teamId: number | undefined): boolean {
  return String(teamId) === REAL_MADRID_TEAM_ID;
}

function mapMatchStatus(short: string | undefined): LiveMatchDetail["status"] {
  switch (short) {
    case "1H":
    case "2H":
    case "HT":
    case "ET":
    case "BT":
    case "P":
    case "SUSP":
    case "INT":
      return "live";
    case "FT":
    case "AET":
    case "PEN":
      return "finished";
    case "PST":
      return "postponed";
    case "CANC":
    case "ABD":
    case "AWD":
    case "WO":
      return "canceled";
    default:
      return "scheduled";
  }
}

function formatKickOff(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: footballConfig.timezone });
}

function mapEventToMatchEvent(event: ApiFootballEvent, index: number, homeTeamId: number | undefined): MatchEvent | null {
  const minute = event.time?.elapsed ?? 0;
  const team: MatchEvent["team"] = event.team?.id === homeTeamId ? "home" : "away";
  const player = event.player?.name ?? "Unknown";
  const secondaryPlayer = event.assist?.name ?? undefined;
  const id = `${minute}-${index}`;
  const detail = (event.detail ?? "").toLowerCase();

  if (event.type === "Goal") {
    if (detail.includes("own")) return { id, minute, type: "own-goal", team, player };
    if (detail.includes("penalty")) return { id, minute, type: "penalty", team, player, secondaryPlayer };
    return { id, minute, type: "goal", team, player, secondaryPlayer };
  }
  if (event.type === "Card") {
    return { id, minute, type: detail.includes("red") ? "red-card" : "yellow-card", team, player };
  }
  if (event.type === "subst") {
    return { id, minute, type: "substitution", team, player, secondaryPlayer: event.player?.name };
  }
  return null;
}

function mapLineups(sides: ApiFootballLineupsResponse | null): MatchLineups | null {
  if (!sides || sides.length < 2) return null;
  const mapSide = (side: ApiFootballLineupSide | undefined) => ({
    formation: side?.formation,
    players: [
      ...(side?.startXI ?? []).map((entry) => ({
        id: String(entry.player?.id ?? ""),
        name: entry.player?.name ?? "Unknown",
        number: entry.player?.number !== undefined ? String(entry.player.number) : "—",
        position: entry.player?.pos ?? "—",
        isSubstitute: false,
      })),
      ...(side?.substitutes ?? []).map((entry) => ({
        id: String(entry.player?.id ?? ""),
        name: entry.player?.name ?? "Unknown",
        number: entry.player?.number !== undefined ? String(entry.player.number) : "—",
        position: entry.player?.pos ?? "—",
        isSubstitute: true,
      })),
    ],
  });
  return { home: mapSide(sides[0]), away: mapSide(sides[1]) };
}

function mapStatistics(sides: ApiFootballStatisticsResponse | null) {
  if (!sides || sides.length < 2) return [];
  const [home, away] = sides;
  const stats: { label: string; home: string; away: string }[] = [];
  for (const stat of home.statistics ?? []) {
    const awayStat = away.statistics?.find((entry) => entry.type === stat.type);
    if (stat.type && stat.value !== undefined && stat.value !== null && awayStat?.value !== undefined && awayStat.value !== null) {
      stats.push({ label: stat.type, home: String(stat.value), away: String(awayStat.value) });
    }
  }
  return stats;
}

async function buildMatchDetail(fixture: ApiFootballEventFixture): Promise<LiveMatchDetail> {
  const fixtureId = fixture.fixture.id;
  const [events, lineups, statistics] = await Promise.all([
    apiFootballFetch<ApiFootballEventsResponse>("/fixtures/events", { fixture: String(fixtureId) }),
    apiFootballFetch<ApiFootballLineupsResponse>("/fixtures/lineups", { fixture: String(fixtureId) }),
    apiFootballFetch<ApiFootballStatisticsResponse>("/fixtures/statistics", { fixture: String(fixtureId) }),
  ]);

  const mappedEvents = (events ?? [])
    .map((event, index) => mapEventToMatchEvent(event, index, fixture.teams.home.id))
    .filter((event): event is MatchEvent => event !== null)
    .sort((a, b) => a.minute - b.minute);

  const status = mapMatchStatus(fixture.fixture.status.short);

  return {
    id: String(fixtureId),
    status,
    minute: status === "live" ? (fixture.fixture.status.elapsed ?? null) : null,
    competition: fixture.league.name,
    kickOff: formatKickOff(fixture.fixture.date),
    venue: fixture.fixture.venue?.name ?? undefined,
    home: { name: fixture.teams.home.name, score: fixture.goals.home },
    away: { name: fixture.teams.away.name, score: fixture.goals.away },
    events: mappedEvents,
    lineups: mapLineups(lineups),
    statistics: mapStatistics(statistics),
  };
}

export const apiFootballProvider: FootballProvider = {
  async getTeamInfo(): Promise<TeamInfo | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getUpcomingFixtures(count): Promise<Fixture[] | null> {
    if (!isApiFootballConfigured) return null;
    return withCache(`fixtures:next:${count}`, () => fetchUpcomingFixtures(count), { ttlSeconds: footballConfig.cache.fixtures });
  },

  async getRecentResults(count): Promise<MatchResult[] | null> {
    if (!isApiFootballConfigured) return null;
    return withCache(`fixtures:last:${count}`, () => fetchRecentResults(count), { ttlSeconds: footballConfig.cache.historical });
  },

  async getLiveMatch(): Promise<LiveMatchDetail | null> {
    if (!isApiFootballConfigured) return null;
    // Never cached — live data is refreshed on its own short interval by the caller.
    const data = await apiFootballFetch<ApiFootballEventFixture[]>("/fixtures", { live: "all" });
    const match = data?.find((fixture) => isRealMadrid(fixture.teams.home.id) || isRealMadrid(fixture.teams.away.id));
    if (!match) return null;
    return buildMatchDetail(match);
  },

  async getMatchDetail(matchId): Promise<LiveMatchDetail | null> {
    if (!isApiFootballConfigured) return null;
    return withCache(
      `match:${matchId}`,
      async () => {
        const data = await apiFootballFetch<ApiFootballEventFixture[]>("/fixtures", { id: matchId });
        const fixture = data?.[0];
        if (!fixture) return null;
        return buildMatchDetail(fixture);
      },
      { ttlSeconds: footballConfig.cache.liveMatch }
    );
  },

  async getSquad(): Promise<SquadGroup[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getPlayerProfile(): Promise<PlayerProfile | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getPlayerSeasonStats(): Promise<PlayerSeasonStats | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getStandings(): Promise<StandingRow[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getTopScorers(): Promise<ScorerStat[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getTopAssists(): Promise<AssistStat[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getBestRatedPlayers(): Promise<RatedPlayer[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },
};
