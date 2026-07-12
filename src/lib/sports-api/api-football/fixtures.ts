import type { Fixture, MatchResult } from "@/types/football";
import { apiFootballFetch, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { ApiFootballFixture } from "./types";

function formatFixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export async function fetchUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  const data = await apiFootballFetch<ApiFootballFixture[]>(
    "/fixtures",
    { team: REAL_MADRID_TEAM_ID, next: String(count) },
    { revalidate: REVALIDATE.matchData }
  );
  if (!data || data.length === 0) return null;

  return data.map((f) => ({
    id: String(f.fixture.id),
    opponent:
      f.teams.home.id.toString() === REAL_MADRID_TEAM_ID
        ? `Real Madrid vs ${f.teams.away.name}`
        : `${f.teams.home.name} vs Real Madrid`,
    competition: f.league.name,
    date: formatFixtureDate(f.fixture.date),
    venue: f.fixture.venue.name ?? undefined,
    isHome: f.teams.home.id.toString() === REAL_MADRID_TEAM_ID,
  }));
}

export async function fetchRecentResults(count = 5): Promise<MatchResult[] | null> {
  const data = await apiFootballFetch<ApiFootballFixture[]>(
    "/fixtures",
    { team: REAL_MADRID_TEAM_ID, last: String(count) },
    { revalidate: REVALIDATE.matchData }
  );
  if (!data || data.length === 0) return null;

  return data.map((f) => {
    const isHome = f.teams.home.id.toString() === REAL_MADRID_TEAM_ID;
    const madridGoals = isHome ? f.goals.home : f.goals.away;
    const oppGoals = isHome ? f.goals.away : f.goals.home;
    const outcome = madridGoals === oppGoals ? "D" : madridGoals! > oppGoals! ? "W" : "L";
    return {
      id: String(f.fixture.id),
      match: `${f.teams.home.name} ${f.goals.home}–${f.goals.away} ${f.teams.away.name}`,
      competition: f.league.name,
      outcome,
    };
  });
}
