import { placeholderLegalPages } from "@/data/placeholder/legal";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { legalPageQuery } from "@/lib/cms/sanity/queries";
import type { SanityLegalPage } from "@/lib/cms/sanity/types";
import type { LegalPage } from "@/types/content";

const TITLES: Record<LegalPage["slug"], string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Use",
  cookies: "Cookie Policy",
};

export async function getLegalPage(slug: LegalPage["slug"]): Promise<LegalPage | undefined> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityLegalPage>(legalPageQuery, { pageType: slug });
    if (result) {
      return { slug: result.pageType, title: TITLES[result.pageType], updatedAt: result.updatedAt, sections: result.sections };
    }
  }
  return placeholderLegalPages.find((page) => page.slug === slug);
}
