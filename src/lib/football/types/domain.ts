/**
 * New domain types for concepts the existing @/types/football didn't need
 * before (live match centre, player pages, leaderboards). Existing types
 * (Fixture, MatchResult, StandingRow, StatTile, ScorerStat, AssistStat,
 * Player, SquadGroup) are reused as-is from @/types/football — nothing
 * here duplicates them.
 */

export interface TeamInfo {
  id: string;
  name: string;
  country?: string;
  venue?: string;
  coach?: string;
}

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "canceled";

export interface MatchEvent {
  id: string;
  minute: number;
  type: "goal" | "yellow-card" | "red-card" | "substitution" | "penalty" | "own-goal";
  team: "home" | "away";
  player: string;
  secondaryPlayer?: string; // assist provider, or player coming on for a substitution
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: string;
  position: string;
  isSubstitute: boolean;
  rating?: number;
}

export interface MatchLineups {
  home: { formation?: string; players: LineupPlayer[] };
  away: { formation?: string; players: LineupPlayer[] };
}

export interface MatchStatistic {
  label: string;
  home: string;
  away: string;
}

export interface LiveMatchDetail {
  id: string;
  status: MatchStatus;
  minute: number | null;
  competition: string;
  kickOff: string;
  venue?: string;
  home: { name: string; score: number | null };
  away: { name: string; score: number | null };
  events: MatchEvent[];
  lineups: MatchLineups | null;
  statistics: MatchStatistic[];
}

export interface PlayerProfile {
  id: string;
  slug: string;
  name: string;
  position: string;
  number: string;
  nationality?: string;
  age?: number;
  photo?: string;
  photoFocus?: { x: number; y: number };
}

export interface PlayerSeasonStats {
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number | null;
}

export interface RatedPlayer {
  rank: number;
  name: string;
  team: string;
  goals: number;
  assists: number;
  rating: number | null;
}
