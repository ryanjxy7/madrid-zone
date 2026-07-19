# Madrid Zone CMS guide

This site is edited entirely through a built-in content dashboard called
**Studio**, at `yoursite.com/studio`. You never need to write code, deploy
anything, or touch a file — writing an article is as simple as filling in a
form and clicking Publish.

This guide has two parts:

- **Part 1** — one-time setup (for whoever owns the site). About 15 minutes,
  entirely done by clicking around two websites.
- **Part 2** — day-to-day editing (for anyone publishing content). No setup
  knowledge required.

---

## Part 1 — One-time setup

You only do this once, before the CMS works. Everything here is done in a
web browser — no installing anything, no command line.

### 1. Create a free Sanity account and project

1. Go to **[sanity.io/manage](https://www.sanity.io/manage)** and sign up
   (Google/GitHub/email — whichever is easiest).
2. Click **Create new project**. Give it any name, e.g. "Madrid Zone".
3. Sanity creates a **Project ID** (a short code like `abcd1234`) and a
   dataset called `production`. Copy the Project ID.

### 2. Tell the website your Project ID

The website reads its connection details from environment variables.

- **If you're hosting on Vercel:** go to your project → **Settings** →
  **Environment Variables** and add:

  | Name | Value |
  |---|---|
  | `NEXT_PUBLIC_SANITY_PROJECT_ID` | the Project ID from step 1 |
  | `NEXT_PUBLIC_SANITY_DATASET` | `production` |

  Then redeploy (Vercel → Deployments → ⋯ → Redeploy) so the new values
  take effect.

- **If you're running it locally:** copy `.env.example` to `.env.local` and
  fill in the same two values, then restart `npm run dev`.

### 3. Allow the website to talk to Sanity (CORS)

1. Back in [sanity.io/manage](https://www.sanity.io/manage), open your
   project → **API** → **CORS origins**.
2. Click **Add CORS origin** and add your live site URL (e.g.
   `https://themadridzone.com`) — tick **"Allow credentials"**.
3. Add another for local development: `http://localhost:3000`, also with
   credentials allowed.

### 4. Invite your editors

1. Project → **Members** → **Invite members**.
2. Enter each writer's email. They'll get an invite to create a free
   Sanity login — that login is how they'll sign into `/studio`.
3. Give writers the **Editor** role (can publish content, can't change
   project settings). Give yourself **Administrator**.

### 5. (Recommended) Make publishing instant

By default, changes appear on the site within about a minute. To make
Publish go live **immediately**, set up a webhook:

1. Pick a secret password (any random string) — this is
   `SANITY_REVALIDATE_SECRET`.
2. Add it as an environment variable (same place as step 2) called
   `SANITY_REVALIDATE_SECRET`.
3. In [sanity.io/manage](https://www.sanity.io/manage) → your project →
   **API** → **Webhooks** → **Create webhook**:
   - **URL**: `https://yoursite.com/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Secret**: the same string from step 1
4. Save, redeploy the site once more.

### 6. Start editing

Visit **`yoursite.com/studio`**, log in with the account you were invited
with, and you'll see the dashboard described in Part 2.

---

## Part 2 — Everyday editing

Open `yoursite.com/studio`. The left-hand menu is organised by what you're
editing, not by technical names:

| Menu item | What it controls |
|---|---|
| 📰 Articles | Every News/Transfers/Finance/Club/Matches story |
| ✍️ Authors | Byline names |
| ⚽ Squad | The Squad page player cards |
| 🔄 Transfer Centre | The Transfer Centre table + Rumour Mill |
| 🗓️ Matches | Next Match, Upcoming Fixtures, Recent Results, League Table |
| 📊 Season Stats | Every number on the Stats page and homepage sidebar |
| 🤝 Sponsors | The sponsor logos on the homepage and About page |
| 📢 Live Ticker | The scrolling bar at the very top of the site |
| 📄 Legal Pages | Privacy Policy, Terms of Use, Cookie Policy |
| 🖼️ Ad Slot | The ad box on the homepage sidebar |
| ⚙️ Site Settings | Header follower count, contact emails, social links, newsletter box text |

### Publishing an article

1. Click **📰 Articles → + (New article)**.
2. Fill in the **Headline**, then click **Generate** next to **URL** — it
   fills itself in from the headline.
3. Optionally write a one-sentence **Summary** (shows in story lists) —
   leave it blank and the site just shows the headline with no summary
   line underneath.
4. Pick a **Category** from the dropdown.
5. Drag a photo into **Cover photo**. It auto-frames the subject the
   moment it finishes uploading, and shows a live preview of exactly how
   it'll look on the site right below the image — no more upload, check
   the site, re-upload. If it doesn't pick the right spot, drag the
   circle yourself or click **Re-detect crop**. The website automatically
   creates the right size for every screen (phone, tablet, desktop) from
   that one photo — you never resize anything yourself. Fill in the
   **Alt text** field — a short description for accessibility and search
   engines.
6. **Author** already defaults to "Editorial Team" — only change it if a
   specific writer should be credited instead. (First time only: add an
   Author named exactly "Editorial Team" via ✍️ Authors so this default
   has something to point to — every article after that picks it up
   automatically.)
7. Write the **Story** in the big text box like you would in Word:
   select text and use the toolbar to make it **bold**, *italic*, a
   heading, a bulleted list, a quote, or a link. Inline images you add
   get the same auto-crop and live preview as the cover photo.
8. Click **Publish** (top right). That's it — no deploy, no code.

### Editing the ad slot

**🖼️ Ad Slot** controls the ad box on the homepage sidebar. Click into it and
choose **What to show**:

- **Neutral placeholder box** — the default dashed box, useful while you
  don't have an ad to run yet.
- **Your own ad image** — upload an image, add a destination link and an
  advertiser name (used as the accessibility label), and it replaces the
  placeholder. This is for direct/house ads you've sold yourself.
- **Ad network code** — paste the exact embed snippet a network like Google
  AdSense gave you. It runs inside an isolated frame that can't affect the
  rest of the site, so it's safe to use — just only paste code from a
  provider you actually trust, the same way you'd be careful pasting any
  code anywhere.

Toggle **Show the ad slot** off any time to hide it entirely without losing
your settings.

### Editing things that only have one instance

Five items — **⚙️ Site Settings**, **Next Match**, **League Table**,
**📊 Season Stats**, and **🖼️ Ad Slot** — only ever have a single version, not
a list. Click straight into them, edit the fields, and hit **Publish**. You
can't accidentally create a duplicate or delete them.

### Reordering lists

Sponsors, Transfer Deals and Squad players are now **drag-and-drop** lists
— no more typing a number and guessing. Open **🤝 Sponsors**, **🔄 Transfer
Centre → Deals**, or **⚽ Squad** (which is split into Forwards /
Midfielders / Defenders / Goalkeepers, matching how the site groups them),
and just drag each row by its handle into the order you want. It saves
automatically — no separate publish step for the order itself.

### Deleting an item

Open the item, click the **⋯** menu in the top-right corner of its editor,
and choose **Delete**. This works for every list-type item — squad
players, transfer deals, sponsors, articles, fixtures, results, and so on.
(The five singletons above don't offer Delete since there must always be
exactly one of them — see "Editing things that only have one instance.")

### Showing the other club's real crest in Transfer Deals

Every deal in **🔄 Transfer Centre → Deals** has an **Other club** field —
a dropdown of every club you've added under **🏟️ Clubs**, rather than a
free-text field. Pick the club there and its real crest (whatever logo you
uploaded on that Club document) appears on the live site automatically.

So for a deal like "Nico Paz to Como for €60m": first open **🏟️ Clubs**,
add a new club named "Como" with its badge image uploaded to **Logo**,
then open the transfer deal and set **Other club** to Como. The frontend
will show Real Madrid's crest on one side and Como's real crest on the
other — no manual badge text needed. If a deal's other club hasn't been
added to **🏟️ Clubs** yet, it falls back to the plain **Other club's badge
text** field (a short 2-4 letter placeholder) until you do.

Club names don't have to match character-for-character between sections —
"Real Sociedad" and "Real Sociedad de Fútbol" (or "Real Madrid" vs "Real
Madrid CF") are recognised as the same club, so slightly different naming
in a fixture, result or transfer deal still finds the right crest.

### How fast do changes appear?

- With the webhook from Part 1 step 5 set up: **instantly**, usually
  within a couple of seconds of clicking Publish.
- Without it: automatically within about **60 seconds** — no action
  needed, just refresh the live site.

### Troubleshooting

- **"Studio won't load / shows a spinner forever"** — the Project ID
  environment variable isn't set yet, or CORS origins (Part 1, step 3)
  don't include the URL you're visiting from.
- **"I published but the site looks the same"** — wait up to a minute
  (or set up the webhook for instant updates), then hard-refresh
  (Ctrl/Cmd+Shift+R).
- **"I can't log in"** — you need to be invited as a project member first
  (Part 1, step 4); ask whoever administers the Sanity project.
- **Photos look stretched or oddly cropped** — reopen the image; if the
  auto-crop preview underneath it looks wrong, click **Re-detect crop**,
  or drag the hotspot circle onto the subject yourself. Every card on the
  site respects that same focal point — the preview shown in Studio is
  the same crop that ships, not an approximation of it.
