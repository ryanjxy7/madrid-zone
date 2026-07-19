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
  /** Focal point (0-1 fractions) from the editor's Sanity hotspot — drives the CSS crop on cards whose on-screen aspect ratio varies by breakpoint. Undefined defaults to a plain center crop. */
  imageFocus?: { x: number; y: number };
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
  photo: string;
  /** Focal point (0-1 fractions) from the editor's Sanity hotspot — see Player.imageFocus. */
  photoFocus?: { x: number; y: number };
  position: string;
  direction: TransferDirection;
  status: TransferStatus;
  fee: string;
  latest: string;
  /** Short badge for the other club involved, e.g. "PL", "FA", "CLB" — only used when counterpartClub isn't set. Real Madrid's own badge is always shown as "RMA" and doesn't need a field. */
  counterpartMark?: string;
  /** The other club's real name, when the editor picked one from Clubs — drives a real crest lookup instead of the generic counterpartMark badge. */
  counterpartClub?: string;
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
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
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
  team?: string;
  image: string;
  imageFocus?: { x: number; y: number };
}

export interface AssistStat {
  rank: number;
  name: string;
  assists: number;
  team?: string;
  image: string;
  imageFocus?: { x: number; y: number };
}

export interface GoalkeepingStat {
  label: string;
  value: string;
}

export interface HomeStatRow {
  label: string;
  player: string;
  value: string;
  barPercent: number;
}

/** One row in the Stats page's tabbed "Stat Leaders" widget (Appearances / Minutes / Goalkeeping / Top Rated). */
export interface StatLeaderRow {
  rank: number;
  name: string;
  value: string;
  barPercent: number;
  image: string;
  imageFocus?: { x: number; y: number };
}

export interface StatLeaderCategory {
  key: string;
  label: string;
  rows: StatLeaderRow[];
}
