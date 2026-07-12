import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deriveTeamBadge } from "@/lib/utils/teamBadge";
import type { Fixture } from "@/types/football";

function opponentName(opponent: string): string {
  return opponent.replace(/Real Madrid vs /i, "").replace(/ vs Real Madrid/i, "");
}

export function UpcomingList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="UPCOMING" tone="heading" />
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="flex items-center justify-between gap-2 border-b border-border-soft py-3 last:border-0">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-none">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand font-display text-[7.5px] font-bold text-white">RMA</div>
              <div className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-[#565d73] font-display text-[7.5px] font-bold text-white">
                {deriveTeamBadge(opponentName(fixture.opponent))}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-body text-sm font-semibold text-heading">{fixture.opponent}</span>
              <span className="font-body text-[11px] text-muted">{fixture.competition}</span>
            </div>
          </div>
          <span className="font-body text-xs font-semibold text-muted">{fixture.date}</span>
        </div>
      ))}
    </Card>
  );
}
