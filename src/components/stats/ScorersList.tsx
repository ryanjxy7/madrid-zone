import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ScorerStat } from "@/types/football";

export function ScorersList({ scorers }: { scorers: ScorerStat[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="TOP SCORERS" tone="heading" />
      {scorers.map((scorer) => (
        <div key={scorer.rank} className="flex items-center gap-3.5 border-b border-border-soft py-3 last:border-0">
          <span className="w-[18px] font-display text-[15px] font-bold text-muted">{scorer.rank}</span>
          <Image src={scorer.image} alt="" width={26} height={26} className="h-[26px] w-[26px] flex-none rounded-full border-[1.5px] border-border-strong object-cover" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="font-body text-[13.5px] font-semibold text-heading">{scorer.name}</span>
              <span className="font-display text-sm font-bold text-accent">{scorer.goals}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-track">
              <div className="h-full rounded-full bg-brand" style={{ width: `${scorer.barPercent}%` }} />
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
