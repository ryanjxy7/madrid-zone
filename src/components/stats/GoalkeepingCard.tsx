import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GoalkeepingStat } from "@/types/football";

export function GoalkeepingCard({ stats }: { stats: GoalkeepingStat[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="GOALKEEPING" tone="heading" />
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between gap-2 border-b border-border-soft py-2.5 last:border-0">
          <span className="font-body text-[13.5px] font-semibold text-heading">{stat.label}</span>
          <span className="font-display text-sm font-bold text-accent">{stat.value}</span>
        </div>
      ))}
    </Card>
  );
}
