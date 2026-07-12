/**
 * Minimal shapes for the API-Football v3 fields this project reads. Not
 * exhaustive — extend as more endpoints are wired in.
 * Docs: https://www.api-football.com/documentation-v3
 */

export interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    venue: { name: string | null; city: string | null };
    status: { short: string };
  };
  league: { id: number; name: string; round: string };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
}

export interface ApiFootballStandingRow {
  rank: number;
  points: number;
  team: { id: number; name: string; logo: string };
}

export interface ApiFootballTopScorer {
  player: { name: string };
  statistics: Array<{ goals: { total: number | null; assists: number | null } }>;
}

export interface ApiFootballSquadPlayer {
  player: {
    id: number;
    name: string;
    photo: string;
    nationality: string;
  };
  statistics: Array<{
    games: { position: string; number: number | null };
  }>;
}

export interface ApiFootballTeamStatistics {
  fixtures: {
    played: { total: number };
    wins: { total: number };
    draws: { total: number };
    loses: { total: number };
  };
  goals: {
    for: { total: { total: number }; average: { total: string } };
  };
}

export interface ApiFootballLeague {
  league: { id: number; name: string; type: string };
  seasons: Array<{ year: number; start: string; end: string; current: boolean }>;
}
