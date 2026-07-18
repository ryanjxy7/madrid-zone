import {
  placeholderAppearancesLeaders,
  placeholderAssists,
  placeholderGoalkeeping,
  placeholderHomeStats,
  placeholderMinutesLeaders,
  placeholderScorers,
  placeholderStatTiles,
  placeholderTopRatedLeaders,
} from "@/data/placeholder/stats";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { seasonStatsQuery } from "@/lib/cms/sanity/queries";
import type { SanitySeasonStats } from "@/lib/cms/sanity/types";
import { getTopAssists as getLiveTopAssists, getTopScorers as getLiveTopScorers } from "@/lib/football/footballService";
import { findPhotoOverride, getPlayerPhotoOverrides, type PhotoOverride } from "@/lib/data/squad";
import { placeholderImage } from "@/lib/utils/images";
import type { AssistStat, HomeStatRow, ScorerStat, StatLeaderCategory, StatLeaderRow, StatTile } from "@/types/football";

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

/**
 * Every leaderboard row always gets a photo — an editor-uploaded one (see
 * squad.ts) if there is one, otherwise a deterministic placeholder, same
 * as the design always shows one. Never conditional: a scorer/assist row
 * with no photo at all doesn't match the design and shouldn't happen.
 */
function withPhotos<T extends { name: string; image?: string }>(entries: T[], overrides: Map<string, PhotoOverride>): (T & { image: string })[] {
  return entries.map((entry) => ({
    ...entry,
    image: findPhotoOverride(entry.name, overrides) ?? entry.image ?? placeholderImage(entry.name, 80, 80),
  }));
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

export async function getHomeStats(): Promise<HomeStatRow[]> {
  const stats = await getSeasonStats();
  if (stats?.homeStats?.length) return stats.homeStats;
  return placeholderHomeStats;
}

/** "Clean sheets — T. Courtois" -> "T. Courtois", so goalkeeping rows can still try a real photo match; falls back to the whole label if there's no dash to split on. */
function nameFromGoalkeepingLabel(label: string): string {
  const parts = label.split(/\s+[—-]\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : label;
}

function toNumericValue(value: string): number {
  return parseFloat(value.replace(/[,%]/g, "")) || 0;
}

function buildLeaderRows(
  entries: { name: string; value: string }[],
  overrides: Map<string, PhotoOverride>,
  photoNameFor: (name: string) => string = (name) => name
): StatLeaderRow[] {
  const max = Math.max(...entries.map((entry) => toNumericValue(entry.value)), 1);
  return entries.map((entry, index) => ({
    rank: index + 1,
    name: entry.name,
    value: entry.value,
    barPercent: Math.round((toNumericValue(entry.value) / max) * 100),
    image: findPhotoOverride(photoNameFor(entry.name), overrides) ?? placeholderImage(entry.name, 80, 80),
  }));
}

/**
 * The Stats page's tabbed "Stat Leaders" widget — Appearances, Minutes,
 * Goalkeeping and Top Rated, each ranked and with a photo, computed once
 * here so the (client) widget component just picks a tab and renders.
 * Goalkeeping reuses the existing goalkeeping field (already editorial),
 * the other three are new fields on the same seasonStats singleton.
 */
export async function getStatLeaderCategories(): Promise<StatLeaderCategory[]> {
  const [stats, photoOverrides] = await Promise.all([getSeasonStats(), getPlayerPhotoOverrides()]);

  const appearances = stats?.appearancesLeaders?.length ? stats.appearancesLeaders : placeholderAppearancesLeaders;
  const minutes = stats?.minutesLeaders?.length ? stats.minutesLeaders : placeholderMinutesLeaders;
  const topRated = stats?.topRatedLeaders?.length ? stats.topRatedLeaders : placeholderTopRatedLeaders;
  const goalkeeping = stats?.goalkeeping?.length ? stats.goalkeeping : placeholderGoalkeeping;

  return [
    { key: "apps", label: "APPEARANCES", rows: buildLeaderRows(appearances, photoOverrides) },
    { key: "mins", label: "MINUTES", rows: buildLeaderRows(minutes, photoOverrides) },
    {
      key: "keeping",
      label: "GOALKEEPING",
      rows: buildLeaderRows(
        goalkeeping.map((entry) => ({ name: entry.label, value: entry.value })),
        photoOverrides,
        nameFromGoalkeepingLabel
      ),
    },
    { key: "rating", label: "TOP RATED", rows: buildLeaderRows(topRated, photoOverrides) },
  ];
}
