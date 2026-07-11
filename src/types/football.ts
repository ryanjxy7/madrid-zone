/**
 * Football data types. Shapes mirror what API-Football (api-sports.io)
 * responses map onto after normalisation (see src/lib/sports-api), so the
 * placeholder data source can be swapped for a live feed without touching
 * consuming components.
 */

export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface Player {
  id: string;
  number: string;
  name: string;
  role: string;
  position: PlayerPosition;
  image: string;
  nationality?: string;
}

export interface SquadGroup {
  label: string;
  players: Player[];
}

export type TransferDirection = "IN" | "OUT" | "LOAN";
export type TransferStatus =
  | "RUMOUR"
  | "TALKS"
  | "AGREED"
  | "MEDICAL"
  | "ADVANCED"
  | "CONFIRMED";

export interface TransferDeal {
  id: string;
  player: string;
  position: string;
  direction: TransferDirection;
  status: TransferStatus;
  fee: string;
  latest: string;
}

export type RumourTier = "TIER 1" | "TIER 2" | "TIER 3";

export interface Rumour {
  id: string;
  source: string;
  tier: RumourTier;
  text: string;
  time: string;
}

export interface Fixture {
  id: string;
  opponent: string;
  competition: string;
  date: string;
  venue?: string;
  kickOff?: string;
  isHome?: boolean;
}

export type MatchResultOutcome = "W" | "D" | "L";

export interface MatchResult {
  id: string;
  match: string;
  competition: string;
  outcome: MatchResultOutcome;
}

export interface StandingRow {
  position: number;
  team: string;
  points: number;
  isHighlighted?: boolean;
}

export interface StatTile {
  value: string;
  label: string;
  sub: string;
}

export interface ScorerStat {
  rank: number;
  name: string;
  goals: number;
  barPercent: number;
}

export interface AssistStat {
  rank: number;
  name: string;
  assists: number;
}

export interface GoalkeepingStat {
  label: string;
  value: string;
}
