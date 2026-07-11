# # MadridZone Design Updates

_Started 2026-07-11 08:00 UTC_

---

## User

Remove author name from articles display. 

Regarding the tags for the articles in terms of 'news', 'trasnfers', 'finance' maybe add a tag and highlight them in red. 

The logo of 'MZ' next to madridzone make it dynamic make with background removed and only 'MZ' on there
When switched to day mode make it into black

Also for mobile mode menus:

For Home: Add a Home Kind of Icon
Trasnfers is Ok
For matches maybe add a football/soccer ball icon

For Squad maybe addd a person emoji icon

And for stats maybe add the graph emoji icon

Make sure everything is in perfect theme 

Remove 'wire' and replace it with NEWS


Once all this is done. 

Give me a step by step plan to bring this site to life and to make it live and how to update it and publish artciles and stuff on it

And how to get some api or maybe connect it to some site where live stats and matches info and stuff like that gets updated

Give me the best and cheapest options and give me an entire guide. treat me like a complete newbie who doesnt do anything and this is the first website i am building

## Assistant

_[tool: grep]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

Making all edits across both files now.

_[tool: run_script]_

_[tool: ready_for_verification]_

All design changes are done — on both the desktop and mobile versions:

- Author names removed from all article displays
- Category tags (NEWS, TRANSFERS, FINANCE…) now show as red highlighted badges on story cards
- Logo is now a text "MZ" mark — no image/background, white in dark mode, automatically black in day mode
- "Wire" replaced with NEWS (LIVE NEWS ticker, LATEST NEWS panel)
- Mobile bottom nav icons: 🏠 Home, ⇄ Transfers, ⚽ Matches, 👤 Squad, 📊 Stats

---

# Complete newbie guide: taking Madrid Zone live

## Part 1 — Understand what you have vs. what you need

What you have now is a **design/prototype** — it looks like the real site, but articles are hard-coded. A real site needs three things:

1. **A CMS** (Content Management System) — where you write and publish articles
2. **Hosting** — the computer that serves your site to the world
3. **A domain** — e.g. `themadridzone.com`

## Part 2 — The recommended cheap stack (~$10–12/year total)

**Best option for you: WordPress-style simplicity without the cost — use Ghost(free self-host is complex) → actually, for a total beginner I recommend this instead:**

### Option A (easiest, my recommendation): WordPress.com or Blogger-style hosted CMS
- **WordPress.com free plan**: $0, but shows their ads and uses `yoursite.wordpress.com`
- **WordPress.com paid**: ~$4–8/month for custom domain + no ads
- You publish articles from a dashboard like writing an email. Zero code.
- Downside: your custom design would need to be rebuilt as a WordPress theme (a freelancer on Fiverr can do this for $50–150 using your design as the spec).

### Option B (cheapest with your exact design): Static site + free hosting
- Host the site **free forever** on **Netlify**, **Vercel**, or **Cloudflare Pages**
- Add a free "git-based CMS" like **Decap CMS** or **TinaCMS** — gives you a simple "New Article" form; publishing takes ~1 minute to go live
- Only cost: domain ~$10/year (buy at **Cloudflare** or **Porkbun** — avoid GoDaddy upsells)
- Downside: initial setup needs a developer (or me — I can hand off a developer-ready package)

### Option C (best long-term for a news site): Headless CMS + free hosting
- **Sanity.io** or **Contentful** free tiers (generous — thousands of articles free)
- Site hosted free on Vercel/Netlify
- You get a clean writing dashboard; the site keeps your exact design
- Setup requires a developer initially (~$200–500 freelance, or use the "Handoff to Claude Code" option here and build it yourself with AI help)

**My honest advice**: start with **Option B**. Total cost ≈ **$10/year**.

## Part 3 — Step-by-step launch plan

1. **Buy the domain** — Cloudflare Registrar or Porkbun, search "madridzone", pay ~$10/yr
2. **Create free accounts**: GitHub (stores your site's code) + Netlify (hosts it)
3. **Get the site built for real** — take this design to a developer or Claude Code (I can produce a handoff package). Ask for: "Next.js site + Decap CMS, matching this design"
4. **Connect GitHub → Netlify** — one-click; every article you publish auto-deploys
5. **Point your domain at Netlify** — Netlify gives you 2 DNS records to paste; free HTTPS included
6. **Publish your first article** from the CMS dashboard: title, tag (News/Transfers/Finance), image, body → Publish → live in ~60 seconds
7. **Set up the newsletter** — **Buttondown** (free to 100 subs) or **Beehiiv** (free to 2,500 subs); paste their signup form into your "MZ BRIEFING" box
8. **Analytics** — free **Cloudflare Web Analytics** (no cookie banner needed) or Google Analytics

## Part 4 — Live stats, fixtures & match data (APIs)

These services give you squad lists, fixtures, live scores, league tables, and player stats that update automatically:

**Free options:**
- **football-data.org** — free tier covers LaLiga fixtures, results, standings. 10 calls/minute. Best free starting point.
- **TheSportsDB** — free, community-driven; good for squad/player info and badges.
- **Sofascore / FotMob widgets** — free embeddable live-score widgets; zero coding, just paste an embed code. Easiest of all.

**Paid (when you grow):**
- **API-Football (api-sports.io)** — the standard for fan sites. Free tier: 100 requests/day (enough for a small site with caching). Paid from ~$19/month for live minute-by-minute data, lineups, xG.

**How it works, simply**: your site asks the API "what's Real Madrid's next fixture?" once every few minutes, caches the answer, and displays it in the Fixtures/Stats boxes you already have. A developer wires this in a day; the free tiers cover you until you have serious traffic.

⚠️ One caution: player **photos** and club **crests** are licensed. Use photos from the API providers or licensed sources (or press photos with permission) — don't lift them from Google.

## Part 5 — Making money (later)
- Google AdSense in the ad slots already designed in (needs ~modest traffic, free to join)
- Direct sponsors — you already have the "Partner with us" section
- Newsletter sponsorships once you pass ~1k subscribers

## Summary of costs
- Domain: ~$10/year — the only mandatory cost
- Hosting: $0 (Netlify/Vercel/Cloudflare free tiers)
- CMS: $0 (Decap/Sanity free tier)
- Newsletter: $0 to start
- Match data: $0 to start (football-data.org / widgets), ~$19/mo later if you want live minute-by-minute

Next step whenever you're ready: I can generate a **developer handoff package** from this design so you (or a freelancer, or Claude Code) can build the production version to match it exactly. Just ask.

## User

I want a good content mangement system, you can suggest paid versions also which will make life easier

i want an easy system to update and publish stuff on website constantly and very easily. 

Can i do this on shopify or something, post exact website code on there for design then set it up there or on a similar service?

I have paid for the domain already

I dont mind paying upto 150 to 200 a year to maintain the site so show me options

## Assistant

Good budget — $150–200/year opens up the genuinely easy options. Here's the honest rundown:

## First: Shopify — no ❌
Shopify is built for **online stores** (products, carts, checkout). You *can* paste custom code into it, but its blogging tools are weak, you'd fight the platform constantly, and it costs $39/month (~$470/yr) — over budget for the wrong tool. Skip it.

## Your actual best options

### 🥇 Ghost (Pro) — built exactly for what you're doing
- **~$9/month (annual) = $108/year** on the Starter plan
- Ghost is a publishing platform made for news sites and newsletters — it's what many independent sports outlets run on
- Beautiful, dead-simple editor: write → add image → tag it (News/Transfers/Finance) → Publish. Live instantly
- **Newsletter built in** — your "MZ Briefing" emails send from the same place you publish articles, free up to 500 subscribers
- Custom domain, hosting, security, backups all included — you never touch a server
- **Your design**: Ghost uses custom themes. Your exact design can be converted into a Ghost theme (Handlebars templates — I can prep a handoff package; a freelancer does this for ~$100–200 one-time, or Claude Code can help you do it)
- Caveat: Starter plan limits theme customization to their theme marketplace — the **Creator plan ($25/mo)** allows fully custom themes, which breaks your budget. Workaround: pick a Ghost news theme close to yours and customize colors/logo, or self-host Ghost (harder)

### 🥈 WordPress.com Explorer/Premium — the classic
- **~$8/month = $96/year** (Explorer plan: custom domain, no ads, premium themes)
- Biggest ecosystem on earth; every question you'll ever have is answered on YouTube
- Editor is more cluttered than Ghost but very capable
- Custom theme matching your design needs the **Creator plan ($25/mo)** — same catch as Ghost
- Good middle path: choose a news/magazine theme and restyle it red/black to match your brand

### 🥉 Wix or Squarespace — easiest, least faithful to your design
- **~$150–200/year**
- Drag-and-drop everything, zero learning curve, blogging is fine
- But you **can't paste in your website code** — you rebuild an approximation of your design with their blocks. It'll look ~80% like your mockup
- Fine if "easy" outranks "pixel-perfect"

### 💪 The pixel-perfect option: your code + Sanity CMS
- **$0–100/year** (Sanity + Vercel free tiers; only cost is occasional dev help)
- Keeps your EXACT design, article publishing via Sanity's clean dashboard (as easy as Ghost's)
- One-time setup by a developer or via Claude Code handoff (~$200–500 freelance, or free if you build it with AI assistance)
- After setup, publishing is: open sanity dashboard → write → publish → live in seconds

## My recommendation for you

**Ghost Starter ($108/yr)** — it's purpose-built for a news + newsletter operation like Madrid Zone, the publishing experience is the best in the business, and it leaves budget headroom. Accept that v1 uses a customized marketplace theme (there are excellent dark sports/magazine themes); upgrade to a fully custom theme later if the site takes off.

If pixel-perfect design matters more than convenience: **Sanity + Vercel** with a one-time build.

Want me to prep a developer handoff package of the design (works for either a Ghost theme or the Sanity build)?

