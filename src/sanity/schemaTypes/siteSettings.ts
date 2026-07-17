import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  description: "Sitewide text and toggles — header stats, contact emails, social links and the newsletter box.",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact & social" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      name: "followerCount",
      title: "Follower count",
      type: "string",
      description: "Shown in the header \"FOLLOW\" button and the About page, e.g. \"2.1M\".",
      group: "general",
    }),
    defineField({
      name: "monthlyReach",
      title: "Monthly reach",
      type: "string",
      description: "Shown on the About page, e.g. \"40M+\".",
      group: "general",
    }),
    defineField({
      name: "tickerEnabled",
      title: "Show the live ticker bar",
      type: "boolean",
      initialValue: true,
      group: "general",
    }),
    defineField({
      name: "transferWindowClosesText",
      title: "Transfer window countdown text",
      type: "string",
      description: "Shown on the Transfer Centre page, e.g. \"53 days\".",
      group: "general",
    }),
    defineField({
      name: "managerName",
      title: "First-team manager",
      type: "string",
      description: "Shown on the Squad page.",
      group: "general",
    }),
    defineField({ name: "editorialEmail", title: "Editorial & tips email", type: "string", group: "contact" }),
    defineField({ name: "partnersEmail", title: "Partnerships email", type: "string", group: "contact" }),
    defineField({ name: "pressEmail", title: "Press & legal email", type: "string", group: "contact" }),
    defineField({
      name: "socialPlatforms",
      title: "Social platforms",
      description: "Shown on the Follow page and (name/URL only) in the footer. Add, remove or reorder freely.",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "X / Twitter", value: "x" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "name", title: "Display name", type: "string", description: "e.g. \"X / TWITTER\"" }),
            defineField({ name: "mark", title: "Mark / initials", type: "string", description: "Short glyph shown in the icon tile, e.g. \"IG\", \"YT\", \"f\"" }),
            defineField({ name: "color", title: "Icon tile background", type: "string", description: "Any CSS color or gradient, e.g. \"#1877f2\"" }),
            defineField({ name: "handle", title: "Handle", type: "string", description: "e.g. \"@themadridzone\"" }),
            defineField({ name: "followers", title: "Follower count", type: "string", description: "e.g. \"1.8M+\"" }),
            defineField({ name: "url", title: "Profile URL", type: "url" }),
          ],
          preview: {
            select: { title: "name", subtitle: "followers" },
          },
        },
      ],
    }),
    defineField({
      name: "newsletterHeading",
      title: "Newsletter box heading",
      type: "string",
      description: "e.g. \"THE MZ BRIEFING\"",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterBody",
      title: "Newsletter box copy",
      type: "text",
      rows: 2,
      group: "newsletter",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
