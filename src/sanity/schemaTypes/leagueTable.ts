import { ThListIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const leagueTable = defineType({
  name: "leagueTable",
  title: "League Table",
  type: "document",
  icon: ThListIcon,
  description: "The standings table shown on the Matches page.",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "e.g. \"LaLiga 2025–26 · Final\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      description: "Add one row per team, in order from 1st place down.",
      of: [
        defineArrayMember({
          type: "object",
          name: "standingRow",
          fields: [
            defineField({ name: "position", title: "Position", type: "number", validation: (Rule) => Rule.required().min(1) }),
            defineField({ name: "team", title: "Team", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "points", title: "Points", type: "number", validation: (Rule) => Rule.required().min(0) }),
            defineField({
              name: "isHighlighted",
              title: "Highlight this row",
              type: "boolean",
              description: "Use for Real Madrid's row.",
              initialValue: false,
            }),
          ],
          preview: {
            select: { position: "position", team: "team", points: "points" },
            prepare({ position, team, points }) {
              return { title: `${position}. ${team}`, subtitle: `${points} pts` };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title ?? "League Table" };
    },
  },
});
