import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { articleImageUrl } from "@/lib/cms/sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="font-display text-2xl font-bold text-heading">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl font-bold text-heading">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-brand py-1 pl-4 font-display text-lg font-semibold leading-snug text-heading sm:pl-5 sm:text-[22px]">
        {children}
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

export function ArticleBody({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    <div className="flex flex-col gap-4 font-body text-base leading-[1.75] text-body sm:text-[16px]">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
