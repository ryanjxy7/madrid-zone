import { apiFootballFetch, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import { getCurrentSeason } from "./season";
import type { ApiFootballFixture } from "./types";
import type { Fixture, MatchResult } from "@/types/football";

function formatFixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

/**
 * API-Football's free plan rejects the `next`/`last` query parameters
 * outright ("Free plans do not have access to the Last/Next parameter" —
 * seen live on /debug/football). So instead of asking the API to filter,
 * this pulls every fixture for the team's current season across all
 * competitions once (cached — see REVALIDATE.matchData) and sorts/filters
 * it locally into "upcoming" and "recent" below.
 */
async function fetchSeasonFixtures(): Promise<ApiFootballFixture[] | null> {
  const season = await getCurrentSeason();
  return apiFootballFetch<ApiFootballFixture[]>(
    "/fixtures",
    { team: REAL_MADRID_TEAM_ID, season: String(season) },
    { revalidate: REVALIDATE.matchData }
  );
}

export async function fetchUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  const data = await fetchSeasonFixtures();
  if (!data || data.length === 0) return null;

  const now = Date.now();
  const upcoming = data
    .filter((f) => new Date(f.fixture.date).getTime() > now)
    .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
    .slice(0, count);
  if (upcoming.length === 0) return null;

  return upcoming.map((f) => ({
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
  const data = await fetchSeasonFixtures();
  if (!data || data.length === 0) return null;

  const recent = data
    .filter((f) => FINISHED_STATUSES.has(f.fixture.status.short))
    .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
    .slice(0, count);
  if (recent.length === 0) return null;

  return recent.map((f) => {
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
