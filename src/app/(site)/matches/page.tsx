import type { Metadata } from "next";
import Link from "next/link";
import { LeagueTable } from "@/components/matches/LeagueTable";
import { NextMatchCard } from "@/components/matches/NextMatchCard";
import { ResultsList } from "@/components/matches/ResultsList";
import { UpcomingList } from "@/components/matches/UpcomingList";
import { getNextMatch, getRecentResults, getStandings, getUpcomingFixtures } from "@/lib/data/matches";
import { getLiveMatch } from "@/lib/football/footballService";

export const metadata: Metadata = {
  title: "Matches",
  description: "Real Madrid fixtures, results and the LaLiga table, updated all season.",
  alternates: { canonical: "/matches" },
};

export default async function MatchesPage() {
  const [nextMatch, upcoming, results, standings, liveMatch] = await Promise.all([
    getNextMatch(),
    getUpcomingFixtures(),
    getRecentResults(),
    getStandings(),
    getLiveMatch(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">MATCHES</h1>
        <p className="font-body text-[13px] text-muted">Fixtures, results and how to watch.</p>
      </div>

      {liveMatch ? (
        <Link
          href={`/matches/${liveMatch.id}`}
          className="flex items-center gap-3 rounded-md border border-negative bg-negative/10 px-4 py-3 transition-opacity hover:opacity-90"
        >
          <span className="flex items-center gap-1.5 font-display text-xs font-bold tracking-[0.08em] text-negative">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-negative" />
            LIVE {liveMatch.minute !== null ? `${liveMatch.minute}'` : ""}
          </span>
          <span className="font-body text-sm font-semibold text-heading">
            {liveMatch.home.name} {liveMatch.home.score ?? 0} – {liveMatch.away.score ?? 0} {liveMatch.away.name}
          </span>
          <span className="ml-auto font-body text-xs font-semibold text-accent">Watch live →</span>
        </Link>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <NextMatchCard fixture={nextMatch} />
          <UpcomingList fixtures={upcoming} />
        </div>
        <div className="flex flex-col gap-4">
          <ResultsList results={results} />
          <LeagueTable standings={standings} title="LALIGA · STANDINGS" />
        </div>
      </div>
    </div>
  );
}
