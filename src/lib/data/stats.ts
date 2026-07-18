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
import { getTopAssists as getLiveTopAssists, getTopScorers as getLiveTopScorers } from "@/lib/football/footballService";
import { getPlayerPhotoOverrides } from "@/lib/data/squad";
import { slugifyPlayerName } from "@/lib/football/footballService";
import type { AssistStat, GoalkeepingStat, HomeStatRow, ScorerStat, StatTile } from "@/types/football";

async function getSeasonStats(): Promise<SanitySeasonStats | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch<SanitySeasonStats>(seasonStatsQuery);
}

/**
 * Sofascore has no clean single-call "team season summary" endpoint, so
 * these tiles (matches played, goals scored, trophies, etc.) stay fully
 * editorial via Sanity — see docs/API_FOOTBALL_GUIDE.md for the shape.
 */
export async function getStatTiles(): Promise<StatTile[]> {
  const stats = await getSeasonStats();
  if (stats?.statTiles?.length) {
    return stats.statTiles.map((tile) => ({ value: tile.value, label: tile.label, sub: tile.sub ?? "" }));
  }
  return placeholderStatTiles;
}

/** Editor-uploaded player photos (see squad.ts) shown next to leaderboard names, same as everywhere else a player appears. */
function withPhotos<T extends { name: string; image?: string }>(entries: T[], overrides: Map<string, string>): T[] {
  if (overrides.size === 0) return entries;
  return entries.map((entry) => {
    const image = overrides.get(slugifyPlayerName(entry.name));
    return image ? { ...entry, image } : entry;
  });
}

export async function getScorers(): Promise<ScorerStat[]> {
  const [scorers, photoOverrides] = await Promise.all([getLiveTopScorers("laLiga"), getPlayerPhotoOverrides()]);
  if (scorers && scorers.length > 0) return withPhotos(scorers, photoOverrides);
  const stats = await getSeasonStats();
  if (stats?.topScorers?.length) {
    const sorted = [...stats.topScorers].sort((a, b) => b.goals - a.goals);
    const maxGoals = sorted[0].goals || 1;
    return withPhotos(
      sorted.map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        goals: entry.goals,
        barPercent: Math.round((entry.goals / maxGoals) * 100),
      })),
      photoOverrides
    );
  }
  return withPhotos(placeholderScorers, photoOverrides);
}

export async function getAssists(): Promise<AssistStat[]> {
  const [assists, photoOverrides] = await Promise.all([getLiveTopAssists("laLiga"), getPlayerPhotoOverrides()]);
  if (assists && assists.length > 0) return withPhotos(assists, photoOverrides);
  const stats = await getSeasonStats();
  if (stats?.topAssists?.length) {
    const sorted = [...stats.topAssists].sort((a, b) => b.assists - a.assists);
    return withPhotos(
      sorted.map((entry, index) => ({ rank: index + 1, name: entry.name, assists: entry.assists })),
      photoOverrides
    );
  }
  return withPhotos(placeholderAssists, photoOverrides);
}

export async function getGoalkeeping(): Promise<GoalkeepingStat[]> {
  const stats = await getSeasonStats();
  if (stats?.goalkeeping?.length) return stats.goalkeeping;
  return placeholderGoalkeeping;
}

export async function getHomeStats(): Promise<HomeStatRow[]> {
  const stats = await getSeasonStats();
  if (stats?.homeStats?.length) return stats.homeStats;
  return placeholderHomeStats;
}
