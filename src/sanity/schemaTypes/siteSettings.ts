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
    defineField({ name: "editorialEmail", title: "Editorial & tips email", type: "string", group: "contact" }),
    defineField({ name: "partnersEmail", title: "Partnerships email", type: "string", group: "contact" }),
    defineField({ name: "pressEmail", title: "Press & legal email", type: "string", group: "contact" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "x", title: "X / Twitter", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
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
