# Connecting live match data (API-Football)

This is entirely separate from the CMS (`docs/CMS_GUIDE.md`). Sanity is where you
write articles and manage editorial content; API-Football is what makes
fixtures, results, standings, the squad and top scorers update themselves
automatically, without anyone typing them in.

You don't need this for the site to work — everything already runs on
either your Sanity entries or placeholder data. This is purely additive.

## What updates automatically once it's connected

| Page | Auto-updates | Stays editorial (Sanity/placeholder) |
|---|---|---|
| Home | Next match, latest results (via Matches/Stats data), top goalscorer list | Latest News list, newsletter box |
| Matches | Next match, upcoming fixtures, recent results, LaLiga table | — |
| Squad | Full roster, shirt numbers, photos | Nothing — fully live once connected |
| Stats | Matches played, goals scored, win rate, top scorers, top assists | Trophies count, goalkeeping detail, homepage "Player Stats" widget |
| Transfers | — | Everything (deals and rumours are verified newsroom calls, not something an API can know) |

A few things are **deliberately** kept editorial even with the API connected,
because there's no clean automatic source for them:

- **Trophies** — "this season's trophy count" isn't something the API states
  directly; keep it in the Season Stats singleton in Studio if you want it
  shown.
- **Goalkeeping detail** ("Clean sheets — T. Courtois", save %) — attributing
  clean sheets to one goalkeeper by name needs per-player data beyond what's
  practical to compute reliably; manage it in Studio.
- **Squad role labels** — the API only gives four broad categories
  (Goalkeeper/Defender/Midfielder/Attacker). If you want specific labels like
  "Right-back" instead of just "Defender", manage the squad in Studio instead
  — Sanity only takes over automatically when API-Football isn't configured.

## Step-by-step setup

### 1. Get your key

You already have one. If you ever need a new one:
[dashboard.api-football.com](https://dashboard.api-football.com/) → free plan
→ copy the key shown on your dashboard.

### 2. Add it locally (optional, for testing on your own machine)

Copy `.env.example` to `.env.local` and fill in:

```env
API_FOOTBALL_KEY=your_key_here
```

Never commit `.env.local` — it's already in `.gitignore`.

### 3. Add it to Vercel (this is what makes the live site use it)

Project → **Settings** → **Environment Variables** → add:

| Name | Value |
|---|---|
| `API_FOOTBALL_KEY` | your key |

Leave these alone unless you need to change them — they already default
correctly for Real Madrid / LaLiga:

| Name | Default | What it is |
|---|---|---|
| `API_FOOTBALL_BASE_URL` | `https://v3.football.api-sports.io` | The API's address |
| `API_FOOTBALL_TEAM_ID` | `541` | Real Madrid's ID on API-Football |
| `API_FOOTBALL_LEAGUE_ID` | `140` | LaLiga's ID on API-Football |

Then **Deployments → ⋯ → Redeploy**.

### 4. Verify it's working

Visit `/matches` and `/squad` on your live site. You should see real opponent
names and real players instead of "Opponent A" / stock placeholder squad
entries. If you still see placeholder data:

- Double check the key was pasted correctly (no extra spaces) and you
  redeployed after adding it.
- Check your API-Football dashboard for remaining quota — the free plan is
  100 requests/day; the caching below keeps normal usage far under that, but
  it's worth a glance if something looks stale.
- Nothing ever shows a broken page either way: a bad key or an outage just
  means the site quietly uses Sanity/placeholder data instead — check your
  Vercel deployment's **Runtime Logs** for lines starting `[api-football]` to
  see what actually happened.

## How caching protects your quota

Every football page is cached and only re-checks the API after a set time,
not on every single visitor:

- **Fixtures, results, standings, top scorers/assists** — refresh every
  **6 hours**. These move around match days but don't need second-by-second
  updates for a news site.
- **Squad roster and season team stats** — refresh every **24 hours**. This
  barely changes day to day.

This isn't something you configure — it's already built in
(`src/lib/sports-api/api-football/client.ts`). On the free 100-requests/day
plan, this setup uses a small handful of requests per day regardless of how
much traffic the site gets, since Vercel serves cached pages to visitors
without calling the API each time.

## A note on live, in-match scores

This setup refreshes every few hours, which fits a news/editorial site well,
but it will not show a scoreline updating minute-by-minute during a live
match. A true live match centre (live score ticking every ~60 seconds,
lineups, cards, timeline) is a bigger, separate feature — happy to build it
if you want it, but it wasn't part of this pass since it needs new pages
that don't exist yet (a dedicated live match view) rather than just wiring
up data that already has a place to go.
