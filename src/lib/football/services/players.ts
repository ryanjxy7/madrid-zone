import type { SquadGroup } from "@/types/football";
import { footballDataOrgProvider as activeProvider } from "../providers/footballDataOrg";
import { slugifyPlayerName } from "../slug";
import type { PlayerProfile, PlayerSeasonStats } from "../types/domain";

export async function getSquad(): Promise<SquadGroup[] | null> {
  return activeProvider.getSquad();
}

export async function getPlayerProfile(playerId: string): Promise<PlayerProfile | null> {
  return activeProvider.getPlayerProfile(playerId);
}

/** ESPN doesn't reliably expose aggregate season stats for soccer players — see docs/ESPN_GUIDE.md. Always null for now. */
export async function getPlayerSeasonStats(playerId: string): Promise<PlayerSeasonStats | null> {
  return activeProvider.getPlayerSeasonStats(playerId);
}

/**
 * Player pages are addressed by slug (e.g. /players/jude-bellingham), but
 * the provider is keyed by ID. Resolves a slug to a full profile by
 * searching the squad — the squad list is cached for 24h, so this is cheap.
 */
export async function getPlayerProfileBySlug(slug: string): Promise<PlayerProfile | null> {
  const groups = await getSquad();
  if (!groups) return null;

  for (const group of groups) {
    for (const player of group.players) {
      if (slugifyPlayerName(player.name) === slug) {
        return getPlayerProfile(player.id);
      }
    }
  }
  return null;
}
