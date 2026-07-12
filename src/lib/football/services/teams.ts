import { espnProvider as activeProvider } from "../providers/espn";
import type { TeamInfo } from "../types/domain";

/** Real Madrid team info (name, country, venue, coach). */
export async function getTeamInfo(): Promise<TeamInfo | null> {
  return activeProvider.getTeamInfo();
}
