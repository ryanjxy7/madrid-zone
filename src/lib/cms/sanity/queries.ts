/**
 * GROQ queries matching the schema in src/sanity/schemaTypes. Image
 * fields are returned as raw Sanity image objects (not dereferenced to a
 * URL) so src/lib/cms/sanity/image.ts can build crop/hotspot-aware URLs
 * in the data-mapping layer — see src/lib/data/*.ts.
 */

const articleProjection = /* groq */ `{
  "slug": slug.current,
  title,
  dek,
  category,
  tags,
  isExclusive,
  mainImage,
  "author": author->{ name, "slug": slug.current },
  publishedAt,
  readingTime,
  body
}`;

const NEWS_CATEGORIES = ["News", "Transfers", "Finance", "Academy", "Club", "Matches"];
const ANALYSIS_CATEGORIES = ["Tactics", "Finance", "Data", "Academy", "Opinion"];

export const allArticlesQuery = /* groq */ `
  *[_type == "article" && category in $categories] | order(publishedAt desc) ${articleProjection}
`;
export const allArticlesQueryParams = { categories: NEWS_CATEGORIES };

export const allAnalysisArticlesQuery = /* groq */ `
  *[_type == "article" && category in $categories] | order(publishedAt desc) ${articleProjection}
`;
export const allAnalysisArticlesQueryParams = { categories: ANALYSIS_CATEGORIES };

export const articleBySlugQuery = /* groq */ `
  *[_type == "article" && slug.current == $slug][0] ${articleProjection}
`;

export const relatedArticlesQuery = /* groq */ `
  *[_type == "article" && slug.current != $slug] | order(publishedAt desc)[0...3] ${articleProjection}
`;

export const sponsorsQuery = /* groq */ `
  *[_type == "sponsor"] | order(order asc) { name, tag, logo, website }
`;

export const wireItemsQuery = /* groq */ `
  *[_type == "wireItem"] | order(publishedAt desc)[0...4] { text, publishedAt }
`;

export const squadQuery = /* groq */ `
  *[_type == "player"] | order(position asc, order asc) {
    "id": _id, name, number, role, position, "image": photo, nationality
  }
`;

export const playerBiosQuery = /* groq */ `
  *[_type == "player" && defined(bio)] { name, bio }
`;

/** Editor-uploaded photos, keyed by name — merged over whatever the live data provider returns, everywhere a player appears. */
export const playerPhotoOverridesQuery = /* groq */ `
  *[_type == "player" && defined(photo)] { name, "image": photo }
`;

export const transferDealsQuery = /* groq */ `
  *[_type == "transferDeal"] | order(order asc) {
    "id": _id, player, photo, position, direction, status, fee, latest, counterpartMark,
    "counterpartClub": counterpartClub->name
  }
`;

export const rumoursQuery = /* groq */ `
  *[_type == "rumour"] | order(publishedAt desc) {
    "id": _id, source, tier, text, publishedAt
  }
`;

export const nextMatchQuery = /* groq */ `
  *[_type == "nextMatch"][0] { opponent, competition, matchDate, kickOff, venue, isHome }
`;

export const fixturesQuery = /* groq */ `
  *[_type == "fixture"] | order(matchDate asc) { "id": _id, opponent, competition, matchDate }
`;

export const resultsQuery = /* groq */ `
  *[_type == "matchResult"] | order(playedAt desc) { "id": _id, match, competition, outcome }
`;

export const leagueTableQuery = /* groq */ `
  *[_type == "leagueTable"][0] { heading, rows }
`;

export const seasonStatsQuery = /* groq */ `
  *[_type == "seasonStats"][0] {
    statTiles, topScorers, topAssists, goalkeeping, homeStats,
    appearancesLeaders, minutesLeaders, topRatedLeaders
  }
`;

export const legalPageQuery = /* groq */ `
  *[_type == "legalPage" && pageType == $pageType][0] { pageType, updatedAt, sections }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    followerCount, monthlyReach, tickerEnabled, transferWindowClosesDate,
    transferTotalSpent, transferSpentNote, transferTotalSales, transferSalesNote,
    editorialEmail, partnersEmail, pressEmail,
    socialPlatforms[]{ key, name, mark, color, handle, followers, url },
    newsletterHeading, newsletterBody, managerName
  }
`;

export const adSlotQuery = /* groq */ `
  *[_type == "adSlot"][0] { enabled, mode, creative, linkUrl, advertiserName, adNetworkCode, width, height }
`;

/** Club crests — matched to fixtures/results/standings/transfers by name, see src/lib/data/clubs.ts. */
export const clubsQuery = /* groq */ `
  *[_type == "club"] { name, shortCode, logo, color }
`;
