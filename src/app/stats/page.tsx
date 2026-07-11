import type { Metadata } from "next";
import { AssistsList } from "@/components/stats/AssistsList";
import { GoalkeepingCard } from "@/components/stats/GoalkeepingCard";
import { ScorersList } from "@/components/stats/ScorersList";
import { StatTileCard } from "@/components/stats/StatTileCard";
import { getAssists, getGoalkeeping, getScorers, getStatTiles } from "@/lib/data/stats";

export const metadata: Metadata = {
  title: "Stats",
  description: "The Real Madrid season in numbers — goals, assists, clean sheets and more.",
  alternates: { canonical: "/stats" },
};

export default async function StatsPage() {
  const [tiles, scorers, assists, goalkeeping] = await Promise.all([
    getStatTiles(),
    getScorers(),
    getAssists(),
    getGoalkeeping(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">STATS</h1>
        <p className="font-body text-[13px] text-muted">The season in numbers · all competitions.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatTileCard key={tile.label} tile={tile} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ScorersList scorers={scorers} />
        <div className="flex flex-col gap-5">
          <AssistsList assists={assists} />
          <GoalkeepingCard stats={goalkeeping} />
        </div>
      </div>
    </div>
  );
}
