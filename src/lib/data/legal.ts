import { placeholderLegalPages } from "@/data/placeholder/legal";
import type { LegalPage } from "@/types/content";

export async function getLegalPage(slug: LegalPage["slug"]): Promise<LegalPage | undefined> {
  return placeholderLegalPages.find((page) => page.slug === slug);
}
