"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LiveMatchDetail, MatchEvent } from "@/lib/football/types/domain";

// Inside the 30-60s window requested for the Live Match Centre. Hardcoded
// here (rather than imported from the server-only football config) so this
// client bundle never pulls in server configuration.
const LIVE_POLL_MS = 45_000;

const EVENT_ICON: Record<MatchEvent["type"], string> = {
  goal: "⚽",
  "own-goal": "⚽",
  penalty: "⚽",
  "yellow-card": "🟨",
  "red-card": "🟥",
  substitution: "🔄",
};

function StatusBadge({ status, minute }: { status: LiveMatchDetail["status"]; minute: number | null }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-display text-xs font-bold tracking-[0.08em] text-brand">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        LIVE {minute !== null ? `${minute}'` : ""}
      </span>
    );
  }
  if (status === "finished") {
    return <span className="rounded-full bg-border-soft px-2.5 py-1 font-display text-xs font-bold tracking-[0.08em] text-muted">FULL TIME</span>;
  }
  if (status === "postponed" || status === "canceled") {
    return (
      <span className="rounded-full bg-warning/10 px-2.5 py-1 font-display text-xs font-bold tracking-[0.08em] text-warning">
        {status.toUpperCase()}
      </span>
    );
  }
  return <span className="rounded-full bg-border-soft px-2.5 py-1 font-display text-xs font-bold tracking-[0.08em] text-muted">SCHEDULED</span>;
}

export function LiveMatchCentre({ matchId, initialMatch }: { matchId: string; initialMatch: LiveMatchDetail }) {
  const [match, setMatch] = useState(initialMatch);

  useEffect(() => {
    if (match.status !== "live") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/football/match/${matchId}`, { cache: "no-store" });
        if (!res.ok) return;
        const fresh: LiveMatchDetail = await res.json();
        setMatch(fresh);
      } catch {
        // Keep showing the last known state — never blank out a live match
        // just because one poll failed.
      }
    }, LIVE_POLL_MS);

    return () => clearInterval(interval);
  }, [match.status, matchId]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 border-brand p-5 sm:p-[22px_26px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-display text-xs font-bold tracking-[0.14em] text-accent">{match.competition.toUpperCase()}</span>
          <StatusBadge status={match.status} minute={match.minute} />
        </div>
        <div className="flex items-center justify-around gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="font-body text-[15px] font-semibold text-heading">{match.home.name}</span>
          </div>
          <span className="font-display text-2xl font-bold text-heading sm:text-[32px]">
            {match.home.score ?? "-"} – {match.away.score ?? "-"}
          </span>
          <div className="flex flex-col items-center gap-2">
            <span className="font-body text-[15px] font-semibold text-heading">{match.away.name}</span>
          </div>
        </div>
        <p className="text-center font-body text-xs text-muted">
          {match.kickOff}
          {match.venue ? ` · ${match.venue}` : ""}
        </p>
      </Card>

      {match.events.length > 0 ? (
        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="MATCH EVENTS" tone="heading" />
          {match.events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 border-b border-border-soft py-2.5 last:border-0">
              <span className="w-8 font-body text-[11px] font-semibold text-muted">{event.minute}&apos;</span>
              <span aria-hidden>{EVENT_ICON[event.type]}</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-sm font-semibold text-heading">{event.player}</span>
                {event.secondaryPlayer ? (
                  <span className="font-body text-[11px] text-muted">
                    {event.type === "substitution" ? `On for ${event.secondaryPlayer}` : `Assist: ${event.secondaryPlayer}`}
                  </span>
                ) : null}
              </div>
              <span className="ml-auto font-body text-[11px] uppercase text-muted">{event.team}</span>
            </div>
          ))}
        </Card>
      ) : null}

      {match.statistics.length > 0 ? (
        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="MATCH STATISTICS" tone="heading" />
          {match.statistics.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between gap-3 border-b border-border-soft py-2.5 last:border-0">
              <span className="w-12 text-right font-body text-sm font-semibold text-heading">{stat.home}</span>
              <span className="flex-1 text-center font-body text-[11px] text-muted">{stat.label}</span>
              <span className="w-12 font-body text-sm font-semibold text-heading">{stat.away}</span>
            </div>
          ))}
        </Card>
      ) : null}

      {match.lineups ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["home", "away"] as const).map((side) => (
            <Card key={side} className="flex flex-col p-4 sm:p-[16px_22px]">
              <SectionHeading title={side === "home" ? match.home.name.toUpperCase() : match.away.name.toUpperCase()} tone="heading" />
              {match.lineups![side].formation ? (
                <p className="pt-2 font-body text-[11px] text-muted">Formation: {match.lineups![side].formation}</p>
              ) : null}
              {match.lineups![side].players
                .filter((player) => !player.isSubstitute)
                .map((player) => (
                  <div key={player.id} className="flex items-center gap-3 border-b border-border-soft py-2 last:border-0">
                    <span className="w-6 font-body text-[11px] font-semibold text-muted">{player.number}</span>
                    <span className="flex-1 font-body text-sm text-heading">{player.name}</span>
                    {player.rating ? <span className="font-body text-xs font-semibold text-accent">{player.rating.toFixed(1)}</span> : null}
                  </div>
                ))}
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
