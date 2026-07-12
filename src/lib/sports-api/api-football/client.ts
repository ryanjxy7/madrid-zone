/**
 * Thin fetch wrapper around API-Football v3 (api-sports.io). Configure via
 * API_FOOTBALL_KEY (see .env.example). Until it's set, `isApiFootballConfigured`
 * is false and src/lib/data/*.ts fall back to Sanity/placeholder data.
 *
 * Never throws — a failed request (bad key, rate limit, API-Football being
 * down) always resolves to `null` after a couple of retries, so callers
 * fall through to the next data source instead of a page-breaking error.
 */

const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";
const apiKey = process.env.API_FOOTBALL_KEY;

export const isApiFootballConfigured = Boolean(apiKey);

/** Real Madrid's API-Football team ID — override via env if it ever changes. */
export const REAL_MADRID_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "541";
/** LaLiga's API-Football league ID. */
export const LALIGA_LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID ?? "140";

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

export async function apiFootballFetch<T>(
  path: string,
  params: Record<string, string> = {},
  { revalidate = REVALIDATE.matchData, retries = 2 }: { revalidate?: number | false; retries?: number } = {}
): Promise<T | null> {
  if (!isApiFootballConfigured) return null;

  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: { "x-apisports-key": apiKey as string },
        next: revalidate === false ? undefined : { revalidate },
      });

      if (res.ok) {
        const json = (await res.json()) as { response: T };
        return json.response;
      }

      // Bad key / bad request won't fix itself on retry — fail fast.
      if (res.status < 500 && res.status !== 429) {
        console.error(`[api-football] ${path} failed (${res.status}): ${await res.text()}`);
        return null;
      }

      lastError = new Error(`API-Football request failed (${res.status})`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await sleep(500 * 2 ** attempt); // 500ms, then 1000ms
    }
  }

  console.error(`[api-football] ${path} failed after ${retries + 1} attempt(s):`, lastError);
  return null;
}
