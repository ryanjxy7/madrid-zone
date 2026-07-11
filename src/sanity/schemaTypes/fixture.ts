import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const fixture = defineType({
  name: "fixture",
  title: "Upcoming Fixtures",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "opponent",
      title: "Fixture",
      type: "string",
      description: "e.g. \"vs Opponent A\" or \"Real Madrid vs Opponent A\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "competition", title: "Competition", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "matchDate", title: "Date", type: "date", validation: (Rule) => Rule.required() }),
  ],
  orderings: [
    { title: "Date, soonest first", name: "matchDateAsc", by: [{ field: "matchDate", direction: "asc" }] },
  ],
  preview: {
    select: { title: "opponent", subtitle: "competition" },
  },
});
