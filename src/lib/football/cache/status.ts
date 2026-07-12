/**
 * In-memory record of provider health, for /debug/football. Same
 * per-instance caveat as cache.ts — good enough for a human checking
 * "is this working right now," not a durable audit log.
 */

interface RequestLog {
  endpoint: string;
  timestamp: string;
  ok: boolean;
  timeMs: number;
  error: string | null;
}

const RECENT_LIMIT = 20;
let recentRequests: RequestLog[] = [];
let lastSuccessfulRequest: RequestLog | null = null;
let lastError: RequestLog | null = null;

export function recordRequest(entry: Omit<RequestLog, "timestamp">): void {
  const logged: RequestLog = { ...entry, timestamp: new Date().toISOString() };
  recentRequests = [logged, ...recentRequests].slice(0, RECENT_LIMIT);
  if (entry.ok) {
    lastSuccessfulRequest = logged;
  } else {
    lastError = logged;
  }
}

export function getProviderStatus() {
  return {
    lastSuccessfulRequest,
    lastError,
    recentRequests,
  };
}
