import type { PortableTextBlock } from "@portabletext/types";

/**
 * Editorial content types. Shapes mirror what a Sanity CMS schema would
 * return (see src/lib/cms/sanity/queries.ts), so swapping the placeholder
 * data source for a real Sanity dataset requires no changes here.
 */

export type ArticleCategory =
  | "News"
  | "Transfers"
  | "Finance"
  | "Academy"
  | "Club"
  | "Matches"
  | "Tactics"
  | "Data"
  | "Opinion";

export interface ArticleImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ArticleAuthor {
  name: string;
  slug: string;
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: ArticleCategory;
  tags: string[];
  isExclusive?: boolean;
  image: ArticleImage;
  author: ArticleAuthor;
  publishedAt: string;
  readingTime: string;
  /** Rich text written in the Studio's Word-like editor. */
  body: PortableTextBlock[];
}

export interface WireItem {
  time: string;
  text: string;
}

export interface Sponsor {
  name: string;
  tag: string;
  /** Optional uploaded logo; falls back to a styled text logo when absent. */
  logo?: string;
  website?: string;
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  slug: "privacy" | "terms" | "cookies";
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}
