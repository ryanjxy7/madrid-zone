/**
 * Minimal shapes for the football-data.org v4 fields this project reads.
 * Not exhaustive — extend as more endpoints are wired in.
 * Docs: https://docs.football-data.org/general/v4/
 */

export interface FootballDataTeamRef {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
}

export interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string; // SCHEDULED | TIMED | IN_PLAY | PAUSED | FINISHED | SUSPENDED | POSTPONED | CANCELLED | AWARDED
  venue?: string | null;
  competition: { id: number; name: string; code: string };
  homeTeam: FootballDataTeamRef;
  awayTeam: FootballDataTeamRef;
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
  };
}

export interface FootballDataMatchesResponse {
  matches: FootballDataMatch[];
}

export interface FootballDataMatchResponse {
  match: FootballDataMatch;
}

export interface FootballDataStandingRow {
  position: number;
  team: { id: number; name: string; crest: string | null };
  points: number;
}

export interface FootballDataStandingsGroup {
  type: string; // "TOTAL" | "HOME" | "AWAY"
  table: FootballDataStandingRow[];
}

export interface FootballDataStandingsResponse {
  standings: FootballDataStandingsGroup[];
}
