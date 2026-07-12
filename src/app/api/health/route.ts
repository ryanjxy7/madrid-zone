import { NextResponse } from "next/server";
import { checkApiFootball, checkSanity } from "@/lib/debug/systemStatus";
import { isSanityConfigured } from "@/lib/cms/sanity";
import { getCurrentSeason, isApiFootballConfigured, LALIGA_LEAGUE_ID, REAL_MADRID_TEAM_ID } from "@/lib/sports-api/api-football";

export const dynamic = "force-dynamic";

/**
 * Live health check — Sanity + API-Football connectivity, quota, and
 * which config env vars are actually loaded (never their values). See
 * docs/API_FOOTBALL_GUIDE.md for how to use this while debugging.
 */
export async function GET() {
  const [sanity, apiFootball, season] = await Promise.all([
    checkSanity(),
    checkApiFootball(),
    isApiFootballConfigured ? getCurrentSeason() : Promise.resolve(null),
  ]);

  const status = (!isSanityConfigured || sanity.reachable) && (!isApiFootballConfigured || apiFootball.reachable) ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      sanity,
      apiFootball,
      config: {
        teamId: REAL_MADRID_TEAM_ID,
        leagueId: LALIGA_LEAGUE_ID,
        currentSeason: season,
        envVarsLoaded: {
          API_FOOTBALL_KEY: Boolean(process.env.API_FOOTBALL_KEY),
          API_FOOTBALL_BASE_URL: Boolean(process.env.API_FOOTBALL_BASE_URL),
          API_FOOTBALL_TEAM_ID: Boolean(process.env.API_FOOTBALL_TEAM_ID),
          API_FOOTBALL_LEAGUE_ID: Boolean(process.env.API_FOOTBALL_LEAGUE_ID),
          NEXT_PUBLIC_SANITY_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
          NEXT_PUBLIC_SANITY_DATASET: Boolean(process.env.NEXT_PUBLIC_SANITY_DATASET),
          SANITY_API_TOKEN: Boolean(process.env.SANITY_API_TOKEN),
          SANITY_REVALIDATE_SECRET: Boolean(process.env.SANITY_REVALIDATE_SECRET),
        },
      },
    },
    { status: status === "ok" ? 200 : 503 }
  );
}
