import { apiFootballFetch, LALIGA_LEAGUE_ID, REVALIDATE } from "./client";
import type { ApiFootballLeague } from "./types";

/**
 * European club football seasons are named by the year they *start* (the
 * 2025/26 season is season "2025" on API-Football), not the calendar year.
 * A season generally runs August–May, so a plain `new Date().getFullYear()`
 * is wrong for roughly 7 months of the year — e.g. in January 2026 the
 * active season is still "2025", not "2026". Getting this wrong silently
 * empties every season-scoped endpoint (standings, squad, team stats, top
 * scorers/assists) even with a perfectly valid API key, because there's
 * simply no data yet under the wrong season number.
 */
function heuristicSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  return month >= 7 ? year : year - 1;
}

/**
 * Asks API-Football directly which season it currently considers active
 * for a given league (the `current: true` flag on /leagues), rather than
 * guessing from the calendar. Falls back to the month-based heuristic if
 * the lookup itself fails, so this never blocks the rest of the app.
 */
export async function fetchCurrentSeason(leagueId: string = LALIGA_LEAGUE_ID): Promise<number | null> {
  const data = await apiFootballFetch<ApiFootballLeague[]>(
    "/leagues",
    { id: leagueId },
    { revalidate: REVALIDATE.seasonData }
  );
  const current = data?.[0]?.seasons?.find((season) => season.current);
  return current?.year ?? null;
}

let cachedSeason: { value: number; expiresAt: number } | null = null;

/**
 * The season number to use for every season-scoped API-Football call in
 * this app. Cached in-memory per server instance for a few minutes on top
 * of the underlying fetch cache, since this is called from several data
 * functions on the same page render.
 */
export async function getCurrentSeason(): Promise<number> {
  const now = Date.now();
  if (cachedSeason && cachedSeason.expiresAt > now) {
    return cachedSeason.value;
  }

  const detected = await fetchCurrentSeason();
  const value = detected ?? heuristicSeason();
  cachedSeason = { value, expiresAt: now + 5 * 60 * 1000 };
  return value;
}
