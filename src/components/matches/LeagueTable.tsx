import { Card } from "@/components/ui/Card";
import { ClubBadge } from "@/components/ui/ClubBadge";
import type { StandingRow } from "@/types/football";

export function LeagueTable({ standings, title }: { standings: StandingRow[]; title: string }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <div className="border-b border-border pb-2.5">
        <h2 className="font-display text-[13px] font-bold tracking-[0.1em] text-heading">{title}</h2>
      </div>
      {standings.map((row) => (
        <div key={row.position} className="flex items-center gap-3 border-b border-border-soft py-2.5 last:border-0">
          <span className="w-4 font-body text-[11px] font-semibold text-muted">{row.position}</span>
          <ClubBadge name={row.team} sizePx={22} />
          <span className={`flex-1 font-body text-[13.5px] font-semibold ${row.isHighlighted ? "text-heading" : "text-subtle"}`}>
            {row.team}
          </span>
          <span className={`font-body text-[13px] font-semibold ${row.isHighlighted ? "text-heading" : "text-subtle"}`}>
            {row.points}
          </span>
        </div>
      ))}
    </Card>
  );
}
