import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const nextMatch = defineType({
  name: "nextMatch",
  title: "Next Match",
  type: "document",
  icon: PlayIcon,
  description: "The single upcoming fixture featured at the top of the Matches page.",
  fields: [
    defineField({ name: "opponent", title: "Opponent", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "competition",
      title: "Competition",
      type: "string",
      description: "e.g. \"Pre-season · US Summer Tour\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "matchDate", title: "Date", type: "date", validation: (Rule) => Rule.required() }),
    defineField({ name: "kickOff", title: "Kick-off time", type: "string", description: "e.g. \"02:30 CET\"" }),
    defineField({ name: "venue", title: "Venue", type: "string", description: "e.g. \"Soldier Field, Chicago\"" }),
    defineField({ name: "isHome", title: "Playing at home", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "opponent", subtitle: "competition" },
    prepare({ title, subtitle }) {
      return { title: `Next: ${title}`, subtitle };
    },
  },
});
