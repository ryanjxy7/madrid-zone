import {
  placeholderFixtures,
  placeholderNextMatch,
  placeholderResults,
  placeholderStandings,
  placeholderUpcoming,
} from "@/data/placeholder/matches";
import {
  fetchRecentResults,
  fetchStandings,
  fetchUpcomingFixtures,
  isApiFootballConfigured,
} from "@/lib/sports-api/api-football";
import type { Fixture, MatchResult, StandingRow } from "@/types/football";

const CURRENT_SEASON = new Date().getFullYear();

export async function getNextMatch(): Promise<Fixture> {
  if (isApiFootballConfigured) {
    const upcoming = await fetchUpcomingFixtures(1);
    if (upcoming?.[0]) return upcoming[0];
  }
  return placeholderNextMatch;
}

export async function getFixtures(): Promise<Fixture[]> {
  return placeholderFixtures;
}

export async function getUpcomingFixtures(): Promise<Fixture[]> {
  if (isApiFootballConfigured) {
    const upcoming = await fetchUpcomingFixtures(4);
    if (upcoming) return upcoming;
  }
  return placeholderUpcoming;
}

export async function getRecentResults(): Promise<MatchResult[]> {
  if (isApiFootballConfigured) {
    const results = await fetchRecentResults(4);
    if (results) return results;
  }
  return placeholderResults;
}

export async function getStandings(): Promise<StandingRow[]> {
  if (isApiFootballConfigured) {
    const standings = await fetchStandings(CURRENT_SEASON);
    if (standings) return standings;
  }
  return placeholderStandings;
}
