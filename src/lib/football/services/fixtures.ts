import type { Fixture, MatchResult } from "@/types/football";
import { sofascoreProvider } from "../providers/sofascore";

export async function getUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  return sofascoreProvider.getUpcomingFixtures(count);
}

export async function getRecentResults(count = 5): Promise<MatchResult[] | null> {
  return sofascoreProvider.getRecentResults(count);
}
