import type { ArticleBlock } from "@/types/content";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-4 font-body text-base leading-[1.75] text-body sm:text-[16px]">
      {blocks.map((block, index) =>
        block.type === "quote" ? (
          <blockquote
            key={index}
            className="border-l-[3px] border-brand py-1 pl-4 font-display text-lg font-semibold leading-snug text-heading sm:pl-5 sm:text-[22px]"
          >
            {block.text}
          </blockquote>
        ) : (
          <p key={index}>{block.text}</p>
        )
      )}
    </div>
  );
}
