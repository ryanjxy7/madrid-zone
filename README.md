# Madrid Zone

An independent Real Madrid news site — News, Transfers, Matches, Stats, Analysis and Squad — built with Next.js 15 (App Router), TypeScript and Tailwind CSS.

Implemented from the Claude Design handoff bundle in `design/` (see `design/HANDOFF.md` and `design/chats/` for the original design brief and iteration history).

## Stack

- **Next.js 15** (App Router, React 19, TypeScript, strict mode)
- **Tailwind CSS v4** — design tokens (colors, fonts, shadows) defined as CSS variables in `src/app/globals.css`, themeable for the dark/light toggle
- Zero required external services — the site runs entirely on placeholder data out of the box

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
  app/                 Routes (App Router). One folder per page/segment.
  components/
    layout/            Header, Footer, Ticker, mobile nav, theme provider
    article/           Article/story cards, article body renderer
    home/               Homepage-only widgets (sidebar cards, sponsors strip, newsletter)
    transfers/ matches/ squad/ stats/ legal/    Section-specific components
    ui/                 Small generic primitives (Container, Card, Tag, SectionHeading)
  lib/
    data/               Data-access layer — every page/component fetches through here
    cms/sanity/         Sanity integration scaffold (client, GROQ queries, schema reference)
    sports-api/api-football/   API-Football integration scaffold (client, typed endpoints)
    seo/                Site constants, JSON-LD helpers
    utils/              Formatting, image URLs, small style helpers
  data/placeholder/     Static placeholder content (the current data source)
  types/                Shared TypeScript domain types (Article, Player, Fixture, ...)
design/                 Original Claude Design handoff bundle (reference only, not built)
```

## Content architecture — why nothing is hardcoded

Every page reads content through `src/lib/data/*.ts` (e.g. `getAllArticles()`, `getSquad()`, `getStandings()`). Each of those functions currently returns data from `src/data/placeholder/`, but is already written to prefer a live source when one is configured:

- **Editorial content** (articles, sponsors) checks `isSanityConfigured` and runs a GROQ query from `src/lib/cms/sanity/queries.ts` against your Sanity project first, falling back to placeholder data.
- **Football data** (fixtures, results, standings, scorers) checks `isApiFootballConfigured` and calls API-Football (`src/lib/sports-api/api-football`) first, falling back to placeholder data.

This means connecting a real CMS or live sports data is additive — set the environment variables below, and the relevant pages switch from placeholder to live data automatically. No component or page needs to change.

### Connecting Sanity CMS

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and set up schema types matching `src/lib/cms/sanity/schema-reference.md` (`article`, `author`, `sponsor`, `wireItem`).
2. Copy `.env.example` to `.env.local` and fill in `SANITY_PROJECT_ID` / `SANITY_DATASET`.
3. Restart the dev server — the homepage, `/analysis`, `/news/[slug]` etc. now read from Sanity.

### Connecting API-Football

1. Get a key at [api-football.com](https://www.api-football.com) (free tier: 100 requests/day).
2. Set `API_FOOTBALL_KEY` in `.env.local` (team/league IDs default to Real Madrid / LaLiga — override if needed).
3. `/matches` and `/stats` now read live fixtures, results, standings and top scorers.

Transfer-market data (`/transfers`) stays editorial by design — verified newsroom content, not an API feed — so it's intended to move to Sanity rather than API-Football when that's ready.

## SEO

- Per-page `generateMetadata` / static `metadata` exports, with Open Graph and Twitter card data
- Dynamic OG image (`src/app/opengraph-image.tsx`) and favicon/apple-touch-icon (`icon.tsx`, `apple-icon.tsx`), all generated with `next/og` — no static image assets to keep in sync
- `sitemap.xml` and `robots.txt` generated from the same data layer as the pages (`src/app/sitemap.ts`, `src/app/robots.ts`) — new articles appear automatically
- `rss.xml` route (`src/app/rss.xml/route.ts`)
- `NewsArticle` JSON-LD on article pages (`src/lib/seo/jsonld.ts`)
- Web app manifest (`src/app/manifest.ts`)

## Images

Placeholder imagery is generated locally and deterministically by `src/app/api/placeholder/[seed]/route.tsx` (via `next/og`) — there is no dependency on a third-party image host, so the site works fully offline and never breaks behind a restrictive network policy. Swap `src/lib/utils/images.ts` for real licensed photography or Sanity-hosted assets before launch, and add your CDN hostname to `images.remotePatterns` in `next.config.ts`.

## Theming

Dark is the default theme; the header toggle switches to a light "day mode" and persists the choice in `localStorage` (`src/components/layout/ThemeProvider.tsx`). An inline script in the root layout applies the stored theme before hydration to avoid a flash of the wrong theme. The ticker and footer intentionally stay on fixed dark colors in both themes ("broadcast chrome"), matching the original design.
