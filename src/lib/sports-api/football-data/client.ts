/**
 * Thin fetch wrapper around football-data.org v4. Configure via
 * FOOTBALL_DATA_API_KEY (free signup at football-data.org/client/register
 * — see .env.example). Until it's set, `isFootballDataConfigured` is false
 * and src/lib/data/*.ts fall back to Sanity/placeholder data.
 *
 * Never throws — a failed request (bad key, rate limit, service down)
 * always resolves to `null` after a couple of retries, so callers fall
 * through to the next data source instead of a page-breaking error.
 *
 * Auth: `X-Auth-Token` header (not a query param, not Bearer). Free tier
 * is rate-limited to 10 requests/minute across the whole account — the
 * 429 branch below retries with backoff for exactly that reason.
 */

import { recordRequest } from "@/lib/football/cache/status";

const baseUrl = process.env.FOOTBALL_DATA_BASE_URL ?? "https://api.football-data.org/v4";
const apiKey = process.env.FOOTBALL_DATA_API_KEY;

export const isFootballDataConfigured = Boolean(apiKey);

/** Real Madrid's football-data.org team ID — override via env if it ever changes. */
export const REAL_MADRID_TEAM_ID = process.env.FOOTBALL_DATA_TEAM_ID ?? "86";
/** La Liga's football-data.org competition code. */
export const LALIGA_COMPETITION_CODE = process.env.FOOTBALL_DATA_LALIGA_CODE ?? "PD";
/** UEFA Champions League's football-data.org competition code. */
export const CHAMPIONS_LEAGUE_COMPETITION_CODE = process.env.FOOTBALL_DATA_UCL_CODE ?? "CL";

/** How long Next.js caches each kind of data before re-checking the API. */
export const REVALIDATE = {
  /** Fixtures, results, standings — updates around matches. */
  matchData: 21_600, // 6 hours
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function footballDataFetch<T>(
  path: string,
  params: Record<string, string> = {},
  { revalidate = REVALIDATE.matchData, retries = 2 }: { revalidate?: number | false; retries?: number } = {}
): Promise<T | null> {
  if (!isFootballDataConfigured) {
    console.error(`[football-data.org] ${path} skipped — FOOTBALL_DATA_API_KEY is not set`);
    return null;
  }

  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const startedAt = Date.now();
    try {
      const res = await fetch(url.toString(), {
        headers: { "X-Auth-Token": apiKey as string },
        next: revalidate === false ? undefined : { revalidate },
      });
      const elapsedMs = Date.now() - startedAt;

      if (res.ok) {
        const json = (await res.json()) as T;
        console.log(`[football-data.org] ${path} status=200 time=${elapsedMs}ms`);
        recordRequest({ endpoint: path, ok: true, timeMs: elapsedMs, error: null });
        return json;
      }

      const body = await res.text();
      console.error(`[football-data.org] ${path} status=${res.status} time=${elapsedMs}ms attempt=${attempt + 1} body=${body.slice(0, 500)}`);

      // Bad key / bad request / not found won't fix itself on retry — fail fast.
      // 429 (rate limit) and 5xx are worth retrying with backoff.
      if (res.status < 500 && res.status !== 429) {
        recordRequest({ endpoint: path, ok: false, timeMs: elapsedMs, error: `HTTP ${res.status}: ${body.slice(0, 200)}` });
        return null;
      }

      lastError = new Error(`football-data.org request failed (${res.status}): ${body.slice(0, 200)}`);
    } catch (error) {
      const elapsedMs = Date.now() - startedAt;
      console.error(`[football-data.org] ${path} network-error time=${elapsedMs}ms attempt=${attempt + 1}:`, error);
      lastError = error;
    }

    if (attempt < retries) {
      await sleep(1000 * 2 ** attempt); // 1s, then 2s — gentler than API-Football given the 10 req/min cap
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error(`[football-data.org] ${path} gave up after ${retries + 1} attempt(s):`, lastError);
  recordRequest({ endpoint: path, ok: false, timeMs: 0, error: message });
  return null;
}
