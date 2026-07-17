/**
 * Raw API-Football v3 shapes for the live-match-centre endpoints
 * (events/lineups/statistics) — not covered by the older
 * src/lib/sports-api/api-football/types.ts, which predates the Live Match
 * Centre feature. Same discipline as every other provider's raw types:
 * official and documented (https://www.api-football.com/documentation-v3),
 * but every field still optional-by-convention since this project can't
 * live-verify responses from this environment.
 */

export interface ApiFootballEventFixture {
  fixture: {
    id: number;
    date: string;
    status: { short?: string; elapsed?: number | null };
    venue: { name: string | null };
  };
  league: { name: string };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: { home: number | null; away: number | null };
}

export interface ApiFootballEvent {
  time: { elapsed?: number; extra?: number | null };
  team: { id?: number };
  player: { name?: string };
  assist: { name?: string | null };
  type?: "Goal" | "Card" | "subst" | "Var" | string;
  detail?: string;
}

export type ApiFootballEventsResponse = ApiFootballEvent[];

export interface ApiFootballLineupEntry {
  player?: { id?: number; name?: string; number?: number; pos?: string | null };
}

export interface ApiFootballLineupSide {
  team: { id?: number };
  formation?: string;
  startXI?: ApiFootballLineupEntry[];
  substitutes?: ApiFootballLineupEntry[];
}

export type ApiFootballLineupsResponse = ApiFootballLineupSide[];

export interface ApiFootballStatisticsSide {
  team: { id?: number };
  statistics?: { type?: string; value?: string | number | null }[];
}

export type ApiFootballStatisticsResponse = ApiFootballStatisticsSide[];
