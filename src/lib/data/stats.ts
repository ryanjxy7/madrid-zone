import {
  placeholderAssists,
  placeholderGoalkeeping,
  placeholderHomeStats,
  placeholderScorers,
  placeholderStatTiles,
} from "@/data/placeholder/stats";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { seasonStatsQuery } from "@/lib/cms/sanity/queries";
import type { SanitySeasonStats } from "@/lib/cms/sanity/types";
import { fetchTopAssists, fetchTopScorers, isApiFootballConfigured } from "@/lib/sports-api/api-football";
import type { AssistStat, GoalkeepingStat, ScorerStat, StatTile } from "@/types/football";

const CURRENT_SEASON = new Date().getFullYear();

async function getSeasonStats(): Promise<SanitySeasonStats | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch<SanitySeasonStats>(seasonStatsQuery);
}

export async function getStatTiles(): Promise<StatTile[]> {
  const stats = await getSeasonStats();
  if (stats?.statTiles?.length) {
    return stats.statTiles.map((tile) => ({ value: tile.value, label: tile.label, sub: tile.sub ?? "" }));
  }
  return placeholderStatTiles;
}

export async function getScorers(): Promise<ScorerStat[]> {
  if (isApiFootballConfigured) {
    const scorers = await fetchTopScorers(CURRENT_SEASON);
    if (scorers) return scorers;
  }
  const stats = await getSeasonStats();
  if (stats?.topScorers?.length) {
    const sorted = [...stats.topScorers].sort((a, b) => b.goals - a.goals);
    const maxGoals = sorted[0].goals || 1;
    return sorted.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      goals: entry.goals,
      barPercent: Math.round((entry.goals / maxGoals) * 100),
    }));
  }
  return placeholderScorers;
}

export async function getAssists(): Promise<AssistStat[]> {
  if (isApiFootballConfigured) {
    const assists = await fetchTopAssists(CURRENT_SEASON);
    if (assists) return assists;
  }
  const stats = await getSeasonStats();
  if (stats?.topAssists?.length) {
    const sorted = [...stats.topAssists].sort((a, b) => b.assists - a.assists);
    return sorted.map((entry, index) => ({ rank: index + 1, name: entry.name, assists: entry.assists }));
  }
  return placeholderAssists;
}

export async function getGoalkeeping(): Promise<GoalkeepingStat[]> {
  const stats = await getSeasonStats();
  if (stats?.goalkeeping?.length) return stats.goalkeeping;
  return placeholderGoalkeeping;
}

export async function getHomeStats(): Promise<{ label: string; value: string }[]> {
  const stats = await getSeasonStats();
  if (stats?.homeStats?.length) return stats.homeStats;
  return placeholderHomeStats;
}
