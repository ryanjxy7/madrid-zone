import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Pages",
  type: "document",
  icon: DocumentIcon,
  description: "Privacy Policy, Terms of Use and Cookie Policy. There should be exactly one document per page type.",
  fields: [
    defineField({
      name: "pageType",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy" },
          { title: "Terms of Use", value: "terms" },
          { title: "Cookie Policy", value: "cookies" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalSection",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "pageType" },
    prepare({ title }) {
      const labels: Record<string, string> = { privacy: "Privacy Policy", terms: "Terms of Use", cookies: "Cookie Policy" };
      return { title: labels[title] ?? title };
    },
  },
});
