import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import type { Article } from "@/types/content";

function tagFontSize(tag: string): string {
  return tag.length > 8 ? "8px" : tag.length > 6 ? "8.5px" : "9.5px";
}

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-3">
      <h2 className="border-b border-border-strong pb-2 font-display text-[13px] font-bold tracking-[0.14em] text-muted">
        RELATED
      </h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4 transition-colors hover:border-negative/55"
          >
            <span className="font-body text-[13.5px] font-semibold leading-snug text-heading">{article.title}</span>
            <div className="flex items-center gap-2">
              <span
                className="w-fit flex-none whitespace-nowrap rounded-[3px] bg-brand/15 px-[7px] py-[2px] font-display font-bold uppercase tracking-[0.08em] text-accent"
                style={{ fontSize: tagFontSize(article.category) }}
              >
                {article.category}
              </span>
              <span className="font-display text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted">
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
