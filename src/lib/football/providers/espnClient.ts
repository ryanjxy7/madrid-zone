import { footballConfig } from "@/config/football";
import { recordRequest } from "../cache/status";

/**
 * Raw fetch layer for ESPN's unofficial site API. Server-only, same
 * discipline as sofascoreClient.ts. ESPN's hidden API is widely used by
 * hobby projects and empirically far more tolerant of cloud/datacenter IPs
 * than Sofascore's Cloudflare-protected endpoints — but it's still
 * unofficial: no key, no documented contract, no SLA, can change or block
 * without warning.
 */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** `url` must be a full URL — ESPN nests different endpoint families under different hosts/paths, so callers build the full path rather than a fixed base + path like the Sofascore client. */
export async function espnFetch<T>(url: string): Promise<T | null> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= footballConfig.espn.retries; attempt++) {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), footballConfig.espn.timeoutMs);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        cache: "no-store", // caching is handled explicitly by src/lib/football/cache
      });
      clearTimeout(timeout);
      const timeMs = Date.now() - startedAt;

      if (res.ok) {
        const json = (await res.json()) as T;
        console.log(`[ESPN] ${url} status=200 time=${timeMs}ms`);
        recordRequest({ endpoint: url, ok: true, timeMs, error: null });
        return json;
      }

      const body = await res.text();
      console.error(`[ESPN] ${url} status=${res.status} time=${timeMs}ms attempt=${attempt + 1} body=${body.slice(0, 300)}`);

      if (res.status === 404) {
        recordRequest({ endpoint: url, ok: false, timeMs, error: "HTTP 404" });
        return null; // wrong ID / doesn't exist — retrying won't help
      }

      lastError = new Error(`ESPN request failed (${res.status})`);
    } catch (error) {
      clearTimeout(timeout);
      const timeMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ESPN] ${url} network-error time=${timeMs}ms attempt=${attempt + 1}: ${message}`);
      lastError = error;
    }

    if (attempt < footballConfig.espn.retries) {
      await sleep(600 * 2 ** attempt);
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error(`[ESPN] ${url} gave up after ${footballConfig.espn.retries + 1} attempt(s): ${message}`);
  recordRequest({ endpoint: url, ok: false, timeMs: 0, error: message });
  return null;
}
