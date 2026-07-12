/**
 * Explicit stale-on-error cache for the football data layer.
 *
 * This is deliberately separate from (and on top of) Next.js's built-in
 * `fetch` data cache. Next's cache stores successful responses and
 * revalidates them in the background, but if a revalidation fetch itself
 * fails, that failure propagates — it does not fall back to serving the
 * previous value. Since Sofascore is an unofficial, unsupported API that
 * can fail or get rate-limited at any time, this module guarantees "serve
 * the last known-good value instead of nothing" as an explicit, testable
 * behaviour rather than relying on framework internals.
 *
 * Caveat, stated plainly: this is an in-memory Map, scoped to one running
 * server instance. It persists across requests handled by the same warm
 * Vercel serverless instance, but not across cold starts or between
 * concurrent instances. For guaranteed cross-instance persistence, swap
 * this for Vercel KV / Upstash Redis — the withCache() call signature
 * below wouldn't need to change at any call site if you do.
 */

interface CacheEntry<T> {
  value: T;
  fetchedAt: number;
  key: string;
}

const store = new Map<string, CacheEntry<unknown>>();

export interface CacheStatusEntry {
  key: string;
  fetchedAt: string;
  ageSeconds: number;
}

/** For /debug/football — a snapshot of everything currently cached. */
export function getCacheStatus(): CacheStatusEntry[] {
  return Array.from(store.values()).map((entry) => ({
    key: entry.key,
    fetchedAt: new Date(entry.fetchedAt).toISOString(),
    ageSeconds: Math.round((Date.now() - entry.fetchedAt) / 1000),
  }));
}

export interface WithCacheOptions {
  /** Seconds before a cached value is considered stale and re-fetched. */
  ttlSeconds: number;
  /** Called on both fresh and cache-error paths, for /debug/football + logs. */
  onError?: (error: unknown, servedStale: boolean) => void;
}

/**
 * Returns a fresh value if the cache is empty or older than `ttlSeconds`,
 * otherwise the cached value. If the fetch fails for any reason, falls
 * back to the last cached value (however old) rather than throwing —
 * only propagates the failure (returns null) if nothing has ever been
 * cached successfully for this key.
 */
export async function withCache<T>(key: string, fetcher: () => Promise<T | null>, { ttlSeconds, onError }: WithCacheOptions): Promise<T | null> {
  const cached = store.get(key) as CacheEntry<T> | undefined;
  const isFresh = cached && Date.now() - cached.fetchedAt < ttlSeconds * 1000;

  if (isFresh) {
    return cached.value;
  }

  try {
    const fresh = await fetcher();
    if (fresh === null) {
      // A clean "no data" response (not an error) — don't cache nulls,
      // but do fall back to stale data if we have it rather than showing
      // nothing.
      if (cached) {
        onError?.(new Error("Fetch returned null"), true);
        return cached.value;
      }
      return null;
    }
    store.set(key, { value: fresh, fetchedAt: Date.now(), key });
    return fresh;
  } catch (error) {
    if (cached) {
      onError?.(error, true);
      return cached.value;
    }
    onError?.(error, false);
    return null;
  }
}
