import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAssists, getScorers } from "@/lib/data/stats";
import { getBestRatedPlayers } from "@/lib/football/footballService";

export const metadata: Metadata = {
  title: "La Liga Leaders",
  description: "This season's La Liga top scorers, most assists and best-rated players.",
  alternates: { canonical: "/stats/leaders" },
};

export default async function LeadersPage() {
  const [scorers, assists, rated] = await Promise.all([
    getScorers(),
    getAssists(),
    getBestRatedPlayers("laLiga"),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">LA LIGA LEADERS</h1>
        <p className="font-body text-[13px] text-muted">League-wide leaderboards, updated through the season.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="TOP SCORERS" tone="heading" />
          {scorers && scorers.length > 0 ? (
            scorers.map((scorer) => (
              <div key={scorer.rank} className="flex items-center gap-3 border-b border-border-soft py-2.5 last:border-0">
                <span className="w-[18px] font-display text-sm font-bold text-muted">{scorer.rank}</span>
                <Image src={scorer.image} alt="" width={26} height={26} className="h-[26px] w-[26px] flex-none rounded-full border-[1.5px] border-border-strong object-cover" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-body text-[13.5px] font-semibold text-heading">{scorer.name}</span>
                  {scorer.team ? <span className="font-body text-[11px] text-muted">{scorer.team}</span> : null}
                </div>
                <span className="font-display text-sm font-bold text-accent">{scorer.goals}</span>
              </div>
            ))
          ) : (
            <p className="pt-3 font-body text-sm text-muted">Not available right now.</p>
          )}
        </Card>

        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="MOST ASSISTS" tone="heading" />
          {assists && assists.length > 0 ? (
            assists.map((assist) => (
              <div key={assist.rank} className="flex items-center gap-3 border-b border-border-soft py-2.5 last:border-0">
                <span className="w-[18px] font-display text-sm font-bold text-muted">{assist.rank}</span>
                <Image src={assist.image} alt="" width={26} height={26} className="h-[26px] w-[26px] flex-none rounded-full border-[1.5px] border-border-strong object-cover" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-body text-[13.5px] font-semibold text-heading">{assist.name}</span>
                  {assist.team ? <span className="font-body text-[11px] text-muted">{assist.team}</span> : null}
                </div>
                <span className="font-display text-sm font-bold text-accent">{assist.assists}</span>
              </div>
            ))
          ) : (
            <p className="pt-3 font-body text-sm text-muted">Not available right now.</p>
          )}
        </Card>

        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="BEST RATED" tone="heading" />
          {rated && rated.length > 0 ? (
            rated.map((player) => (
              <div key={player.rank} className="flex items-center gap-3 border-b border-border-soft py-2.5 last:border-0">
                <span className="w-[18px] font-display text-sm font-bold text-muted">{player.rank}</span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-body text-[13.5px] font-semibold text-heading">{player.name}</span>
                  <span className="font-body text-[11px] text-muted">
                    {player.team} · {player.goals}G {player.assists}A
                  </span>
                </div>
                {player.rating !== null ? <span className="font-display text-sm font-bold text-accent">{player.rating.toFixed(1)}</span> : null}
              </div>
            ))
          ) : (
            <p className="pt-3 font-body text-sm text-muted">Not available right now.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
