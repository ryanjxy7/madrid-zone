# Live football data (Sofascore)

This replaces API-Football as the site's live data source for fixtures,
results, the live match centre, squad, player pages, standings and league
leaderboards. It uses Sofascore's **unofficial, unauthenticated** API — read
the warning below before relying on it.

## Read this first: Sofascore is not an official API

There is no public Sofascore API, no key, no ToS that permits this kind of
use, and no SLA. It's the same undocumented API their own website and app
call. In practice that means:

- It can block or rate-limit any IP (including Vercel's) without warning.
- Response shapes can change at any time with no changelog.
- There's no support channel if it breaks.

This was a deliberate, disclosed tradeoff (API-Football's free plan doesn't
cover the current season) — not an oversight. **Confirmed while building
this**: this environment's own outbound requests to `api.sofascore.com` were
blocked with an HTTP 403 (bot detection), which is exactly the failure mode
described above. Once deployed, check `/debug/football` immediately — if
Vercel's IPs are blocked too, every page will quietly show placeholder data
(never a blank or broken page, by design) until that's resolved. If that
happens, moving to API-Football's paid tier (still fully implemented and
left in place at `src/lib/sports-api/api-football`) is the reliable fix.

## Architecture

```
src/config/football.ts              Team/competition IDs, season, timezone, cache TTLs — nothing else hardcodes these
src/lib/football/
  providers/
    types.ts                        FootballProvider interface — the swap point
    sofascore.ts                    Sofascore implementation of FootballProvider
    sofascoreClient.ts              Raw fetch layer (retries, timeout, headers, logging)
  services/                         Thin wrappers around the active provider
    fixtures.ts, matches.ts, players.ts, standings.ts, teams.ts
  cache/
    cache.ts                        Stale-on-error cache (serves last known-good value if a fetch fails)
    status.ts                       Request log for /debug/football
  types/
    domain.ts                       New types (LiveMatchDetail, PlayerProfile, etc.)
    sofascore.ts                    Raw Sofascore response shapes (defensive — every field optional)
  footballService.ts                The ONLY file pages/components may import from
```

**Rule:** nothing outside `src/lib/football` ever calls Sofascore directly.
Pages and components import from `@/lib/football/footballService` (or from
`src/lib/data/*.ts`, which itself imports only from `footballService`). All
fetching happens server-side — there's no API key to leak, but the endpoint
paths and retry logic stay server-only regardless.

## Sofascore endpoints used

| Endpoint | Used for |
|---|---|
| `/team/{id}` | Team info (name, country, venue, coach) |
| `/team/{id}/events/next/0` | Upcoming fixtures |
| `/team/{id}/events/last/0` | Recent results |
| `/sport/football/events/live` | Live match detection |
| `/event/{id}` | Single match (for `/matches/[id]`) |
| `/event/{id}/incidents` | Goals, cards, substitutions |
| `/event/{id}/lineups` | Starting XI, formations, subs |
| `/event/{id}/statistics` | Possession, shots, corners, etc. |
| `/team/{id}/players` | Squad |
| `/player/{id}` | Player profile |
| `/player/{id}/unique-tournament/{tid}/season/{sid}/statistics/overall` | Player season stats |
| `/unique-tournament/{id}/seasons` | Resolves the current opaque season ID per competition |
| `/unique-tournament/{id}/season/{sid}/standings/total` | League table |
| `/unique-tournament/{id}/season/{sid}/top-players/overall` | Top scorers/assists/rated |

## Data available vs. not available

**Available:** team info, upcoming/recent fixtures, live match centre (score,
minute, events, lineups, statistics), squad with photos, player profiles and
season stats, La Liga and Champions League standings, league-wide top
scorers/assists/best-rated.

**Not available (stayed editorial via Sanity/placeholder, same as before):**
season stat tiles (matches played, goals, win rate — Sofascore has no single
clean "team season summary" endpoint), trophies, goalkeeping detail
(clean sheets by name), home/away split stats.

## Cache strategy

All caching is explicit and stale-on-error (`src/lib/football/cache/cache.ts`)
— if a fetch fails, the last successful value is served instead of nothing.
Nothing is ever cached from a failed/null response.

| Data | TTL |
|---|---|
| Fixtures, top scorers/assists | 6 hours |
| Standings | 12 hours |
| Squad, player profiles/stats | 24 hours |
| Live match | 45 seconds (never served stale — always a fresh fetch) |
| Historical results | 30 days |

The cache is an in-memory `Map`, scoped to one warm serverless instance —
resets on cold start, not shared across concurrent instances. That's a known,
documented limitation (see the comment in `cache.ts`); swap it for Vercel
KV/Upstash Redis if cross-instance persistence matters later — no call sites
would need to change.

The Live Match Centre (`/matches/[id]`) polls a small internal route,
`/api/football/match/[id]`, every 45 seconds **only while the match status is
"live"** — never on finished/scheduled matches, and the client never talks to
Sofascore directly.

## How to maintain it

- **Check health:** `/debug/football` runs live requests on every load and
  shows the last successful request, last error, recent request log, and
  full cache contents for that instance.
- **Wrong team/competition ID:** override via env vars — `SOFASCORE_TEAM_ID`,
  `SOFASCORE_LALIGA_ID`, `SOFASCORE_UCL_ID` — nothing is hardcoded elsewhere.
- **Blocked/rate-limited:** there's nothing to configure to "fix" this from
  our side beyond what's already there (browser-like headers, retries,
  backoff). If it persists, switch providers (below).
- **Runtime logs:** every request is logged server-side prefixed
  `[Sofascore]`, success or failure, with timing.

## How to switch providers later

1. Write a new file implementing `FootballProvider`
   (`src/lib/football/providers/types.ts`) — for example, reactivating
   `src/lib/sports-api/api-football`, which still works and was left in place
   for exactly this.
2. In `src/lib/football/services/*.ts`, change the one import of
   `sofascoreProvider` to the new provider.

No page, component, or `src/lib/data/*.ts` file changes — they only ever
talked to `footballService.ts`.
