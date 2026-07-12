# Live football data (ESPN)

This is the active provider, replacing Sofascore (which got blocked with a
403 from the production deployment shortly after launch — see the "why we
moved off Sofascore" section below). Same architecture, same rules: nothing
outside `src/lib/football` talks to ESPN directly, and every page/component
still only imports from `footballService.ts`.

## Read this first: ESPN's API is unofficial too

`site.api.espn.com` is ESPN's own internal API for espn.com and their apps —
there's no public developer program, no key, no ToS that grants third-party
use, and no SLA. The difference from Sofascore isn't legal status (both are
equally "unofficial"); it's that ESPN's endpoints are widely used by hobby
projects and are empirically far more tolerant of requests from cloud/
datacenter IPs (no aggressive Cloudflare bot-wall like Sofascore's). That's
still not a guarantee — check `/debug/football` after every deploy.

**Could not be live-verified from this build environment**: the sandbox this
was built in has its own outbound network allowlist that blocks
`site.api.espn.com` (and blocked `api.sofascore.com` the same way earlier —
that false reading is what the original "Sofascore is blocked" diagnosis
was based on, before it was corrected). Every endpoint below is implemented
against well-documented, widely-referenced knowledge of ESPN's site API, not
a live response captured during this build. **Check `/debug/football`
immediately after deploying** to confirm it actually works from Vercel.

## Feature audit

| Feature | Status |
|---|---|
| Upcoming fixtures | ✓ Available |
| Previous results | ✓ Available |
| Live matches | ✓ Available |
| Match events (goals/cards/subs) | ✓ Available |
| Lineups | ✓ Available |
| Match timeline | ✓ Available (same as match events) |
| Current squad | ✓ Available |
| Player information | ✓ Available |
| La Liga standings | ✓ Available |
| Champions League standings | ⚠ Available, format unverified (2024+ Swiss-model league phase) |
| Player bio depth (nationality/DOB) | ⚠ Partial — inconsistently populated for soccer |
| Player season statistics | ✗ Not available |
| Top scorers | ✗ Not available |
| Top assists | ✗ Not available |

The three ✗ items are not fabricated — `getPlayerSeasonStats`,
`getTopScorers`, `getTopAssists`, and `getBestRatedPlayers` in
`providers/espn.ts` always return `null`. Callers already treat `null` as
"fall back to Sanity/placeholder," so this degrades the same way the
existing stat-tile/goalkeeping gaps already did — no new failure mode.

## Architecture

```
src/config/football.ts              espn: { teamId, leagues: {laLiga, championsLeague}, baseUrl, standingsBaseUrl }
src/lib/football/
  providers/
    types.ts                        FootballProvider interface (unchanged contract)
    espn.ts                         ESPN implementation — the active provider
    espnClient.ts                   Raw fetch layer (retries, timeout, logging)
    sofascore.ts                    Previous provider, kept as a dormant alternate
    sofascoreClient.ts
  services/                         Unchanged — just import espnProvider instead of sofascoreProvider now
  cache/                            Unchanged — same stale-on-error cache, provider-agnostic
  types/
    domain.ts                       Unchanged — provider-agnostic domain types
    espn.ts                         Raw ESPN response shapes (defensive — every field optional)
    sofascore.ts                    Kept alongside sofascore.ts
  footballService.ts                Unchanged — still the only file pages/components import from
```

This is the abstraction doing its job: switching providers took one new
provider file, one new client file, one new raw-types file, and a
one-line import change in five `services/*.ts` files. No page, component,
or `src/lib/data/*.ts` file changed.

One real interface change: `getStandings`/`getTopScorers`/`getTopAssists`/
`getBestRatedPlayers` now take the semantic `CompetitionKey` ("laLiga" /
"championsLeague") instead of a pre-resolved ID string, because Sofascore
used opaque numeric IDs and ESPN uses league slugs ("esp.1") — each provider
resolves the key to whatever it needs internally instead of the shared
services layer assuming one ID shape.

## ESPN endpoints used

| Endpoint | Used for |
|---|---|
| `/soccer/{league}/teams/{id}` | Team info |
| `/soccer/{league}/teams/{id}/schedule` | Fixtures + results (queried per configured league, see gap below) |
| `/soccer/{league}/scoreboard` | Live match detection |
| `/soccer/{league}/summary?event={id}` | Full match detail — events, lineups, statistics, all in one call |
| `/soccer/{league}/teams/{id}/roster` | Squad |
| `/soccer/{league}/athletes/{id}` | Player profile |
| `/soccer/{league}/standings` (different host path) | League table |

## Known, disclosed gap: fixtures are per-competition

Unlike Sofascore's single team-wide fixtures endpoint, ESPN's schedule
endpoint is scoped to one competition. Fixtures/results are assembled by
querying every competition in `footballConfig.espn.leagues` (La Liga +
Champions League) and merging — a match in an unconfigured competition
(Copa del Rey, Club World Cup, etc.) won't appear. Add more entries to
`footballConfig.espn.leagues` and the `competitions` map if you need those
covered.

## Cache strategy

Unchanged from before — same stale-on-error cache
(`src/lib/football/cache/cache.ts`), same TTLs (fixtures 6h, standings 12h,
squad/player 24h, live match 45s, historical 30 days). See
`docs/SOFASCORE_GUIDE.md` for the full explanation; it applies identically
here since the cache layer is provider-agnostic.

## How to maintain it

- **Check health:** `/debug/football` runs live requests on every load —
  team info, next fixture, standings, squad — plus the request/error log
  and cache contents, and now also lists the three known unsupported
  features explicitly so it's clear at a glance that a blank scorers list
  is expected, not broken.
- **Wrong team/league:** override via env vars — `ESPN_TEAM_ID`,
  `ESPN_LALIGA_SLUG`, `ESPN_UCL_SLUG`, `ESPN_BASE_URL`,
  `ESPN_STANDINGS_BASE_URL`.
- **Runtime logs:** every request logged server-side prefixed `[ESPN]`.

## How to switch providers later

Same pattern as before, now proven twice:

1. Write a new file implementing `FootballProvider`
   (`src/lib/football/providers/types.ts`) — reactivating
   `src/lib/sports-api/api-football` (still fully working) or
   `src/lib/football/providers/sofascore.ts` (still fully working, just
   unused) are both one-file swaps.
2. In `src/lib/football/services/*.ts`, change the import of
   `espnProvider` to the new provider in each of the five files.

No page, component, or `src/lib/data/*.ts` file changes.
