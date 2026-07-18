import {
  footballConfig,
  getCacheStatus,
  getLiveMatch,
  getProviderStatus,
  getRecentResults,
  getStandings,
  getUpcomingFixtures,
} from "@/lib/football/footballService";
import { isFootballDataConfigured, REAL_MADRID_TEAM_ID, LALIGA_COMPETITION_CODE } from "@/lib/sports-api/football-data";

export const dynamic = "force-dynamic";

/**
 * Live diagnostic for the football data layer. Runs a handful of real
 * requests on every load (so you can tell "is the active provider
 * reachable from this Vercel deployment right now") and then shows the
 * accumulated provider status / cache contents from this server instance.
 * Delete this route once the integration is trusted, same as
 * /debug/api-football.
 */
export default async function FootballDebugPage() {
  const [fixtures, results, liveMatch, standings] = await Promise.all([
    getUpcomingFixtures(1),
    getRecentResults(1),
    getLiveMatch(),
    getStandings("laLiga"),
  ]);

  const status = getProviderStatus();
  const cache = getCacheStatus();
  const now = new Date();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>/debug/football</h1>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: 24 }}>
        Active provider: football-data.org (official, key-based) — fixtures, results, the live match centre, and
        standings. Chosen over API-Football specifically because its free tier includes current-season data.
        Squad, team info, player stats and top scorers/assists are intentionally not wired up here (top
        scorers/assists stay CMS-managed per your instruction) — they return null and fall back to
        Sanity/placeholder, same as any other unsupported provider method in this app.
      </p>

      <Section title="Configuration">
        <Row label="API key detected" value={isFootballDataConfigured ? "YES" : "NO"} tone={isFootballDataConfigured ? "ok" : "error"} />
        <Row label="Real Madrid team ID" value={REAL_MADRID_TEAM_ID} />
        <Row label="La Liga competition code" value={LALIGA_COMPETITION_CODE} />
        <Row label="Timezone" value={footballConfig.timezone} />
        <Row label="Server time" value={now.toISOString()} />
      </Section>

      <Section title="Live requests (run on this page load)">
        <Row
          label="getUpcomingFixtures(1)"
          value={fixtures && fixtures.length > 0 ? `OK — next: ${fixtures[0].opponent}` : "FAILED — see last error below"}
          tone={fixtures && fixtures.length > 0 ? "ok" : "error"}
        />
        <Row
          label="getRecentResults(1)"
          value={results && results.length > 0 ? `OK — ${results[0].match}` : "FAILED — see last error below"}
          tone={results && results.length > 0 ? "ok" : "error"}
        />
        <Row
          label="getLiveMatch()"
          value={liveMatch ? `LIVE — ${liveMatch.home.name} ${liveMatch.home.score} – ${liveMatch.away.score} ${liveMatch.away.name}` : "No match live right now (expected most of the time)"}
        />
        <Row
          label='getStandings("laLiga")'
          value={standings && standings.length > 0 ? `OK — ${standings.length} rows, top: ${standings[0].team}` : "FAILED — see last error below"}
          tone={standings && standings.length > 0 ? "ok" : "error"}
        />
      </Section>

      <Section title="Known gaps (not bugs — deliberately deferred, see conversation history)">
        <Row label="Team info / manager" value="Not wired — Squad page manager name comes from Sanity/placeholder instead" />
        <Row label="Squad / player photos" value="Not wired — Squad page uses Sanity/placeholder" />
        <Row label="Player season statistics" value="Not wired — falls back to Sanity/placeholder" />
        <Row label="Top scorers / assists" value="Not wired on purpose — stays CMS-managed" />
        <Row label="Live match events / lineups / statistics" value="Not available on football-data.org's free tier — score and status only" />
      </Section>

      <Section title="Last successful request">
        {status.lastSuccessfulRequest ? (
          <>
            <Row label="Endpoint" value={status.lastSuccessfulRequest.endpoint} />
            <Row label="Time" value={status.lastSuccessfulRequest.timestamp} />
            <Row label="Duration" value={`${status.lastSuccessfulRequest.timeMs}ms`} />
          </>
        ) : (
          <Row label="—" value="No successful request recorded yet on this instance" tone="error" />
        )}
      </Section>

      <Section title="Last error">
        {status.lastError ? (
          <>
            <Row label="Endpoint" value={status.lastError.endpoint} />
            <Row label="Time" value={status.lastError.timestamp} />
            <Row label="Error" value={status.lastError.error ?? "unknown"} tone="error" />
          </>
        ) : (
          <Row label="—" value="No errors recorded yet on this instance" tone="ok" />
        )}
      </Section>

      <Section title={`Recent requests (last ${status.recentRequests.length})`}>
        {status.recentRequests.length > 0 ? (
          status.recentRequests.map((req, index) => (
            <Row
              key={`${req.endpoint}-${index}`}
              label={`${req.timestamp} · ${req.endpoint}`}
              value={req.ok ? `OK · ${req.timeMs}ms` : `FAILED · ${req.error ?? "unknown"}`}
              tone={req.ok ? "ok" : "error"}
            />
          ))
        ) : (
          <Row label="—" value="No requests recorded yet" />
        )}
      </Section>

      <Section title={`Cache contents (${cache.length} key(s), this instance only)`}>
        {cache.length > 0 ? (
          cache.map((entry) => (
            <Row key={entry.key} label={entry.key} value={`fetched ${entry.fetchedAt} · ${entry.ageSeconds}s ago`} />
          ))
        ) : (
          <Row label="—" value="Cache is empty on this instance" />
        )}
      </Section>

      <div style={{ background: "#1d2b3f", border: "1px solid #1e3a5f", borderRadius: 6, padding: 16, marginTop: 8, color: "#9ca3af" }}>
        Note: this cache and request log are in-memory and scoped to one warm serverless instance — they reset on
        cold start and aren&apos;t shared across concurrent instances. That&apos;s expected; see the comment in
        src/lib/football/cache/cache.ts for the reasoning and how to swap in Vercel KV / Redis if you need
        cross-instance persistence.
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "#9ca3af", marginBottom: 10 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" | "error" }) {
  const color = tone === "ok" ? "#4ade80" : tone === "error" ? "#f87171" : "#e5e7eb";
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <span style={{ color: "#9ca3af", minWidth: 260 }}>{label}</span>
      <span style={{ color, fontWeight: 600, wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}
