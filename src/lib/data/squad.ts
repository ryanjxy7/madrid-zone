import { placeholderSquad } from "@/data/placeholder/squad";
import { isSanityConfigured, portraitImageUrl, sanityFetch, squadQuery } from "@/lib/cms/sanity";
import { playerPhotoOverridesQuery } from "@/lib/cms/sanity/queries";
import type { SanityPlayer } from "@/lib/cms/sanity/types";
import { getSquad as getLiveSquad, slugifyPlayerName } from "@/lib/football/footballService";
import type { Player, PlayerPosition, SquadGroup } from "@/types/football";

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
    image: portraitImageUrl(doc.image),
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
 * Editor-uploaded photos, keyed by slug. Merged over whatever the live
 * data provider (or placeholder) returns, everywhere a player appears —
 * squad cards, player profile pages, anywhere else that reads through
 * getSquad() or getPlayerProfileBySlug() (see src/lib/data/players.ts).
 * Upload a photo once against a player's name in Studio and it follows
 * that player everywhere, regardless of which data source supplied the
 * rest of their info.
 */
export async function getPlayerPhotoOverrides(): Promise<Map<string, string>> {
  if (!isSanityConfigured) return new Map();
  const players = await sanityFetch<Pick<SanityPlayer, "name" | "image">[]>(playerPhotoOverridesQuery);
  if (!players || players.length === 0) return new Map();
  return new Map(players.map((player) => [slugifyPlayerName(player.name), portraitImageUrl(player.image)]));
}

function applyPhotoOverrides(groups: SquadGroup[], overrides: Map<string, string>): SquadGroup[] {
  if (overrides.size === 0) return groups;
  return groups.map((group) => ({
    ...group,
    players: group.players.map((player) => {
      const override = overrides.get(slugifyPlayerName(player.name));
      return override ? { ...player, image: override } : player;
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
