import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getScorers } from "@/lib/data/stats";

export async function TopGoalscorersWidget() {
  const scorers = (await getScorers()).slice(0, 5);

  return (
    <Card className="flex flex-col p-4">
      <SectionHeading title="TOP GOALSCORERS" href="/stats" linkLabel="All stats →" />
      {scorers.map((scorer) => (
        <div key={scorer.rank} className="flex flex-col gap-1.5 border-b border-border-soft py-2.5 last:border-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold text-muted">{scorer.rank}</span>
              {scorer.image ? (
                <Image src={scorer.image} alt="" width={24} height={24} className="h-[24px] w-[24px] flex-none rounded-full border border-border-strong object-cover" />
              ) : null}
              <span className="font-body text-[13px] font-semibold text-heading">{scorer.name}</span>
            </div>
            <span className="font-display text-sm font-bold text-accent">{scorer.goals}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-track">
            <div className="h-full rounded-full bg-brand" style={{ width: `${scorer.barPercent}%` }} />
          </div>
        </div>
      ))}
    </Card>
  );
}
