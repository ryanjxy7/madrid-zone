import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function HeroCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block overflow-hidden rounded-lg border border-border border-t-[3px] border-t-brand bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/8] w-full">
        <Image
          src={article.image.url}
          alt={article.image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          {article.isExclusive ? <Tag>Exclusive</Tag> : null}
          <Tag variant="soft">{article.category}</Tag>
        </div>
        <h1 className="text-pretty font-display text-2xl font-bold leading-tight text-heading sm:text-[28px]">
          {article.title.toUpperCase()}
        </h1>
        <p className="font-body text-[13.5px] leading-relaxed text-subtle">{article.dek}</p>
        <span className="font-body text-[11px] font-medium text-muted">
          By {article.author.name} · {formatRelativeTime(article.publishedAt)} · {article.readingTime}
        </span>
      </div>
    </Link>
  );
}
