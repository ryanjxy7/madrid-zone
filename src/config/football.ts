/**
 * Central configuration for the football data layer. Nothing in
 * src/lib/football or the components it feeds should hardcode a team ID,
 * competition ID, season, or timezone — it all comes from here, and every
 * value can be overridden by an environment variable without touching code.
 *
 * IDs below are Sofascore's own internal IDs (unrelated to API-Football's
 * IDs used elsewhere in this project) — they are best-known-correct from
 * public reference, not verified live against Sofascore from this
 * environment. Confirm them at /debug/football, which prints back exactly
 * what each ID resolves to; override here via env vars if any are wrong.
 */

export const footballConfig = {
  /** Real Madrid's Sofascore team ID. */
  teamId: process.env.SOFASCORE_TEAM_ID ?? "2829",

  competitions: {
    laLiga: {
      id: process.env.SOFASCORE_LALIGA_ID ?? "8",
      name: "La Liga",
    },
    championsLeague: {
      id: process.env.SOFASCORE_UCL_ID ?? "7",
      name: "UEFA Champions League",
    },
  },

  /**
   * Sofascore's "season" is an opaque internal ID that changes every year
   * (not a year number like "2025") and differs per competition. Rather
   * than hardcode one, the season service resolves the current season ID
   * per competition at request time via the provider's seasons list and
   * caches the result — see src/lib/football/services/standings.ts.
   */
  season: {
    /** Fallback label shown in the UI if a live season lookup ever fails. */
    fallbackLabel: "Current Season",
  },

  timezone: process.env.FOOTBALL_TIMEZONE ?? "Europe/Madrid",

  api: {
    baseUrl: process.env.SOFASCORE_BASE_URL ?? "https://api.sofascore.com/api/v1",
    /** Sofascore has no official key — this is purely a defensive request timeout. */
    timeoutMs: 8000,
    retries: 2,
  },

  /**
   * ESPN's IDs and league slugs — unrelated to the Sofascore ones above.
   * ESPN's hidden site API nests almost everything under a league slug
   * (e.g. "esp.1" for La Liga) rather than a flat numeric competition ID,
   * so this is shaped differently on purpose. Best-known-correct from
   * public reference, not verified live from this environment — confirm
   * at /debug/football and override via env vars if wrong.
   */
  espn: {
    /** Real Madrid's ESPN team ID. */
    teamId: process.env.ESPN_TEAM_ID ?? "86",
    leagues: {
      laLiga: process.env.ESPN_LALIGA_SLUG ?? "esp.1",
      championsLeague: process.env.ESPN_UCL_SLUG ?? "uefa.champions",
    },
    baseUrl: process.env.ESPN_BASE_URL ?? "https://site.api.espn.com/apis/site/v2/sports/soccer",
    standingsBaseUrl: process.env.ESPN_STANDINGS_BASE_URL ?? "https://site.api.espn.com/apis/v2/sports/soccer",
    timeoutMs: 8000,
    retries: 2,
  },

  /** How long each kind of data is cached before a fresh fetch is attempted. */
  cache: {
    fixtures: 6 * 60 * 60, // 6 hours
    standings: 12 * 60 * 60, // 12 hours
    squad: 24 * 60 * 60, // 24 hours
    playerStatistics: 24 * 60 * 60, // 24 hours
    liveMatch: 45, // 45 seconds — inside the requested 30-60s window
    historical: 30 * 24 * 60 * 60, // 30 days — finished matches never change
  },
} as const;

export type CompetitionKey = keyof typeof footballConfig.competitions;
