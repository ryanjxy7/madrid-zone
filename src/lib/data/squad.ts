import { placeholderSquad } from "@/data/placeholder/squad";
import { isSanityConfigured, portraitImageUrl, sanityFetch, squadQuery } from "@/lib/cms/sanity";
import type { SanityPlayer } from "@/lib/cms/sanity/types";
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

export async function getSquad(): Promise<SquadGroup[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityPlayer[]>(squadQuery);
    if (result && result.length > 0) return groupPlayers(result.map(mapPlayer));
  }
  return placeholderSquad;
}
