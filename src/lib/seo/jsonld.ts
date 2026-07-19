import { siteConfig } from "@/lib/seo/constants";
import type { Article } from "@/types/content";

export function articleJsonLd(article: Article, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek || article.title,
    image: [article.image.url],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [{ "@type": "Organization", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}${path}` },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.social),
  };
}
