import { BarChartIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const seasonStats = defineType({
  name: "seasonStats",
  title: "Season Stats",
  type: "document",
  icon: BarChartIcon,
  description: "All the numbers shown on the Stats page and the homepage sidebar. Edit this one document to update them.",
  fields: [
    defineField({
      name: "statTiles",
      title: "Headline stat tiles",
      type: "array",
      description: "The four big numbers at the top of the Stats page (matches played, goals scored, etc).",
      of: [
        defineArrayMember({
          type: "object",
          name: "statTile",
          fields: [
            defineField({ name: "value", title: "Number", type: "string", description: "e.g. \"58\" or \"68%\"", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. \"Matches played\"", validation: (Rule) => Rule.required() }),
            defineField({ name: "sub", title: "Detail", type: "string", description: "e.g. \"All competitions\"" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "topScorers",
      title: "Top scorers",
      type: "array",
      description: "Ranked automatically by goals, highest first — just add players and their goal tally.",
      of: [
        defineArrayMember({
          type: "object",
          name: "scorerEntry",
          fields: [
            defineField({ name: "name", title: "Player", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "goals", title: "Goals", type: "number", validation: (Rule) => Rule.required().min(0) }),
          ],
          preview: { select: { title: "name", subtitle: "goals" } },
        }),
      ],
    }),
    defineField({
      name: "topAssists",
      title: "Most assists",
      type: "array",
      description: "Ranked automatically by assists, highest first.",
      of: [
        defineArrayMember({
          type: "object",
          name: "assistEntry",
          fields: [
            defineField({ name: "name", title: "Player", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "assists", title: "Assists", type: "number", validation: (Rule) => Rule.required().min(0) }),
          ],
          preview: { select: { title: "name", subtitle: "assists" } },
        }),
      ],
    }),
    defineField({
      name: "goalkeeping",
      title: "Goalkeeping stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "goalkeepingEntry",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. \"Clean sheets — T. Courtois\"", validation: (Rule) => Rule.required() }),
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. \"19\" or \"78%\"", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "homeStats",
      title: "Homepage \"Player Stats\" widget",
      type: "array",
      description: "The four rows shown in the Player Stats card on the homepage.",
      of: [
        defineArrayMember({
          type: "object",
          name: "homeStatEntry",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. \"Most assists\"", validation: (Rule) => Rule.required() }),
            defineField({ name: "player", title: "Player", type: "string", description: "e.g. \"Vinícius Jr\"", validation: (Rule) => Rule.required() }),
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. \"15\" or \"7.9\"", validation: (Rule) => Rule.required() }),
            defineField({
              name: "barPercent",
              title: "Bar fill %",
              type: "number",
              description: "How full the progress bar looks, 0–100 — purely visual, relative to the other rows.",
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
          ],
          preview: { select: { title: "label", subtitle: "player" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Season Stats" };
    },
  },
});
