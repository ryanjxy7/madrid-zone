import { apiFootballProvider as activeProvider } from "../providers/apiFootball";
import type { TeamInfo } from "../types/domain";

/** Real Madrid team info (name, country, venue, coach). */
export async function getTeamInfo(): Promise<TeamInfo | null> {
  return activeProvider.getTeamInfo();
}
