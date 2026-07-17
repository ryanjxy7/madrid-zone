import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { articleImageUrl } from "@/lib/cms/sanity";
import { linkifyPlayerNames, type PlayerLink } from "@/lib/utils/linkifyPlayers";

/**
 * Turns any plain-text child that names a squad player into a link to
 * that player's profile ("all news mentioning this player" lives there).
 * Only raw string children are processed — text already wrapped by another
 * mark (bold, an existing manual link, etc.) is left untouched, since by
 * the time it reaches here it's already a React element, not a string.
 */
function linkifyChildren(children: ReactNode, players: PlayerLink[]): ReactNode {
  if (players.length === 0) return children;

  const nodes = Array.isArray(children) ? children : [children];
  return nodes.map((child, childIndex) => {
    if (typeof child !== "string") return child;
    const segments = linkifyPlayerNames(child, players);
    return segments.map((segment, segmentIndex) =>
      segment.type === "player" ? (
        <Link
          key={`${childIndex}-${segmentIndex}`}
          href={`/players/${segment.slug}`}
          className="font-semibold text-negative underline decoration-negative/40 underline-offset-2 hover:decoration-negative"
        >
          {segment.text}
        </Link>
      ) : (
        <span key={`${childIndex}-${segmentIndex}`}>{segment.text}</span>
      )
    );
  });
}

function buildComponents(players: PlayerLink[]): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p>{linkifyChildren(children, players)}</p>,
      h2: ({ children }) => (
        <h2 className="font-display text-2xl font-bold text-heading">{linkifyChildren(children, players)}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-display text-xl font-bold text-heading">{linkifyChildren(children, players)}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-[3px] border-brand py-1 pl-4 font-display text-lg font-semibold leading-snug text-heading sm:pl-5 sm:text-[22px]">
          {linkifyChildren(children, players)}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-heading">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => (
        <a
          href={value?.href}
          className="text-accent underline underline-offset-2"
          target={value?.href?.startsWith("http") ? "_blank" : undefined}
          rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => (
        <span className="relative block aspect-video w-full overflow-hidden rounded-md">
          <Image src={articleImageUrl(value)} alt={value?.alt ?? ""} fill sizes="780px" className="object-cover" />
        </span>
      ),
    },
  };
}

export function ArticleBody({ blocks, players = [] }: { blocks: PortableTextBlock[]; players?: PlayerLink[] }) {
  return (
    <div className="flex flex-col gap-4 font-body text-base leading-[1.75] text-body sm:text-[16px]">
      <PortableText value={blocks} components={buildComponents(players)} />
    </div>
  );
}
