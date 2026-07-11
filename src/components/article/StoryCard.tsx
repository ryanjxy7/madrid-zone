import Image from "next/image";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function StoryCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex items-center gap-3.5 rounded-lg border border-border border-t-[3px] border-t-brand bg-card p-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-negative/55 hover:shadow-card-hover sm:p-[13px_15px]"
    >
      <div className="relative h-[68px] w-24 flex-none overflow-hidden rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <Image src={article.image.url} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-body text-[15px] font-semibold leading-snug text-heading">{article.title}</h3>
        <div className="flex items-center gap-2">
          <span className="w-fit rounded-[3px] bg-negative/[0.16] px-2 py-[3px] font-display text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
            {article.category}
          </span>
          <span className="font-body text-[10.5px] font-semibold text-muted">{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
