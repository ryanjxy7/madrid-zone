import {
  CHAMPIONS_LEAGUE_ID,
  getCurrentSeason,
  isApiFootballConfigured,
  LALIGA_LEAGUE_ID,
  REAL_MADRID_TEAM_ID,
} from "@/lib/sports-api/api-football";
import { testEndpoint, type EndpointTestResult } from "./testEndpoint";

export const dynamic = "force-dynamic";

async function runTests(season: number) {
  return Promise.all([
    testEndpoint("Fixtures (next 5)", "/fixtures", { team: REAL_MADRID_TEAM_ID, next: "5" }),
    testEndpoint("Standings", "/standings", { league: LALIGA_LEAGUE_ID, season: String(season) }),
    testEndpoint("Team (verifies ID 541 = Real Madrid)", "/teams", { id: REAL_MADRID_TEAM_ID }),
    testEndpoint("League (verifies ID 140 = La Liga)", "/leagues", { id: LALIGA_LEAGUE_ID }),
    testEndpoint("League (verifies ID 2 = UEFA Champions League)", "/leagues", { id: CHAMPIONS_LEAGUE_ID }),
    testEndpoint("Players (squad)", "/players", { team: REAL_MADRID_TEAM_ID, season: String(season) }),
    testEndpoint("Statistics", "/teams/statistics", { team: REAL_MADRID_TEAM_ID, league: LALIGA_LEAGUE_ID, season: String(season) }),
    testEndpoint("Live Matches", "/fixtures", { live: "all" }, { allowEmpty: true }),
    testEndpoint("Top Scorers", "/players/topscorers", { league: LALIGA_LEAGUE_ID, season: String(season), team: REAL_MADRID_TEAM_ID }),
  ]);
}

export default async function ApiFootballDebugPage() {
  const keyDetected = isApiFootballConfigured;
  const season = keyDetected ? await getCurrentSeason() : null;
  const results = keyDetected ? await runTests(season as number) : [];
  const now = new Date();

  return (
    <main style={{ maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>/debug/api-football</h1>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: 24 }}>
        Live diagnostic — every request below runs fresh on each page load, uncached. Delete this route once you&apos;re
        done.
      </p>

      <Section title="Configuration">
        <Row label="API key detected" value={keyDetected ? "YES" : "NO"} tone={keyDetected ? "ok" : "error"} />
        <Row label="Team ID" value={REAL_MADRID_TEAM_ID} />
        <Row label="League ID" value={LALIGA_LEAGUE_ID} />
        <Row label="Current season (auto-detected)" value={season !== null ? String(season) : "n/a — key not set"} />
        <Row label="Server timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
        <Row label="Current date/time (server)" value={now.toISOString()} />
      </Section>

      {!keyDetected ? (
        <div style={{ background: "#3f1d1d", border: "1px solid #7f1d1d", borderRadius: 6, padding: 16, marginTop: 16 }}>
          API_FOOTBALL_KEY is not set in this environment, so no requests were made. Set it in Vercel → Settings →
          Environment Variables, then redeploy.
        </div>
      ) : (
        <Section title="Endpoint tests">
          {results.map((result) => (
            <EndpointResult key={result.name} result={result} />
          ))}
        </Section>
      )}
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
    <div style={{ display: "flex", gap: 12 }}>
      <span style={{ color: "#9ca3af", minWidth: 260 }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function EndpointResult({ result }: { result: EndpointTestResult }) {
  const badgeColor = result.ok ? "#166534" : "#7f1d1d";
  const badgeText = result.ok ? "OK" : "FAILED";

  return (
    <details style={{ border: "1px solid #1f2937", borderRadius: 6, background: "#111827" }}>
      <summary style={{ cursor: "pointer", padding: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ background: badgeColor, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{badgeText}</span>
        <strong>{result.name}</strong>
        <span style={{ color: "#9ca3af" }}>
          {result.status ?? "—"} · {result.timeMs}ms
          {result.resultCount !== null ? ` · ${result.resultCount} result(s)` : ""}
          {result.quotaRemaining ? ` · quota remaining: ${result.quotaRemaining}` : ""}
        </span>
      </summary>
      <div style={{ padding: "0 12px 12px" }}>
        <div style={{ color: "#9ca3af", marginBottom: 8, wordBreak: "break-all" }}>{result.url}</div>
        {result.error ? (
          <div style={{ color: "#f87171", marginBottom: 8 }}>
            {result.statusLabel ?? result.error}
            {result.statusLabel ? <div style={{ color: "#9ca3af" }}>{result.error}</div> : null}
          </div>
        ) : null}
        {result.bodyPreview ? (
          <pre
            style={{
              background: "#0b0d12",
              padding: 12,
              borderRadius: 4,
              overflowX: "auto",
              fontSize: 12,
              margin: 0,
            }}
          >
            {result.bodyPreview}
          </pre>
        ) : null}
      </div>
    </details>
  );
}
