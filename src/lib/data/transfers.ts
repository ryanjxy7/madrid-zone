import { placeholderDeals, placeholderRumours } from "@/data/placeholder/transfers";
import type { Rumour, TransferDeal } from "@/types/football";

/**
 * Transfer-market data is editorial (verified by the newsroom, not an
 * API), so it's expected to eventually come from Sanity rather than
 * API-Football. Swap the placeholder import for a sanityFetch call here
 * once a `transferDeal` / `rumour` schema exists.
 */
export async function getDeals(): Promise<TransferDeal[]> {
  return placeholderDeals;
}

export async function getRumours(): Promise<Rumour[]> {
  return placeholderRumours;
}
