/**
 * Minimal Sanity Content Lake client using the HTTP query API directly, so
 * no extra dependency is required until the project is ready to adopt the
 * full `@sanity/client` / `next-sanity` toolchain (recommended once
 * previews, drafts, and image URL building are needed).
 *
 * Configure by setting SANITY_PROJECT_ID and SANITY_DATASET (see
 * .env.example). Until those are set, `isSanityConfigured` is false and
 * every page falls back to the placeholder data in src/data/placeholder.
 */

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2024-01-01";
const token = process.env.SANITY_API_TOKEN;
const useCdn = process.env.SANITY_USE_CDN !== "false";

export const isSanityConfigured = Boolean(projectId);

function endpoint(): string {
  const host = useCdn && !token ? "apicdn.sanity.io" : "api.sanity.io";
  return `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}`;
}

/**
 * Runs a GROQ query against the configured Sanity project. Returns `null`
 * when Sanity isn't configured so callers can fall back to placeholder
 * data — see src/lib/data/*.ts for the fallback pattern.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string> = {},
  { revalidate = 60 }: { revalidate?: number | false } = {}
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  const url = new URL(endpoint());
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: revalidate === false ? undefined : { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { result: T };
  return json.result;
}
