import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomeStats } from "@/lib/data/stats";

export async function PlayerStatsWidget() {
  const stats = await getHomeStats();

  return (
    <Card className="flex flex-col p-4">
      <SectionHeading title="PLAYER STATS" href="/stats" linkLabel="All stats →" />
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1.5 border-b border-border-soft py-2.5 last:border-0">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{stat.label}</span>
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[13px] font-semibold text-heading">{stat.player}</span>
            <span className="font-display text-sm font-bold text-accent">{stat.value}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-track">
            <div className="h-full rounded-full bg-brand" style={{ width: `${stat.barPercent}%` }} />
          </div>
        </div>
      ))}
    </Card>
  );
}
