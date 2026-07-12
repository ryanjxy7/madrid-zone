import { isSanityConfigured, sanityClient } from "@/lib/cms/sanity";
import { isApiFootballConfigured } from "@/lib/sports-api/api-football";

export interface ServiceStatus {
  configured: boolean;
  reachable: boolean | null;
  error: string | null;
}

export interface ApiFootballStatus extends ServiceStatus {
  quota: { requestsToday: number; dailyLimit: number; plan: string } | null;
}

/** Shared by /api/health and /debug/system so both report identically. */
export async function checkSanity(): Promise<ServiceStatus> {
  if (!isSanityConfigured) {
    return { configured: false, reachable: null, error: "NEXT_PUBLIC_SANITY_PROJECT_ID is not set" };
  }
  try {
    await sanityClient.fetch("*[0]{_id}");
    return { configured: true, reachable: true, error: null };
  } catch (error) {
    return { configured: true, reachable: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function checkApiFootball(): Promise<ApiFootballStatus> {
  if (!isApiFootballConfigured) {
    return { configured: false, reachable: null, quota: null, error: "API_FOOTBALL_KEY is not set" };
  }

  const baseUrl = process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io";

  try {
    const res = await fetch(`${baseUrl}/status`, {
      headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY as string },
      cache: "no-store",
    });

    if (!res.ok) {
      return { configured: true, reachable: false, quota: null, error: `HTTP ${res.status}: ${await res.text()}` };
    }

    const json = (await res.json()) as {
      errors?: Record<string, string> | unknown[];
      response?: {
        requests?: { current: number; limit_day: number };
        subscription?: { plan: string };
      };
    };

    const hasErrors = json.errors && (Array.isArray(json.errors) ? json.errors.length > 0 : Object.keys(json.errors).length > 0);
    if (hasErrors) {
      return { configured: true, reachable: false, quota: null, error: JSON.stringify(json.errors) };
    }

    return {
      configured: true,
      reachable: true,
      error: null,
      quota: json.response?.requests
        ? {
            requestsToday: json.response.requests.current,
            dailyLimit: json.response.requests.limit_day,
            plan: json.response.subscription?.plan ?? "unknown",
          }
        : null,
    };
  } catch (error) {
    return { configured: true, reachable: false, quota: null, error: error instanceof Error ? error.message : String(error) };
  }
}
