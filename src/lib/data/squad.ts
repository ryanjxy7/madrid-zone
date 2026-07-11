import { placeholderSquad } from "@/data/placeholder/squad";
import type { SquadGroup } from "@/types/football";

/**
 * No live squad-list provider is wired yet — API-Football's /players
 * endpoint can populate this once a squad sync job exists. For now this
 * always returns curated placeholder data.
 */
export async function getSquad(): Promise<SquadGroup[]> {
  return placeholderSquad;
}
