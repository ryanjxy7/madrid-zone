import { BellIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const wireItem = defineType({
  name: "wireItem",
  title: "Live Ticker",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "text",
      title: "Update",
      type: "string",
      description: "One short line for the scrolling live-news bar at the top of the site.",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "publishedAt",
      title: "Time",
      type: "datetime",
      description: "The time shown before your update. Defaults to now.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "text", subtitle: "publishedAt" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? new Date(subtitle).toLocaleString() : undefined };
    },
  },
});
