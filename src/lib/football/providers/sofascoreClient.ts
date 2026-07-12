import { footballConfig } from "@/config/football";
import { recordRequest } from "../cache/status";

/**
 * Raw fetch layer for Sofascore's unofficial API. Server-only — this file
 * must never be imported from a Client Component, and nothing here is
 * exposed to the browser (no API key exists to leak, but the endpoint
 * paths themselves stay server-side too, on general principle).
 *
 * Sofascore has no public API contract: no key, no rate-limit headers to
 * respect, no documented error shape, and it actively runs anti-bot
 * protection that can block datacenter IPs (including Vercel's) without
 * warning. This wrapper does what it reasonably can — realistic browser
 * headers, retries with backoff, timeouts, structured logging — but it
 * cannot guarantee reliability the way a contracted API can.
 */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sofascoreFetch<T>(path: string): Promise<T | null> {
  const url = `${footballConfig.api.baseUrl}${path}`;
  let lastError: unknown;

  for (let attempt = 0; attempt <= footballConfig.api.retries; attempt++) {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), footballConfig.api.timeoutMs);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        // A realistic browser UA reduces (does not eliminate) the chance
        // of an immediate bot-detection block on an unofficial endpoint.
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
        console.log(`[Sofascore] ${path} status=200 time=${timeMs}ms`);
        recordRequest({ endpoint: path, ok: true, timeMs, error: null });
        return json;
      }

      const body = await res.text();
      console.error(`[Sofascore] ${path} status=${res.status} time=${timeMs}ms attempt=${attempt + 1} body=${body.slice(0, 300)}`);

      // 403/429 usually mean bot-detection or rate-limiting kicked in —
      // retrying immediately just burns another attempt against the same
      // block, but a short backoff occasionally clears a transient block.
      if (res.status === 404) {
        recordRequest({ endpoint: path, ok: false, timeMs, error: `HTTP 404` });
        return null; // wrong ID / doesn't exist — retrying won't help
      }

      lastError = new Error(`Sofascore request failed (${res.status})`);
    } catch (error) {
      clearTimeout(timeout);
      const timeMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Sofascore] ${path} network-error time=${timeMs}ms attempt=${attempt + 1}: ${message}`);
      lastError = error;
    }

    if (attempt < footballConfig.api.retries) {
      await sleep(600 * 2 ** attempt);
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error(`[Sofascore] ${path} gave up after ${footballConfig.api.retries + 1} attempt(s): ${message}`);
  recordRequest({ endpoint: path, ok: false, timeMs: 0, error: message });
  return null;
}
