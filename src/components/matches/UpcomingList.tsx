import { Card } from "@/components/ui/Card";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { opponentName } from "@/lib/utils/teamBadge";
import type { Fixture } from "@/types/football";

export function UpcomingList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="UPCOMING" tone="heading" />
      {fixtures.map((fixture) => {
        const opponent = opponentName(fixture.opponent);
        return (
          <div key={fixture.id} className="flex items-center justify-between gap-2 border-b border-border-soft py-3 last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-none items-center gap-1">
                <ClubBadge name="Real Madrid" sizePx={26} mobileSizePx={24} fallbackMark="RMA" />
                <ClubBadge name={opponent} sizePx={26} mobileSizePx={24} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-sm font-semibold text-heading">{opponent}</span>
                <span className="font-body text-[11px] text-muted">{fixture.competition}</span>
              </div>
            </div>
            <span className="font-body text-xs font-semibold text-muted">{fixture.date}</span>
          </div>
        );
      })}
    </Card>
  );
}
