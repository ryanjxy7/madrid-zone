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

export interface ArticleBlock {
  type: "paragraph" | "quote";
  text: string;
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
  body: ArticleBlock[];
}

export interface WireItem {
  time: string;
  text: string;
}

export interface Sponsor {
  name: string;
  tag: string;
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
