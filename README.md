# Madrid Zone

An independent Real Madrid news site — News, Transfers, Matches, Stats, Analysis and Squad — built with Next.js 15 (App Router), TypeScript and Tailwind CSS.

Implemented from the Claude Design handoff bundle in `design/` (see `design/HANDOFF.md` and `design/chats/` for the original design brief and iteration history).

## Stack

- **Next.js 15** (App Router, React 19, TypeScript, strict mode)
- **Tailwind CSS v4** — design tokens (colors, fonts, shadows) defined as CSS variables in `src/app/globals.css`, themeable for the dark/light toggle
- **Sanity Studio**, embedded at `/studio` — the CMS non-technical editors use to publish everything (see [docs/CMS_GUIDE.md](docs/CMS_GUIDE.md))
- Zero required external services to run locally — the site works fully on placeholder data until Sanity/API-Football credentials are set

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Project structure

```
src/
  app/
    (site)/            All public pages — its own root layout (Header/Ticker/Footer)
    studio/            Embedded Sanity Studio at /studio — its own isolated root layout
    api/                Route handlers (placeholder images, Sanity revalidate webhook)
  components/
    layout/            Header, Footer, Ticker, mobile nav, theme provider
    article/           Article/story cards, Portable Text article body renderer
    home/               Homepage-only widgets (sidebar cards, sponsors strip, newsletter)
    transfers/ matches/ squad/ stats/ legal/    Section-specific components
    ui/                 Small generic primitives (Container, Card, Tag, SectionHeading)
  lib/
    data/               Data-access layer — every page/component fetches through here
    cms/sanity/         Sanity client, image URL builder, GROQ queries, raw doc types
    sports-api/api-football/   API-Football client + typed endpoints
    seo/                Site constants, JSON-LD helpers
    utils/              Formatting, image URLs, Portable Text helpers
  data/placeholder/     Static placeholder content (fallback data source)
  types/                Shared TypeScript domain types (Article, Player, Fixture, ...)
sanity.config.ts         Studio configuration (schema, desk structure, singleton rules)
src/sanity/
  schemaTypes/           Every content type an editor can create/edit
  structure.ts            The friendly, grouped Studio menu
docs/CMS_GUIDE.md        Non-technical setup + day-to-day editing guide
docs/API_FOOTBALL_GUIDE.md   Connecting live match/squad/stats data
design/                 Original Claude Design handoff bundle (reference only, not built)
```

## Content architecture — why nothing is hardcoded

Every page reads content through `src/lib/data/*.ts` (e.g. `getAllArticles()`, `getSquad()`, `getStandings()`). Each of those functions queries Sanity first when configured, then API-Football for live match data where relevant, and falls back to `src/data/placeholder/` — so the site always renders, CMS or not, and no page or component needs to change as real content is added:

- **Editorial content** (articles, transfers, sponsors, legal pages, site settings, ad slot) checks `isSanityConfigured` and runs a GROQ query from `src/lib/cms/sanity/queries.ts`.
- **Football data** (fixtures, results, standings, squad, scorers, assists, headline stats) checks `isApiFootballConfigured` first for live data, then falls back to the equivalent editorial Sanity content (for manual entry), then placeholder.

### Connecting Sanity CMS

Full non-technical walkthrough: **[docs/CMS_GUIDE.md](docs/CMS_GUIDE.md)**. Short version:

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) — no code, no CLI.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (see `.env.example`).
3. Add your site URL (and `http://localhost:3000`) as CORS origins in Sanity's project settings.
4. Visit `/studio`, log in, and start publishing — the content model (Articles, Squad, Transfers, Matches, Season Stats, Sponsors, Live Ticker, Legal Pages, Site Settings) is defined in `src/sanity/schemaTypes/`.
5. Optional: set `SANITY_REVALIDATE_SECRET` and add a webhook (Sanity → API → Webhooks → `/api/revalidate`) so publishing goes live instantly instead of within ~60 seconds.

### Connecting API-Football

Full walkthrough (what auto-updates, cache timing, troubleshooting): **[docs/API_FOOTBALL_GUIDE.md](docs/API_FOOTBALL_GUIDE.md)**. Short version:

1. Get a key at [api-football.com](https://www.api-football.com) (free tier: 100 requests/day).
2. Set `API_FOOTBALL_KEY` in `.env.local` / Vercel env vars (team/league IDs default to Real Madrid / LaLiga — override if needed).
3. `/matches`, `/squad` and `/stats` now read live fixtures, results, standings, the full roster, and top scorers/assists — cached 6-24h per data type to stay well within the free tier, with retries and a silent fallback to Sanity/placeholder data on any failure.

Transfer-market data (`/transfers`) stays editorial by design — verified newsroom content, not an API feed — so it's edited in Sanity, not pulled from API-Football. Trophy counts and goalkeeper-specific stats also stay editorial (no clean live source for either).

## SEO

- Per-page `generateMetadata` / static `metadata` exports, with Open Graph and Twitter card data
- Dynamic OG image (`src/app/opengraph-image.tsx`) and favicon/apple-touch-icon (`icon.tsx`, `apple-icon.tsx`), all generated with `next/og` — no static image assets to keep in sync
- `sitemap.xml` and `robots.txt` generated from the same data layer as the pages (`src/app/sitemap.ts`, `src/app/robots.ts`) — new articles appear automatically
- `rss.xml` route (`src/app/rss.xml/route.ts`)
- `NewsArticle` JSON-LD on article pages (`src/lib/seo/jsonld.ts`)
- Web app manifest (`src/app/manifest.ts`)

## Images

Two sources, both fully automatic — nobody ever resizes or crops an image by hand:

- **Placeholder mode** (no Sanity configured): `src/app/api/placeholder/[seed]/route.tsx` generates deterministic branded imagery locally via `next/og` — zero third-party dependency, works fully offline.
- **Sanity mode**: editors upload a photo and choose a focal point with Studio's built-in crop tool (hotspot). `src/lib/cms/sanity/image.ts` builds CDN URLs from that hotspot at the exact crop each component needs (wide hero crops, 3:4 squad portraits, contained logos); `next/image` then handles responsive `srcset`/format negotiation on top.

## Theming

Dark is the default theme; the header toggle switches to a light "day mode" and persists the choice in `localStorage` (`src/components/layout/ThemeProvider.tsx`). An inline script in the root layout applies the stored theme before hydration to avoid a flash of the wrong theme. The ticker and footer intentionally stay on fixed dark colors in both themes ("broadcast chrome"), matching the original design.
