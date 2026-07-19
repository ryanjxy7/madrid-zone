import { cache } from "react";
import { isSanityConfigured, logoImageUrl, sanityFetch } from "@/lib/cms/sanity";
import { clubsQuery } from "@/lib/cms/sanity/queries";
import type { SanityClub } from "@/lib/cms/sanity/types";

export interface ClubBadgeInfo {
  shortCode: string;
  logoUrl?: string;
  color?: string;
}

/**
 * Club crests, keyed by lowercased name. Wrapped in React's cache() so
 * every <ClubBadge> on a page shares one Sanity fetch instead of one each
 * — this runs per request, not globally, so it stays consistent with
 * ISR/ on-demand revalidation like every other data function here.
 */
export const getClubBadges = cache(async (): Promise<Map<string, ClubBadgeInfo>> => {
  if (!isSanityConfigured) return new Map();
  const clubs = await sanityFetch<SanityClub[]>(clubsQuery);
  if (!clubs || clubs.length === 0) return new Map();
  return new Map(
    clubs.map((club) => [
      club.name.toLowerCase(),
      {
        shortCode: club.shortCode,
        logoUrl: club.logo ? logoImageUrl(club.logo, 200) : undefined,
        color: club.color,
      },
    ])
  );
});
