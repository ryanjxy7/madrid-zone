import { apiFootballProvider as activeProvider } from "../providers/apiFootball";
import type { LiveMatchDetail } from "../types/domain";

/** Real Madrid's live match right now, or null if they're not playing. */
export async function getLiveMatch(): Promise<LiveMatchDetail | null> {
  return activeProvider.getLiveMatch();
}

/** Full detail (events, lineups, stats) for a specific match, live or finished. */
export async function getMatchDetail(matchId: string): Promise<LiveMatchDetail | null> {
  return activeProvider.getMatchDetail(matchId);
}
