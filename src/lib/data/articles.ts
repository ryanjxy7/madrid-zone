import {
  placeholderAnalysisArticles,
  placeholderArticles,
  placeholderWire,
} from "@/data/placeholder/articles";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import {
  allAnalysisArticlesQuery,
  allArticlesQuery,
  articleBySlugQuery,
  relatedArticlesQuery,
  wireQuery,
} from "@/lib/cms/sanity/queries";
import type { Article, WireItem } from "@/types/content";

/**
 * Data-access layer for editorial content. Every page imports from here —
 * never from src/data/placeholder directly — so switching to Sanity is a
 * one-file change (see src/lib/cms/sanity).
 */

export async function getAllArticles(): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<Article[]>(allArticlesQuery);
    if (result) return result;
  }
  return placeholderArticles;
}

export async function getFeaturedArticle(): Promise<Article> {
  const articles = await getAllArticles();
  return articles[0];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (isSanityConfigured) {
    const result = await sanityFetch<Article>(articleBySlugQuery, { slug });
    if (result) return result;
  }
  const all = [...placeholderArticles, ...placeholderAnalysisArticles];
  return all.find((article) => article.slug === slug);
}

export async function getRelatedArticles(slug: string, count = 3): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<Article[]>(relatedArticlesQuery, { slug });
    if (result) return result;
  }
  return placeholderArticles.filter((article) => article.slug !== slug).slice(0, count);
}

export async function getAnalysisArticles(): Promise<Article[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<Article[]>(allAnalysisArticlesQuery);
    if (result) return result;
  }
  return placeholderAnalysisArticles;
}

export async function getWireItems(): Promise<WireItem[]> {
  if (isSanityConfigured) {
    const result = await sanityFetch<WireItem[]>(wireQuery);
    if (result) return result;
  }
  return placeholderWire;
}
