import {
  placeholderAssists,
  placeholderGoalkeeping,
  placeholderHomeStats,
  placeholderScorers,
  placeholderStatTiles,
} from "@/data/placeholder/stats";
import { fetchTopAssists, fetchTopScorers, isApiFootballConfigured } from "@/lib/sports-api/api-football";
import type { AssistStat, GoalkeepingStat, ScorerStat, StatTile } from "@/types/football";

const CURRENT_SEASON = new Date().getFullYear();

export async function getStatTiles(): Promise<StatTile[]> {
  return placeholderStatTiles;
}

export async function getScorers(): Promise<ScorerStat[]> {
  if (isApiFootballConfigured) {
    const scorers = await fetchTopScorers(CURRENT_SEASON);
    if (scorers) return scorers;
  }
  return placeholderScorers;
}

export async function getAssists(): Promise<AssistStat[]> {
  if (isApiFootballConfigured) {
    const assists = await fetchTopAssists(CURRENT_SEASON);
    if (assists) return assists;
  }
  return placeholderAssists;
}

export async function getGoalkeeping(): Promise<GoalkeepingStat[]> {
  return placeholderGoalkeeping;
}

export async function getHomeStats(): Promise<{ label: string; value: string }[]> {
  return placeholderHomeStats;
}
