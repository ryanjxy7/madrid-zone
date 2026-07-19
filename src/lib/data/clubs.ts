import { cache } from "react";
import { isSanityConfigured, logoImageUrl, sanityFetch } from "@/lib/cms/sanity";
import { clubsQuery } from "@/lib/cms/sanity/queries";
import type { SanityClub } from "@/lib/cms/sanity/types";
import { clubNamesMatch } from "@/lib/utils/clubNames";

export interface ClubBadgeInfo {
  name: string;
  shortCode: string;
  logoUrl?: string;
  color?: string;
}

/**
 * Club crests from Studio. Wrapped in React's cache() so every
 * <ClubBadge> on a page shares one Sanity fetch instead of one each —
 * this runs per request, not globally, so it stays consistent with
 * ISR/on-demand revalidation like every other data function here.
 */
export const getClubBadges = cache(async (): Promise<ClubBadgeInfo[]> => {
  if (!isSanityConfigured) return [];
  const clubs = await sanityFetch<SanityClub[]>(clubsQuery);
  if (!clubs || clubs.length === 0) return [];
  return clubs.map((club) => ({
    name: club.name,
    shortCode: club.shortCode,
    logoUrl: club.logo ? logoImageUrl(club.logo, 200) : undefined,
    color: club.color,
  }));
});

/**
 * Tolerant lookup by name — "Real Sociedad" and "Real Sociedad de Fútbol"
 * (or any other suffix/particle variant an editor or data source might
 * use) both resolve to the same Club document, via clubNamesMatch.
 */
export function findClubBadge(name: string, clubs: ClubBadgeInfo[]): ClubBadgeInfo | undefined {
  return clubs.find((club) => clubNamesMatch(club.name, name));
}
