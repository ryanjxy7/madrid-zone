import { footballConfig } from "@/config/football";
import type { CompetitionKey } from "@/config/football";
import {
  fetchLiveMatch,
  fetchRecentResults,
  fetchStandings,
  fetchUpcomingFixtures,
  footballDataFetch,
  isFootballDataConfigured,
  REAL_MADRID_TEAM_ID,
} from "@/lib/sports-api/football-data";
import type { FootballDataMatch, FootballDataMatchResponse } from "@/lib/sports-api/football-data/types";
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
  PlayerProfile,
  PlayerSeasonStats,
  RatedPlayer,
  TeamInfo,
} from "../types/domain";
import type { FootballProvider } from "./types";

/**
 * football-data.org — the active provider for fixtures, results, the live
 * match centre, and standings. Squad, team info, player stats, and top
 * scorers/assists are deliberately NOT wired up here (they return null,
 * same graceful-fallback contract as every other provider's unsupported
 * methods) — per your own instruction, those stay CMS-managed for now.
 *
 * The free tier does not include match events/lineups/statistics, so
 * getLiveMatch/getMatchDetail return score and status only — events is
 * always [], lineups is always null, statistics is always []. That's an
 * honest reflection of what this tier gives you, not a bug.
 */

function mapMatchStatus(short: string): LiveMatchDetail["status"] {
  switch (short) {
    case "IN_PLAY":
    case "PAUSED":
      return "live";
    case "FINISHED":
    case "AWARDED":
      return "finished";
    case "POSTPONED":
      return "postponed";
    case "SUSPENDED":
    case "CANCELLED":
      return "canceled";
    default:
      return "scheduled";
  }
}

function formatKickOff(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: footballConfig.timezone });
}

function mapMatchToDetail(match: FootballDataMatch): LiveMatchDetail {
  const status = mapMatchStatus(match.status);
  return {
    id: String(match.id),
    status,
    minute: null, // football-data.org's free tier doesn't expose the live clock
    competition: match.competition.name,
    kickOff: formatKickOff(match.utcDate),
    venue: match.venue ?? undefined,
    home: { name: match.homeTeam.name, score: match.score.fullTime.home },
    away: { name: match.awayTeam.name, score: match.score.fullTime.away },
    events: [],
    lineups: null,
    statistics: [],
  };
}

const competitionCodes: Record<CompetitionKey, string> = {
  laLiga: footballConfig.footballData.competitions.laLiga,
  championsLeague: footballConfig.footballData.competitions.championsLeague,
};

export const footballDataOrgProvider: FootballProvider = {
  async getTeamInfo(): Promise<TeamInfo | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },

  async getUpcomingFixtures(count): Promise<Fixture[] | null> {
    if (!isFootballDataConfigured) return null;
    return withCache(`fixtures:next:${count}`, () => fetchUpcomingFixtures(count), { ttlSeconds: footballConfig.cache.fixtures });
  },

  async getRecentResults(count): Promise<MatchResult[] | null> {
    if (!isFootballDataConfigured) return null;
    return withCache(`fixtures:last:${count}`, () => fetchRecentResults(count), { ttlSeconds: footballConfig.cache.historical });
  },

  async getLiveMatch(): Promise<LiveMatchDetail | null> {
    if (!isFootballDataConfigured) return null;
    // Never cached — live data is refreshed on its own short interval by the caller.
    const match = await fetchLiveMatch();
    return match ? mapMatchToDetail(match) : null;
  },

  async getMatchDetail(matchId): Promise<LiveMatchDetail | null> {
    if (!isFootballDataConfigured) return null;
    return withCache(
      `match:${matchId}`,
      async () => {
        const data = await footballDataFetch<FootballDataMatchResponse>(`/matches/${matchId}`);
        return data?.match ? mapMatchToDetail(data.match) : null;
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

  async getStandings(competition): Promise<StandingRow[] | null> {
    if (!isFootballDataConfigured) return null;
    const code = competitionCodes[competition];
    return withCache(`standings:${code}`, () => fetchStandings(code), { ttlSeconds: footballConfig.cache.standings });
  },

  async getTopScorers(): Promise<ScorerStat[] | null> {
    return null; // stays CMS-managed for now, per your instruction
  },

  async getTopAssists(): Promise<AssistStat[] | null> {
    return null; // stays CMS-managed for now, per your instruction
  },

  async getBestRatedPlayers(): Promise<RatedPlayer[] | null> {
    return null; // pending a data-provider decision — see comment at top of file
  },
};

// REAL_MADRID_TEAM_ID re-exported for /debug/football's configuration panel.
export { REAL_MADRID_TEAM_ID };
