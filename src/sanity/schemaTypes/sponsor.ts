import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsors",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Sponsor name",
      type: "string",
      description: "Shown in capitals, e.g. \"VOLTA\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Category",
      type: "string",
      description: "Short category label shown under the name, e.g. \"ENERGY DRINK\".",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description: "Optional. Shown inside a wide rectangular tile — a horizontal logo with breathing room crops best. If left empty, the sponsor name is styled as a text logo instead.",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description: "Optional — makes the sponsor tile clickable.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "tag", media: "logo" },
  },
});
