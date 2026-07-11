import { placeholderSponsors } from "@/data/placeholder/sponsors";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { sponsorsQuery } from "@/lib/cms/sanity/queries";
import type { Sponsor } from "@/types/content";

export async function getSponsors(): Promise<Sponsor[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<Sponsor[]>(sponsorsQuery);
    if (result) return result;
  }
  return placeholderSponsors;
}
