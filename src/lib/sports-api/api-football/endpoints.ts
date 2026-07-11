import type { AssistStat, Fixture, MatchResult, ScorerStat, StandingRow } from "@/types/football";
import { apiFootballFetch, LALIGA_LEAGUE_ID, REAL_MADRID_TEAM_ID } from "./client";
import type { ApiFootballFixture, ApiFootballStandingRow, ApiFootballTopScorer } from "./types";

function formatFixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export async function fetchUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  const data = await apiFootballFetch<ApiFootballFixture[]>("/fixtures", {
    team: REAL_MADRID_TEAM_ID,
    next: String(count),
  });
  if (!data) return null;

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
  const data = await apiFootballFetch<ApiFootballFixture[]>("/fixtures", {
    team: REAL_MADRID_TEAM_ID,
    last: String(count),
  });
  if (!data) return null;

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

export async function fetchStandings(season: number): Promise<StandingRow[] | null> {
  const data = await apiFootballFetch<Array<{ league: { standings: ApiFootballStandingRow[][] } }>>(
    "/standings",
    { league: LALIGA_LEAGUE_ID, season: String(season) }
  );
  const table = data?.[0]?.league.standings?.[0];
  if (!table) return null;

  return table.map((row) => ({
    position: row.rank,
    team: row.team.name,
    points: row.points,
    isHighlighted: row.team.id.toString() === REAL_MADRID_TEAM_ID,
  }));
}

export async function fetchTopScorers(season: number): Promise<ScorerStat[] | null> {
  const data = await apiFootballFetch<ApiFootballTopScorer[]>("/players/topscorers", {
    league: LALIGA_LEAGUE_ID,
    season: String(season),
    team: REAL_MADRID_TEAM_ID,
  });
  if (!data) return null;

  const top = data[0]?.statistics[0]?.goals.total ?? 1;
  return data.map((entry, index) => ({
    rank: index + 1,
    name: entry.player.name,
    goals: entry.statistics[0]?.goals.total ?? 0,
    barPercent: Math.round(((entry.statistics[0]?.goals.total ?? 0) / top) * 100),
  }));
}

export async function fetchTopAssists(season: number): Promise<AssistStat[] | null> {
  const data = await apiFootballFetch<ApiFootballTopScorer[]>("/players/topassists", {
    league: LALIGA_LEAGUE_ID,
    season: String(season),
    team: REAL_MADRID_TEAM_ID,
  });
  if (!data) return null;

  return data.map((entry, index) => ({
    rank: index + 1,
    name: entry.player.name,
    assists: entry.statistics[0]?.goals.assists ?? 0,
  }));
}
