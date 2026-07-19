import { getAllArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/seo/constants";
import { escapeXml } from "@/lib/utils/xml";

export async function GET() {
  const articles = await getAllArticles();

  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.url}/news/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/news/${article.slug}</guid>
      <description>${escapeXml(article.dek || article.title)}</description>
      <category>${escapeXml(article.category)}</category>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
