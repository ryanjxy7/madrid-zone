import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const rumour = defineType({
  name: "rumour",
  title: "Rumour Mill",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "e.g. \"MZ SOURCES\", \"SPANISH PRESS\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tier",
      title: "Reliability tier",
      type: "string",
      options: {
        list: [
          { title: "Tier 1 — highest confidence", value: "TIER 1" },
          { title: "Tier 2", value: "TIER 2" },
          { title: "Tier 3 — early / unconfirmed", value: "TIER 3" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "text", title: "Rumour", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({
      name: "publishedAt",
      title: "Time",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "text", subtitle: "source" },
  },
});
