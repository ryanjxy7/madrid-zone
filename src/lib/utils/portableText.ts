import type { PortableTextBlock } from "@portabletext/types";

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
