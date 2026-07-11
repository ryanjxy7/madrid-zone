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
| ⚙️ Site Settings | Header follower count, contact emails, social links, newsletter box text |

### Publishing an article

1. Click **📰 Articles → + (New article)**.
2. Fill in the **Headline**, then click **Generate** next to **URL** — it
   fills itself in from the headline.
3. Write a one-sentence **Summary** (this shows in story lists).
4. Pick a **Category** from the dropdown.
5. Drag a photo into **Cover photo**. Click the image to open the crop
   tool and drag the circle onto the most important part of the photo —
   the website automatically creates the right size for every screen
   (phone, tablet, desktop) from that one photo. You never resize
   anything yourself. Fill in the **Alt text** field — a short description
   for accessibility and search engines.
6. Pick an **Author**, or add a new one first via ✍️ Authors.
7. Write the **Story** in the big text box like you would in Word:
   select text and use the toolbar to make it **bold**, *italic*, a
   heading, a bulleted list, a quote, or a link.
8. Click **Publish** (top right). That's it — no deploy, no code.

### Editing things that only have one instance

Four items — **⚙️ Site Settings**, **Next Match**, **League Table**, and
**📊 Season Stats** — only ever have a single version, not a list. Click
straight into them, edit the fields, and hit **Publish**. You can't
accidentally create a duplicate or delete them.

### Reordering lists

Sponsors, Transfer Deals and Squad players each have a **Display order**
number field — the lowest number shows first. Change the number and
publish to reorder.

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
- **Photos look stretched or oddly cropped** — reopen the image and drag
  the hotspot circle onto the subject; every card on the site respects
  that same focal point.
