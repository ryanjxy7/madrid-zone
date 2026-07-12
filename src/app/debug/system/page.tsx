import { checkApiFootball, checkSanity } from "@/lib/debug/systemStatus";

export const dynamic = "force-dynamic";

const ENV_VARS = [
  "API_FOOTBALL_KEY",
  "API_FOOTBALL_BASE_URL",
  "API_FOOTBALL_TEAM_ID",
  "API_FOOTBALL_LEAGUE_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "SANITY_REVALIDATE_SECRET",
] as const;

export default async function SystemDebugPage() {
  const [sanity, apiFootball] = await Promise.all([checkSanity(), checkApiFootball()]);

  return (
    <main style={{ maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>/debug/system</h1>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: 24 }}>
        Live on every load. Delete src/app/debug once you&apos;re done. See also{" "}
        <code>/api/health</code> for the same data as JSON.
      </p>

      <Section title="Services">
        <Row label="Sanity connected" value={statusText(sanity.configured, sanity.reachable)} tone={statusTone(sanity.configured, sanity.reachable)} />
        {sanity.error ? <Row label="Sanity detail" value={sanity.error} tone="error" /> : null}
        <Row
          label="Football API connected"
          value={statusText(apiFootball.configured, apiFootball.reachable)}
          tone={statusTone(apiFootball.configured, apiFootball.reachable)}
        />
        {apiFootball.error ? <Row label="Football API detail" value={apiFootball.error} tone="error" /> : null}
        {apiFootball.quota ? (
          <Row label="Football API quota" value={`${apiFootball.quota.requestsToday} / ${apiFootball.quota.dailyLimit} used today · plan: ${apiFootball.quota.plan}`} />
        ) : null}
      </Section>

      <Section title="Environment variables loaded">
        {ENV_VARS.map((name) => (
          <Row key={name} label={name} value={process.env[name] ? "SET" : "NOT SET"} tone={process.env[name] ? "ok" : "error"} />
        ))}
      </Section>

      <Section title="Deployment">
        <Row label="Environment" value={process.env.VERCEL_ENV ?? "local (VERCEL_ENV not set)"} />
        <Row label="Vercel region" value={process.env.VERCEL_REGION ?? "n/a (not running on Vercel)"} />
        <Row label="Git commit" value={process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "n/a"} />
        <Row label="Node version" value={process.version} />
        <Row label="NODE_ENV" value={process.env.NODE_ENV ?? "unknown"} />
      </Section>
    </main>
  );
}

function statusText(configured: boolean, reachable: boolean | null): string {
  if (!configured) return "NOT CONFIGURED";
  return reachable ? "YES" : "CONFIGURED BUT UNREACHABLE";
}

function statusTone(configured: boolean, reachable: boolean | null): "ok" | "error" {
  return configured && reachable ? "ok" : "error";
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
      <span style={{ color, fontWeight: 600, wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}
