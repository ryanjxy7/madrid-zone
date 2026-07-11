import { placeholderSponsors } from "@/data/placeholder/sponsors";
import { isSanityConfigured, logoImageUrl, sanityFetch, sponsorsQuery } from "@/lib/cms/sanity";
import type { SanitySponsor } from "@/lib/cms/sanity/types";
import type { Sponsor } from "@/types/content";

export async function getSponsors(): Promise<Sponsor[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanitySponsor[]>(sponsorsQuery);
    if (result && result.length > 0) {
      return result.map((sponsor) => ({
        name: sponsor.name,
        tag: sponsor.tag,
        logo: sponsor.logo ? logoImageUrl(sponsor.logo) : undefined,
        website: sponsor.website,
      }));
    }
  }
  return placeholderSponsors;
}
