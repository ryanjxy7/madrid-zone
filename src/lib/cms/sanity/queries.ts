/**
 * GROQ queries written against the content model documented in
 * src/lib/cms/sanity/schema-reference.md. Field names intentionally match
 * src/types/content.ts so a Sanity response can be used as-is once the
 * dataset exists.
 */

const articleProjection = /* groq */ `{
  "slug": slug.current,
  title,
  dek,
  category,
  tags,
  isExclusive,
  "image": {
    "url": mainImage.asset->url,
    "alt": coalesce(mainImage.alt, title),
    "width": mainImage.asset->metadata.dimensions.width,
    "height": mainImage.asset->metadata.dimensions.height
  },
  "author": author->{ name, "slug": slug.current },
  publishedAt,
  readingTime,
  body[]{ type, text }
}`;

export const allArticlesQuery = /* groq */ `
  *[_type == "article" && !(category in ["Tactics","Finance","Data","Academy","Opinion"])]
  | order(publishedAt desc) ${articleProjection}
`;

export const allAnalysisArticlesQuery = /* groq */ `
  *[_type == "article" && category in ["Tactics","Finance","Data","Academy","Opinion"]]
  | order(publishedAt desc) ${articleProjection}
`;

export const articleBySlugQuery = /* groq */ `
  *[_type == "article" && slug.current == $slug][0] ${articleProjection}
`;

export const relatedArticlesQuery = /* groq */ `
  *[_type == "article" && slug.current != $slug] | order(publishedAt desc)[0...3] ${articleProjection}
`;

export const sponsorsQuery = /* groq */ `
  *[_type == "sponsor"] | order(order asc) { name, tag }
`;

export const wireQuery = /* groq */ `
  *[_type == "wireItem"] | order(_createdAt desc)[0...4] { time, text }
`;
