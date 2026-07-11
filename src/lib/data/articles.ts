import {
  placeholderAnalysisArticles,
  placeholderArticles,
  placeholderWire,
} from "@/data/placeholder/articles";
import {
  allAnalysisArticlesQuery,
  allAnalysisArticlesQueryParams,
  allArticlesQuery,
  allArticlesQueryParams,
  articleBySlugQuery,
  articleImageUrl,
  isSanityConfigured,
  relatedArticlesQuery,
  sanityFetch,
  wireItemsQuery,
} from "@/lib/cms/sanity";
import type { SanityArticle, SanityWireItem } from "@/lib/cms/sanity/types";
import { formatTime } from "@/lib/utils/format";
import type { Article, WireItem } from "@/types/content";

/**
 * Data-access layer for editorial content. Every page imports from here —
 * never from src/data/placeholder or src/lib/cms/sanity directly — so
 * switching to Sanity is invisible to components.
 */

function mapArticle(doc: SanityArticle): Article {
  return {
    slug: doc.slug,
    title: doc.title,
    dek: doc.dek,
    category: doc.category,
    tags: doc.tags ?? [],
    isExclusive: doc.isExclusive,
    image: {
      url: articleImageUrl(doc.mainImage),
      alt: doc.mainImage.alt ?? doc.title,
      width: 1600,
      height: 900,
    },
    author: doc.author,
    publishedAt: doc.publishedAt,
    readingTime: doc.readingTime ?? "",
    body: doc.body as Article["body"],
  };
}

function mapWireItem(doc: SanityWireItem): WireItem {
  return { time: formatTime(doc.publishedAt), text: doc.text };
}

export async function getAllArticles(): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityArticle[]>(allArticlesQuery, allArticlesQueryParams);
    if (result && result.length > 0) return result.map(mapArticle);
  }
  return placeholderArticles;
}

export async function getFeaturedArticle(): Promise<Article> {
  const articles = await getAllArticles();
  return articles[0];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityArticle>(articleBySlugQuery, { slug });
    if (result) return mapArticle(result);
  }
  const all = [...placeholderArticles, ...placeholderAnalysisArticles];
  return all.find((article) => article.slug === slug);
}

export async function getRelatedArticles(slug: string, count = 3): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityArticle[]>(relatedArticlesQuery, { slug });
    if (result && result.length > 0) return result.map(mapArticle);
  }
  return placeholderArticles.filter((article) => article.slug !== slug).slice(0, count);
}

export async function getAnalysisArticles(): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityArticle[]>(allAnalysisArticlesQuery, allAnalysisArticlesQueryParams);
    if (result && result.length > 0) return result.map(mapArticle);
  }
  return placeholderAnalysisArticles;
}

export async function getWireItems(): Promise<WireItem[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityWireItem[]>(wireItemsQuery);
    if (result && result.length > 0) return result.map(mapWireItem);
  }
  return placeholderWire;
}
