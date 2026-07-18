import { opponentName } from "@/lib/utils/teamBadge";
import type { Fixture } from "@/types/football";

export function NextMatchCard({ fixture }: { fixture: Fixture }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-brand bg-card p-5 sm:p-[22px_26px]">
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <span className="font-display text-xs font-bold tracking-[0.14em] text-accent">
          NEXT MATCH · {fixture.competition.toUpperCase()}
        </span>
        <span className="font-body text-xs text-muted">
          {fixture.date} {fixture.kickOff ? `· ${fixture.kickOff}` : ""}
        </span>
      </div>
      <div className="flex items-center justify-around gap-4">
        <TeamBadge label="RMA" name="Real Madrid" tone="brand" />
        <span className="font-display text-xl font-bold text-muted sm:text-[26px]">VS</span>
        <TeamBadge label="OPP" name={opponentName(fixture.opponent)} tone="neutral" />
      </div>
      {fixture.venue ? (
        <p className="text-center font-body text-xs text-muted">{fixture.venue}</p>
      ) : null}
    </div>
  );
}

function TeamBadge({ label, name, tone }: { label: string; name: string; tone: "brand" | "neutral" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-[15px] font-bold tracking-[0.04em] text-white ${
          tone === "brand" ? "bg-brand" : "bg-[#565d73]"
        }`}
      >
        {label}
      </div>
      <span className="font-body text-[15px] font-semibold text-heading">{name}</span>
    </div>
  );
}
