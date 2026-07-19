import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { HeroPhotoInput } from "@/sanity/components/SmartImageInput";
import { apiVersion } from "@/sanity/env";

/** The byline every new article defaults to — see the author field's initialValue below. Create one Author document with exactly this name and every article picks it up automatically from then on. */
const DEFAULT_AUTHOR_NAME = "Editorial Team";

const CATEGORIES = [
  "News",
  "Transfers",
  "Finance",
  "Academy",
  "Club",
  "Matches",
  "Tactics",
  "Data",
  "Opinion",
] as const;

export const article = defineType({
  name: "article",
  title: "Articles",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      description: "The big headline shown on the story. Keep it punchy — it appears in all caps on cards.",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "Click \"Generate\" — this becomes the article's web address. Only edit it manually if you need to.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Summary",
      type: "text",
      rows: 2,
      description: "Optional — one or two sentences shown under the headline in story lists. Leave blank to show none.",
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: [...CATEGORIES], layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Shown as pills at the bottom of the article. Press enter after each one.",
    }),
    defineField({
      name: "isExclusive",
      title: "Mark as Exclusive",
      type: "boolean",
      description: "Shows a red \"EXCLUSIVE\" badge on the story.",
      initialValue: false,
    }),
    defineField({
      name: "mainImage",
      title: "Cover photo",
      type: "image",
      options: { hotspot: true },
      description: "Drag a photo here — the crop auto-frames the subject as soon as it uploads, and resizes automatically for every screen size. Drag the hotspot yourself afterward if you want to nudge it.",
      components: { input: HeroPhotoInput },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "A short description for screen readers and search engines, e.g. \"Bernabéu stadium under floodlights\".",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      description: `Defaults to "${DEFAULT_AUTHOR_NAME}" — change it only when a specific writer should be credited instead. (Create one Author document named exactly "${DEFAULT_AUTHOR_NAME}" once; every new article picks it automatically from then on.)`,
      initialValue: async (_params, context) => {
        const client = context.getClient({ apiVersion });
        const id = await client.fetch<string | null>(`*[_type == "author" && name == $name][0]._id`, { name: DEFAULT_AUTHOR_NAME });
        // No "Editorial Team" author created yet — nothing to default to. Sanity
        // treats an undefined resolved value as "no initial value" at runtime,
        // even though the resolver's declared return type doesn't spell out that case.
        return (id ? { _ref: id } : undefined) as { _ref: string };
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time",
      type: "string",
      description: "e.g. \"6 min read\". Shown next to the publish date.",
      initialValue: "4 min read",
    }),
    defineField({
      name: "body",
      title: "Story",
      type: "array",
      description: "Write like you would in Word — select text to make it bold, add headings, quotes and links from the toolbar.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Image",
          options: { hotspot: true },
          components: { input: HeroPhotoInput },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
  },
});
