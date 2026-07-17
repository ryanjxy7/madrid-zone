/**
 * Thin fetch wrapper around API-Football v3 (api-sports.io). Configure via
 * API_FOOTBALL_KEY (see .env.example). Until it's set, `isApiFootballConfigured`
 * is false and src/lib/data/*.ts fall back to Sanity/placeholder data.
 *
 * Never throws — a failed request (bad key, rate limit, API-Football being
 * down) always resolves to `null` after a couple of retries, so callers
 * fall through to the next data source instead of a page-breaking error.
 *
 * Auth: this calls the direct api-sports.io host, which only needs the
 * `x-apisports-key` header. The `x-rapidapi-key` / `x-rapidapi-host` pair
 * is a *different* header scheme, only used if you instead access the API
 * via the RapidAPI marketplace gateway (api-football-v1.p.rapidapi.com) —
 * not applicable here since API_FOOTBALL_BASE_URL points at api-sports.io
 * directly.
 */

import { recordRequest } from "@/lib/football/cache/status";

const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";
const apiKey = process.env.API_FOOTBALL_KEY;

export const isApiFootballConfigured = Boolean(apiKey);

/** Real Madrid's API-Football team ID — override via env if it ever changes. */
export const REAL_MADRID_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "541";
/** LaLiga's API-Football league ID. */
export const LALIGA_LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID ?? "140";
/** UEFA Champions League's API-Football league ID (not currently used for any fetch, available for future use). */
export const CHAMPIONS_LEAGUE_ID = process.env.API_FOOTBALL_CHAMPIONS_LEAGUE_ID ?? "2";

/** How long Next.js caches each kind of data before re-checking the API. */
export const REVALIDATE = {
  /** Fixtures, results, standings, scorers, assists — updates around matches. */
  matchData: 21_600, // 6 hours
  /** Squad roster and season-aggregate team stats — rarely change. */
  seasonData: 86_400, // 24 hours
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Errors API-Football returns as 200 OK with an `errors` object instead of an HTTP error code. */
function extractApiErrors(json: unknown): string | null {
  if (!json || typeof json !== "object" || !("errors" in json)) return null;
  const errors = (json as { errors: unknown }).errors;
  if (!errors) return null;
  if (Array.isArray(errors) && errors.length === 0) return null;
  if (typeof errors === "object" && Object.keys(errors).length === 0) return null;
  return JSON.stringify(errors);
}

export async function apiFootballFetch<T>(
  path: string,
  params: Record<string, string> = {},
  { revalidate = REVALIDATE.matchData, retries = 2 }: { revalidate?: number | false; retries?: number } = {}
): Promise<T | null> {
  if (!isApiFootballConfigured) {
    console.error(`[API-Football] ${path} skipped — API_FOOTBALL_KEY is not set`);
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
        headers: { "x-apisports-key": apiKey as string },
        next: revalidate === false ? undefined : { revalidate },
      });
      const elapsedMs = Date.now() - startedAt;
      const remaining = res.headers.get("x-ratelimit-requests-remaining");

      if (res.ok) {
        const json = (await res.json()) as { response: T; results?: number };
        const apiError = extractApiErrors(json);

        if (apiError) {
          // API-Football returns HTTP 200 even for plan/parameter errors —
          // the failure is inside the JSON body, not the status code.
          console.error(
            `[API-Football] ${path} status=200 time=${elapsedMs}ms result=api-error error=${apiError}${remaining ? ` quotaRemaining=${remaining}` : ""}`
          );
          recordRequest({ endpoint: path, ok: false, timeMs: elapsedMs, error: `API error: ${apiError}` });
          return null;
        }

        console.log(
          `[API-Football] ${path} status=200 time=${elapsedMs}ms results=${json.results ?? "n/a"}${remaining ? ` quotaRemaining=${remaining}` : ""}`
        );
        recordRequest({ endpoint: path, ok: true, timeMs: elapsedMs, error: null });
        return json.response;
      }

      const body = await res.text();
      console.error(`[API-Football] ${path} status=${res.status} time=${elapsedMs}ms attempt=${attempt + 1} body=${body.slice(0, 500)}`);

      // Bad key / bad request / not found won't fix itself on retry — fail fast.
      if (res.status < 500 && res.status !== 429) {
        recordRequest({ endpoint: path, ok: false, timeMs: elapsedMs, error: `HTTP ${res.status}: ${body.slice(0, 200)}` });
        return null;
      }

      lastError = new Error(`API-Football request failed (${res.status}): ${body.slice(0, 200)}`);
    } catch (error) {
      const elapsedMs = Date.now() - startedAt;
      console.error(`[API-Football] ${path} network-error time=${elapsedMs}ms attempt=${attempt + 1}:`, error);
      lastError = error;
    }

    if (attempt < retries) {
      await sleep(500 * 2 ** attempt); // 500ms, then 1000ms
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error(`[API-Football] ${path} gave up after ${retries + 1} attempt(s):`, lastError);
  recordRequest({ endpoint: path, ok: false, timeMs: 0, error: message });
  return null;
}
