import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const club = defineType({
  name: "club",
  title: "Clubs",
  type: "document",
  icon: EarthGlobeIcon,
  description:
    "Upload a crest once per club and it's used everywhere that club is mentioned — fixtures, results, standings, the transfer table. Add all 20 La Liga clubs (plus any Champions League opponents) here for full coverage.",
  fields: [
    defineField({
      name: "name",
      title: "Club name",
      type: "string",
      description: "Should closely match how the name appears elsewhere on the site (e.g. \"Barcelona\", \"Atlético Madrid\") — minor variants like \"Real Sociedad\" vs \"Real Sociedad de Fútbol\" are still recognised as the same club, but keep it recognisably close.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortCode",
      title: "Short code",
      type: "string",
      description: "3-4 letter fallback shown in the badge until a logo is uploaded, e.g. \"BAR\".",
      validation: (Rule) => Rule.required().max(4),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      description: "Shown as a circular badge everywhere this club is mentioned. A square, transparent-background crest crops best — the hotspot tool lets you center it precisely.",
    }),
    defineField({
      name: "color",
      title: "Badge color (fallback)",
      type: "string",
      description: "Hex color for the badge background before a logo is uploaded, e.g. \"#a50044\". Ignored once a logo is set.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "shortCode", media: "logo" },
  },
});
