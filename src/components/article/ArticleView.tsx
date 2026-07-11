import Image from "next/image";
import Link from "next/link";
import { ArticleBody } from "@/components/article/ArticleBody";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Tag } from "@/components/ui/Tag";
import { formatDateTime } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function ArticleView({
  article,
  related,
  backHref,
  backLabel,
}: {
  article: Article;
  related: Article[];
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <article className="flex w-full max-w-[780px] flex-col gap-4">
        <Link href={backHref} className="font-body text-xs font-semibold text-muted">
          ← {backLabel}
        </Link>

        <div className="flex items-center gap-2">
          {article.isExclusive ? <Tag>Exclusive</Tag> : null}
          <span className="font-body text-[11px] font-semibold text-muted">{article.category.toUpperCase()}</span>
        </div>

        <h1 className="text-pretty font-display text-[32px] font-bold leading-[1.08] text-heading sm:text-[42px]">
          {article.title.toUpperCase()}
        </h1>

        <div className="border-b border-border-strong pb-4 font-body text-xs font-medium text-muted">
          {formatDateTime(article.publishedAt)} · {article.readingTime}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 780px, 100vw"
            className="object-cover"
          />
        </div>

        <ArticleBody blocks={article.body} />

        <div className="flex flex-wrap gap-2 border-t border-border-strong pt-4">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border bg-card px-3 py-1.5 font-body text-[11px] font-semibold text-subtle">
              {tag}
            </span>
          ))}
        </div>

        <RelatedArticles articles={related} />
      </article>
    </div>
  );
}
