import { ClockIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const matchResult = defineType({
  name: "matchResult",
  title: "Recent Results",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "match",
      title: "Result",
      type: "string",
      description: "e.g. \"Real Madrid 3–1 Opponent\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "competition", title: "Competition", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      options: {
        list: [
          { title: "Win", value: "W" },
          { title: "Draw", value: "D" },
          { title: "Loss", value: "L" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "playedAt",
      title: "Date played",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: "Most recent first", name: "playedAtDesc", by: [{ field: "playedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "match", subtitle: "competition" },
  },
});
