import { placeholderSquad } from "@/data/placeholder/squad";
import { avatarSourceImageUrl, isSanityConfigured, portraitImageUrl, sanityFetch, squadQuery } from "@/lib/cms/sanity";
import { playerPhotoOverridesQuery } from "@/lib/cms/sanity/queries";
import type { SanityPlayer } from "@/lib/cms/sanity/types";
import { getSquad as getLiveSquad } from "@/lib/football/footballService";
import { playerNameSlugAliases } from "@/lib/football/slug";
import { normalizedPhotoUrl } from "@/lib/utils/images";
import type { Player, PlayerPosition, SquadGroup } from "@/types/football";

/**
 * A photo override, always normalised to a white backdrop. `circleUrl` is
 * a pre-cropped 3:4 portrait (safe for the small, roughly-square photo
 * circles used in scorer/assist/stat-leader rows and the player profile
 * page); `avatarUrl` is the same source with no forced crop at all, for
 * Squad cards, which do their own CSS crop driven by `focus` — see
 * PlayerCard.tsx. Baking a fixed crop AND letting CSS crop again (to a
 * differently-shaped container) is what caused photos to get cut off
 * there, so avatar consumers get exactly one crop, not two.
 */
export interface PhotoOverride {
  circleUrl: string;
  avatarUrl: string;
  focus?: { x: number; y: number };
}

const GROUP_ORDER: { position: PlayerPosition; label: string }[] = [
  { position: "Goalkeeper", label: "GOALKEEPERS" },
  { position: "Defender", label: "DEFENDERS" },
  { position: "Midfielder", label: "MIDFIELDERS" },
  { position: "Forward", label: "FORWARDS" },
];

function mapPlayer(doc: SanityPlayer): Player {
  return {
    id: doc.id,
    number: doc.number,
    name: doc.name,
    role: doc.role,
    position: doc.position,
    image: normalizedPhotoUrl(avatarSourceImageUrl(doc.image)),
    imageFocus: doc.image?.hotspot,
    nationality: doc.nationality,
  };
}

function groupPlayers(players: Player[]): SquadGroup[] {
  return GROUP_ORDER.map(({ position, label }) => ({
    label,
    players: players.filter((player) => player.position === position),
  })).filter((group) => group.players.length > 0);
}

/**
 * Editor-uploaded photos, keyed by every slug a player's typed name could
 * plausibly be matched against — see playerNameSlugAliases. Merged over
 * whatever the live data provider (or placeholder) returns, everywhere a
 * player appears — squad cards, player profile pages, scorer/assist
 * leaderboards, anywhere else that reads through getSquad(),
 * getPlayerProfileBySlug() or stats.ts. Upload a photo once against a
 * player's name in Studio — full ("Jude Bellingham") or abbreviated ("J.
 * Bellingham"), doesn't matter which — and it follows that player
 * everywhere, regardless of which data source or naming convention
 * supplied the rest of their info.
 */
export async function getPlayerPhotoOverrides(): Promise<Map<string, PhotoOverride>> {
  if (!isSanityConfigured) return new Map();
  const players = await sanityFetch<Pick<SanityPlayer, "name" | "image">[]>(playerPhotoOverridesQuery);
  if (!players || players.length === 0) return new Map();
  const overrides = new Map<string, PhotoOverride>();
  for (const player of players) {
    const entry: PhotoOverride = {
      circleUrl: normalizedPhotoUrl(portraitImageUrl(player.image)),
      avatarUrl: normalizedPhotoUrl(avatarSourceImageUrl(player.image)),
      focus: player.image?.hotspot,
    };
    for (const alias of playerNameSlugAliases(player.name)) {
      overrides.set(alias, entry);
    }
  }
  return overrides;
}

/** Looks up a photo override's pre-cropped circle URL by every slug `name` could plausibly be registered under — for scorer/assist/stat-leader rows and the player profile page. */
export function findPhotoOverride(name: string, overrides: Map<string, PhotoOverride>): string | undefined {
  for (const alias of playerNameSlugAliases(name)) {
    const match = overrides.get(alias);
    if (match) return match.circleUrl;
  }
  return undefined;
}

/** Same alias-aware lookup, but the uncropped avatar source + focal point for Squad cards' own CSS crop. */
export function findPhotoAvatarOverride(name: string, overrides: Map<string, PhotoOverride>): { url: string; focus?: { x: number; y: number } } | undefined {
  for (const alias of playerNameSlugAliases(name)) {
    const match = overrides.get(alias);
    if (match) return { url: match.avatarUrl, focus: match.focus };
  }
  return undefined;
}

function applyPhotoOverrides(groups: SquadGroup[], overrides: Map<string, PhotoOverride>): SquadGroup[] {
  if (overrides.size === 0) return groups;
  return groups.map((group) => ({
    ...group,
    players: group.players.map((player) => {
      const avatar = findPhotoAvatarOverride(player.name, overrides);
      if (!avatar) return player;
      return { ...player, image: avatar.url, imageFocus: avatar.focus ?? player.imageFocus };
    }),
  }));
}

/**
 * Prefers live data (auto-updated roster, numbers, photos), then an
 * editorially managed Sanity squad (lets you add specific role labels like
 * "Right-back" that an API can't give), then placeholder — but a
 * photo uploaded in Studio always wins regardless of which of those
 * supplied the rest of that player's info.
 */
export async function getSquad(): Promise<SquadGroup[]> {
  const [live, photoOverrides] = await Promise.all([getLiveSquad(), getPlayerPhotoOverrides()]);
  if (live && live.length > 0) return applyPhotoOverrides(live, photoOverrides);

  if (isSanityConfigured) {
    const result = await sanityFetch<SanityPlayer[]>(squadQuery);
    if (result && result.length > 0) return groupPlayers(result.map(mapPlayer));
  }
  return applyPhotoOverrides(placeholderSquad, photoOverrides);
}
