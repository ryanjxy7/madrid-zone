import Image from "next/image";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function AnalysisCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/analysis/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border border-t-[3px] border-t-brand bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-video w-full">
        <Image src={article.image.url} alt={article.image.alt} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-[3px] bg-negative/[0.14] px-2.5 py-[3px] font-display text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
          {article.category}
        </span>
        <h3 className="font-body text-base font-semibold leading-snug text-heading">{article.title}</h3>
        <p className="font-body text-[12.5px] leading-relaxed text-subtle">{article.dek}</p>
        <span className="font-body text-[10.5px] text-muted">
          {formatRelativeTime(article.publishedAt)} · {article.readingTime}
        </span>
      </div>
    </Link>
  );
}
