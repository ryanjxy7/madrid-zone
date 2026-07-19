import { placeholderDeals, placeholderRumours } from "@/data/placeholder/transfers";
import { avatarSourceImageUrl, isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { transferDealsQuery, rumoursQuery } from "@/lib/cms/sanity/queries";
import type { SanityRumour, SanityTransferDeal } from "@/lib/cms/sanity/types";
import { formatRelativeTime } from "@/lib/utils/format";
import { normalizedPhotoUrl, placeholderImage } from "@/lib/utils/images";
import type { Rumour, TransferDeal } from "@/types/football";

/**
 * Transfer-market data is editorial (verified by the newsroom, not an
 * API), so it comes from Sanity rather than API-Football. A deal's photo
 * is optional in Studio (many targets are unconfirmed/anonymous) — falls
 * back to a deterministic placeholder so the layout never has a gap. The
 * photo is left uncropped (avatarSourceImageUrl) with its focal point
 * carried alongside it (photoFocus) so DealsTable's circle crops around
 * the actual face via CSS instead of a plain center crop baked in
 * server-side, which tended to clip the top of the head.
 */
export async function getDeals(): Promise<TransferDeal[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityTransferDeal[]>(transferDealsQuery);
    if (result && result.length > 0) {
      return result.map((deal) => ({
        ...deal,
        photo: deal.photo ? normalizedPhotoUrl(avatarSourceImageUrl(deal.photo)) : placeholderImage(deal.id, 100, 100),
        photoFocus: deal.photo?.hotspot,
      }));
    }
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
