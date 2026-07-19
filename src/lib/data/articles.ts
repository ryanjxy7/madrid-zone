import {
  placeholderAnalysisArticles,
  placeholderArticles,
  placeholderSchedule,
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
import { getUpcomingFixtures } from "@/lib/football/footballService";
import { formatTime } from "@/lib/utils/format";
import { playerNameAliases, textMentionsName } from "@/lib/utils/linkifyPlayers";
import { portableTextToPlainText } from "@/lib/utils/portableText";
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
    dek: doc.dek ?? "",
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

/**
 * Matchday timeline for the scrolling header ticker. Backed by real
 * upcoming-fixture data (the same ESPN-sourced list the Matches page
 * uses) rather than editorial content — there's no public schedule API
 * that also exposes hour-by-hour internal detail like training sessions
 * or press conferences, so this surfaces the schedule info that is
 * actually available: real kickoff times and opponents.
 */
export async function getSchedule(): Promise<WireItem[]> {
  const fixtures = await getUpcomingFixtures(6);
  if (fixtures && fixtures.length > 0) {
    return fixtures.map((fixture) => ({
      time: fixture.kickOff ? `${fixture.date} · ${fixture.kickOff}` : fixture.date,
      text: `${fixture.opponent} — ${fixture.competition}`,
    }));
  }
  return placeholderSchedule;
}

/**
 * Every article (news + analysis) that mentions a player by name — title,
 * dek, or body copy — powers both the player-profile "News" section and
 * (indirectly) the player-mention hyperlinks in article bodies. Matches
 * against every alias for the name (full display name plus surname/first
 * name — see playerNameAliases) so "Bellingham" in prose is found even
 * though the squad card says "J. Bellingham".
 */
export async function getArticlesMentioningPlayer(playerName: string): Promise<Article[]> {
  const [news, analysis] = await Promise.all([getAllArticles(), getAnalysisArticles()]);
  const seen = new Set<string>();
  const all = [...news, ...analysis].filter((article) => {
    if (seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });

  const aliases = playerNameAliases(playerName);
  return all.filter((article) => {
    const bodyText = portableTextToPlainText(article.body);
    return aliases.some(
      (alias) => textMentionsName(article.title, alias) || textMentionsName(article.dek, alias) || textMentionsName(bodyText, alias)
    );
  });
}
