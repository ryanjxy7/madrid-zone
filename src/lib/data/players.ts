import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { playerBiosQuery } from "@/lib/cms/sanity/queries";
import type { SanityPlayer } from "@/lib/cms/sanity/types";
import { getPlayerProfileBySlug as getLivePlayerProfileBySlug, slugifyPlayerName } from "@/lib/football/footballService";
import type { PlayerProfile } from "@/lib/football/footballService";
import { findPhotoOverride, getPlayerPhotoOverrides, getSquad } from "@/lib/data/squad";
import { playerNameAliases, type PlayerLink } from "@/lib/utils/linkifyPlayers";

/**
 * Editorial bio for a player page, matched to the live player profile by
 * slugified name (Sanity's player documents have no separate slug field —
 * the Squad schema wasn't built with player pages in mind, so this reuses
 * the same name).
 */
export async function getPlayerBio(slug: string): Promise<string | null> {
  if (!isSanityConfigured) return null;
  const players = await sanityFetch<Pick<SanityPlayer, "name" | "bio">[]>(playerBiosQuery);
  if (!players || players.length === 0) return null;
  const match = players.find((player) => slugifyPlayerName(player.name) === slug);
  return match?.bio ?? null;
}

/**
 * Every current squad player as {name, slug} pairs — the source list the
 * player-mention linkifier matches article text against. Each player
 * contributes both their full display name and a shorter alias (surname,
 * or first name for mononyms) since news prose rarely uses the squad
 * card's abbreviated "K. Mbappé" style.
 */
export async function getAllPlayerLinks(): Promise<PlayerLink[]> {
  const groups = await getSquad();
  return groups.flatMap((group) =>
    group.players.flatMap((player) => {
      const slug = slugifyPlayerName(player.name);
      return playerNameAliases(player.name).map((name) => ({ name, slug }));
    })
  );
}

/**
 * Resolves a player profile by slug, preferring live provider data (full
 * stats) but falling back to the squad roster (Sanity/placeholder) so the
 * page never 404s just because the live provider is temporarily
 * unreachable — the same resilience rule every other page in this app
 * follows.
 */
export async function getPlayerProfileBySlug(slug: string): Promise<PlayerProfile | null> {
  const [live, photoOverrides] = await Promise.all([getLivePlayerProfileBySlug(slug), getPlayerPhotoOverrides()]);
  if (live) {
    return { ...live, photo: findPhotoOverride(live.name, photoOverrides) ?? live.photo };
  }

  // getSquad() already merges in the same photo overrides, so no extra work needed on this branch.
  const groups = await getSquad();
  for (const group of groups) {
    for (const player of group.players) {
      if (slugifyPlayerName(player.name) === slug) {
        return {
          id: player.id,
          slug,
          name: player.name,
          position: player.position,
          number: player.number,
          nationality: player.nationality,
          photo: player.image,
        };
      }
    }
  }
  return null;
}
