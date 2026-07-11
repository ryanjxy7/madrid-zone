import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/data/articles";
import { siteConfig } from "@/lib/seo/constants";
import { articleJsonLd } from "@/lib/seo/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${siteConfig.url}/news/${article.slug}`;
  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      url,
      publishedTime: article.publishedAt,
      tags: article.tags,
      images: [{ url: article.image.url, width: article.image.width, height: article.image.height, alt: article.image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: [article.image.url],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const jsonLd = articleJsonLd(article, `/news/${slug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleView article={article} related={related} backHref="/" backLabel="Back to news" />
    </>
  );
}
