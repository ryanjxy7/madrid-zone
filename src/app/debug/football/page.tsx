import {
  footballConfig,
  getCacheStatus,
  getProviderStatus,
  getSquad,
  getStandings,
  getTeamInfo,
  getUpcomingFixtures,
} from "@/lib/football/footballService";

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
  const [teamInfo, fixtures, standings, squad] = await Promise.all([
    getTeamInfo(),
    getUpcomingFixtures(1),
    getStandings("laLiga"),
    getSquad(),
  ]);

  const status = getProviderStatus();
  const cache = getCacheStatus();
  const now = new Date();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>/debug/football</h1>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: 24 }}>
        Active provider: ESPN (unofficial). Like every other option here, it has no key, no documented contract and
        no SLA — it can change shape or get blocked without notice, though it&apos;s empirically far more tolerant
        of cloud/datacenter IPs than Sofascore was. This page shows exactly what this server instance has seen,
        live. See docs/ESPN_GUIDE.md for the full endpoint audit and known gaps.
      </p>

      <Section title="Configuration">
        <Row label="Provider" value="ESPN (unofficial)" />
        <Row label="Real Madrid ESPN team ID" value={footballConfig.espn.teamId} />
        <Row label="La Liga league slug" value={footballConfig.espn.leagues.laLiga} />
        <Row label="Champions League slug" value={footballConfig.espn.leagues.championsLeague} />
        <Row label="Timezone" value={footballConfig.timezone} />
        <Row label="API base URL" value={footballConfig.espn.baseUrl} />
        <Row label="Standings base URL" value={footballConfig.espn.standingsBaseUrl} />
        <Row label="Request timeout / retries" value={`${footballConfig.espn.timeoutMs}ms / ${footballConfig.espn.retries}`} />
        <Row label="Server time" value={now.toISOString()} />
      </Section>

      <Section title="Live requests (run on this page load)">
        <Row
          label={`getTeamInfo() → resolves team ${footballConfig.espn.teamId}`}
          value={teamInfo ? `OK — "${teamInfo.name}"` : "FAILED — see last error below"}
          tone={teamInfo ? "ok" : "error"}
        />
        <Row
          label="getUpcomingFixtures(1)"
          value={fixtures && fixtures.length > 0 ? `OK — next: ${fixtures[0].opponent}` : "FAILED — see last error below"}
          tone={fixtures && fixtures.length > 0 ? "ok" : "error"}
        />
        <Row
          label={`getStandings("laLiga")`}
          value={standings && standings.length > 0 ? `OK — ${standings.length} row(s)` : "FAILED — see last error below"}
          tone={standings && standings.length > 0 ? "ok" : "error"}
        />
        <Row
          label="getSquad()"
          value={squad && squad.length > 0 ? `OK — ${squad.reduce((n, g) => n + g.players.length, 0)} player(s)` : "FAILED — see last error below"}
          tone={squad && squad.length > 0 ? "ok" : "error"}
        />
      </Section>

      <Section title="Known provider gaps (not bugs — ESPN doesn't reliably expose these for soccer)">
        <Row label="Player season statistics" value="Not available — falls back to Sanity/placeholder" tone="error" />
        <Row label="Top scorers leaderboard" value="Not available — falls back to Sanity/placeholder" tone="error" />
        <Row label="Top assists leaderboard" value="Not available — falls back to Sanity/placeholder" tone="error" />
        <Row label="Champions League standings" value="Available but format needs live verification (Swiss-model table)" />
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
