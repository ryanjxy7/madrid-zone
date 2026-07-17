import type { MetadataRoute } from "next";
import { getAllArticles, getAnalysisArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/seo/constants";

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "hourly" },
  { path: "/transfers", priority: 0.9, changeFrequency: "hourly" },
  { path: "/matches", priority: 0.9, changeFrequency: "hourly" },
  { path: "/stats", priority: 0.8, changeFrequency: "daily" },
  { path: "/analysis", priority: 0.8, changeFrequency: "daily" },
  { path: "/squad", priority: 0.7, changeFrequency: "weekly" },
  { path: "/follow", priority: 0.4, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, analysisArticles] = await Promise.all([getAllArticles(), getAnalysisArticles()]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/news/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const analysisEntries: MetadataRoute.Sitemap = analysisArticles.map((article) => ({
    url: `${siteConfig.url}/analysis/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries, ...analysisEntries];
}
