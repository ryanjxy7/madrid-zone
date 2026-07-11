import { placeholderDeals, placeholderRumours } from "@/data/placeholder/transfers";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { transferDealsQuery, rumoursQuery } from "@/lib/cms/sanity/queries";
import type { SanityRumour, SanityTransferDeal } from "@/lib/cms/sanity/types";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Rumour, TransferDeal } from "@/types/football";

/**
 * Transfer-market data is editorial (verified by the newsroom, not an
 * API), so it comes from Sanity rather than API-Football.
 */
export async function getDeals(): Promise<TransferDeal[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityTransferDeal[]>(transferDealsQuery);
    if (result && result.length > 0) return result;
  }
  return placeholderDeals;
}

export async function getRumours(): Promise<Rumour[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityRumour[]>(rumoursQuery);
    if (result && result.length > 0) {
      return result.map((r) => ({ id: r.id, source: r.source, tier: r.tier, text: r.text, time: formatRelativeTime(r.publishedAt) }));
    }
  }
  return placeholderRumours;
}
