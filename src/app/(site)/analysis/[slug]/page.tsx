import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getAnalysisArticles, getArticleBySlug, getRelatedArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/seo/constants";
import { articleJsonLd } from "@/lib/seo/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAnalysisArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${siteConfig.url}/analysis/${article.slug}`;
  return {
    title: article.title,
    description: article.dek || article.title,
    alternates: { canonical: `/analysis/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek || article.title,
      url,
      publishedTime: article.publishedAt,
      tags: article.tags,
      images: [{ url: article.image.url, width: article.image.width, height: article.image.height, alt: article.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek || article.title,
      images: [article.image.url],
    },
  };
}

export default async function AnalysisArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const jsonLd = articleJsonLd(article, `/analysis/${slug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleView article={article} related={related} backHref="/analysis" backLabel="Back to analysis" />
    </>
  );
}
