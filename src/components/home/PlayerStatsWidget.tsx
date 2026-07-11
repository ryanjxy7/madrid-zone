import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomeStats } from "@/lib/data/stats";

export async function PlayerStatsWidget() {
  const stats = await getHomeStats();

  return (
    <Card className="flex flex-col p-4">
      <SectionHeading title="PLAYER STATS" href="/stats" linkLabel="All stats →" tone="heading" />
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between gap-2 border-b border-border-soft py-2.5 last:border-0">
          <span className="font-body text-xs text-muted">{stat.label}</span>
          <span className="font-body text-[12.5px] font-semibold text-heading">{stat.value}</span>
        </div>
      ))}
    </Card>
  );
}
