import type { Fixture, MatchResult } from "@/types/football";
import { apiFootballProvider as activeProvider } from "../providers/apiFootball";

export async function getUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  return activeProvider.getUpcomingFixtures(count);
}

export async function getRecentResults(count = 5): Promise<MatchResult[] | null> {
  return activeProvider.getRecentResults(count);
}
