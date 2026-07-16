import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

/**
 * Builds valid Portable Text blocks for placeholder content, matching
 * exactly what Sanity's rich-text editor produces — so placeholder
 * articles render through the same @portabletext/react pipeline as real
 * CMS content.
 */
let counter = 0;
function nextKey(): string {
  counter += 1;
  return `key-${counter}`;
}

export function paragraph(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}

export function quote(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: nextKey(),
    style: "blockquote",
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}

/** Flattens Portable Text blocks to plain text — used for search/matching (e.g. "which articles mention this player"), never for display. */
export function portableTextToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) =>
      (block.children ?? [])
        .filter((child): child is PortableTextSpan => child._type === "span")
        .map((span) => span.text)
        .join("")
    )
    .join("\n");
}
