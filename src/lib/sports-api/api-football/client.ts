/**
 * Thin fetch wrapper around API-Football v3 (api-sports.io). Configure via
 * API_FOOTBALL_KEY (see .env.example). Until it's set, `isApiFootballConfigured`
 * is false and src/lib/data/matches.ts + stats.ts fall back to placeholder data.
 */

const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";
const apiKey = process.env.API_FOOTBALL_KEY;

export const isApiFootballConfigured = Boolean(apiKey);

/** Real Madrid's API-Football team ID — override via env if it ever changes. */
export const REAL_MADRID_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "541";
/** LaLiga's API-Football league ID. */
export const LALIGA_LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID ?? "140";

export async function apiFootballFetch<T>(
  path: string,
  params: Record<string, string> = {},
  { revalidate = 300 }: { revalidate?: number | false } = {}
): Promise<T | null> {
  if (!isApiFootballConfigured) return null;

  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": apiKey as string },
    next: revalidate === false ? undefined : { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API-Football request failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { response: T };
  return json.response;
}
