/**
 * The single entry point for football data. Every page, component, and
 * data-layer module in this app must import from here — never reach into
 * providers/sofascore.ts, providers/sofascoreClient.ts, or any Sofascore
 * endpoint directly. That boundary is what lets the data source be swapped
 * later (see providers/types.ts) without touching a single page or
 * component: replace the provider this file wires up, keep every export
 * below identical.
 *
 * Server-only: nothing here should be imported from a Client Component.
 * Pages call these functions in Server Components / route handlers and
 * pass plain data down as props.
 */
export {
  getUpcomingFixtures,
  getRecentResults,
} from "./services/fixtures";
export {
  getLiveMatch,
  getMatchDetail,
} from "./services/matches";
export {
  getSquad,
  getPlayerProfile,
  getPlayerProfileBySlug,
  getPlayerSeasonStats,
} from "./services/players";
export {
  getStandings,
  getTopScorers,
  getTopAssists,
  getBestRatedPlayers,
} from "./services/standings";
export { getTeamInfo } from "./services/teams";
export { slugifyPlayerName } from "./slug";

export { footballConfig } from "@/config/football";
export type { CompetitionKey } from "@/config/football";
export { getCacheStatus } from "./cache/cache";
export { getProviderStatus } from "./cache/status";

export type {
  LiveMatchDetail,
  MatchEvent,
  MatchLineups,
  MatchStatistic,
  PlayerProfile,
  PlayerSeasonStats,
  RatedPlayer,
  TeamInfo,
} from "./types/domain";
