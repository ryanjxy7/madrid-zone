import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const player = defineType({
  name: "player",
  title: "Squad",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "number",
      title: "Shirt number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. \"Left wing\", \"Central midfield\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position group",
      type: "string",
      description: "Controls which section of the Squad page the player appears in.",
      options: {
        list: [
          { title: "Goalkeeper", value: "Goalkeeper" },
          { title: "Defender", value: "Defender" },
          { title: "Midfielder", value: "Midfielder" },
          { title: "Forward", value: "Forward" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description: "Portrait photo — crop to frame the player's face and torso.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "nationality", title: "Nationality", type: "string" }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first within the position group.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", number: "number", role: "role", media: "photo" },
    prepare({ title, number, role, media }) {
      return { title, subtitle: `#${number} · ${role}`, media };
    },
  },
});
