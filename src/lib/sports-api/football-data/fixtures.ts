import type { Fixture, MatchResult } from "@/types/football";
import { footballDataFetch, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { FootballDataMatch, FootballDataMatchesResponse } from "./types";

function formatFixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const FINISHED_STATUSES = new Set(["FINISHED", "AWARDED"]);

/**
 * A plain date-range query (dateFrom/dateTo) — deliberately avoiding any
 * status/limit-style params, since API-Football's free plan rejecting
 * `next`/`last` outright taught this project not to assume a "convenience"
 * parameter is free-tier safe. This pulls every Real Madrid match across
 * all competitions in a ~7-month window (90 days back, 120 days ahead)
 * once, cached, and sorts/filters it locally into "upcoming" and "recent"
 * below.
 */
async function fetchMatchWindow(): Promise<FootballDataMatch[] | null> {
  const data = await footballDataFetch<FootballDataMatchesResponse>(
    `/teams/${REAL_MADRID_TEAM_ID}/matches`,
    { dateFrom: isoDate(-90), dateTo: isoDate(120) },
    { revalidate: REVALIDATE.matchData }
  );
  return data?.matches ?? null;
}

export async function fetchUpcomingFixtures(count = 5): Promise<Fixture[] | null> {
  const data = await fetchMatchWindow();
  if (!data || data.length === 0) return null;

  const now = Date.now();
  const upcoming = data
    .filter((m) => new Date(m.utcDate).getTime() > now)
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, count);
  if (upcoming.length === 0) return null;

  return upcoming.map((m) => ({
    id: String(m.id),
    opponent:
      String(m.homeTeam.id) === REAL_MADRID_TEAM_ID
        ? `Real Madrid vs ${m.awayTeam.name}`
        : `${m.homeTeam.name} vs Real Madrid`,
    competition: m.competition.name,
    date: formatFixtureDate(m.utcDate),
    venue: m.venue ?? undefined,
    isHome: String(m.homeTeam.id) === REAL_MADRID_TEAM_ID,
  }));
}

export async function fetchRecentResults(count = 5): Promise<MatchResult[] | null> {
  const data = await fetchMatchWindow();
  if (!data || data.length === 0) return null;

  const recent = data
    .filter((m) => FINISHED_STATUSES.has(m.status))
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, count);
  if (recent.length === 0) return null;

  return recent.map((m) => {
    const isHome = String(m.homeTeam.id) === REAL_MADRID_TEAM_ID;
    const madridGoals = isHome ? m.score.fullTime.home : m.score.fullTime.away;
    const oppGoals = isHome ? m.score.fullTime.away : m.score.fullTime.home;
    const outcome = madridGoals === oppGoals ? "D" : (madridGoals ?? 0) > (oppGoals ?? 0) ? "W" : "L";
    return {
      id: String(m.id),
      match: `${m.homeTeam.name} ${m.score.fullTime.home}–${m.score.fullTime.away} ${m.awayTeam.name}`,
      competition: m.competition.name,
      outcome,
    };
  });
}

/** Real Madrid's currently in-progress match, if any — same window fetch, just filtered to live statuses instead of by date. */
export async function fetchLiveMatch(): Promise<FootballDataMatch | null> {
  const data = await fetchMatchWindow();
  return data?.find((m) => m.status === "IN_PLAY" || m.status === "PAUSED") ?? null;
}
