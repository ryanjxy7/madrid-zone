/**
 * Debug-only raw request helper — deliberately separate from
 * src/lib/sports-api/api-football/client.ts (the production client),
 * because this needs to surface the FULL raw response (status, headers,
 * body, API-Football's in-body `errors` field) for a human to read,
 * where the production client intentionally hides all of that behind a
 * simple `T | null`.
 */

export interface EndpointTestResult {
  name: string;
  url: string;
  status: number | null;
  statusLabel: string | null;
  ok: boolean;
  timeMs: number;
  resultCount: number | null;
  quotaRemaining: string | null;
  error: string | null;
  bodyPreview: string;
}

const STATUS_LABELS: Record<number, string> = {
  401: "401 Unauthorized — API key missing or invalid",
  403: "403 Forbidden — key valid but not allowed to call this endpoint",
  404: "404 Not Found — wrong path or resource",
  429: "429 Quota Exceeded — daily/per-minute request limit hit",
  500: "500 Server Error — API-Football is having issues",
};

export async function testEndpoint(
  name: string,
  path: string,
  params: Record<string, string> = {},
  { allowEmpty = false }: { allowEmpty?: boolean } = {}
): Promise<EndpointTestResult> {
  const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";
  const apiKey = process.env.API_FOOTBALL_KEY;

  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  if (!apiKey) {
    return {
      name,
      url: url.toString(),
      status: null,
      statusLabel: null,
      ok: false,
      timeMs: 0,
      resultCount: null,
      quotaRemaining: null,
      error: "API_FOOTBALL_KEY is not set — this request was never sent",
      bodyPreview: "",
    };
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(url.toString(), {
      headers: { "x-apisports-key": apiKey },
      cache: "no-store", // always live for this diagnostic page
    });
    const timeMs = Date.now() - startedAt;
    const text = await res.text();

    let json: { errors?: unknown; response?: unknown; results?: number } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      // non-JSON body, handled below via bodyPreview
    }

    const errorsValue = json?.errors;
    const apiErrorText =
      errorsValue && (Array.isArray(errorsValue) ? errorsValue.length > 0 : Object.keys(errorsValue).length > 0)
        ? JSON.stringify(errorsValue)
        : null;

    const resultCount = Array.isArray(json?.response) ? json.response.length : json?.response ? 1 : 0;

    return {
      name,
      url: url.toString(),
      status: res.status,
      statusLabel: STATUS_LABELS[res.status] ?? null,
      ok: res.ok && !apiErrorText && (resultCount > 0 || allowEmpty),
      timeMs,
      resultCount,
      quotaRemaining: res.headers.get("x-ratelimit-requests-remaining"),
      error: !res.ok
        ? `HTTP ${res.status}`
        : apiErrorText
          ? `API-Football returned an error: ${apiErrorText}`
          : resultCount === 0 && !allowEmpty
            ? "Request succeeded but returned zero results"
            : null,
      bodyPreview: JSON.stringify(json ?? text, null, 2).slice(0, 4000),
    };
  } catch (error) {
    return {
      name,
      url: url.toString(),
      status: null,
      statusLabel: null,
      ok: false,
      timeMs: Date.now() - startedAt,
      resultCount: null,
      quotaRemaining: null,
      error: error instanceof Error ? error.message : String(error),
      bodyPreview: "",
    };
  }
}
