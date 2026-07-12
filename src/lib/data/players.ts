import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { playerBiosQuery } from "@/lib/cms/sanity/queries";
import type { SanityPlayer } from "@/lib/cms/sanity/types";
import { slugifyPlayerName } from "@/lib/football/footballService";

/**
 * Editorial bio for a player page, matched to the live Sofascore profile by
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
