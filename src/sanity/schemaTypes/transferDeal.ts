import { TransferIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { CirclePhotoInput } from "@/sanity/components/SmartImageInput";

export const transferDeal = defineType({
  name: "transferDeal",
  title: "Transfer Deals",
  type: "document",
  icon: TransferIcon,
  fields: [
    defineField({
      name: "player",
      title: "Player",
      type: "string",
      description: "Name or description, e.g. \"Midfield anchor\" while a deal is unconfirmed.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional — shown as a small circle next to the player's name. The crop auto-frames the face on upload — see the preview below the image. Leave blank for an unconfirmed/anonymous target; a neutral placeholder is used instead.",
      components: { input: CirclePhotoInput },
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description: "e.g. \"CM · 24\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "direction",
      title: "Direction",
      type: "string",
      options: {
        list: [
          { title: "Incoming", value: "IN" },
          { title: "Outgoing", value: "OUT" },
          { title: "Loan", value: "LOAN" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Rumour", value: "RUMOUR" },
          { title: "Talks", value: "TALKS" },
          { title: "Agreed", value: "AGREED" },
          { title: "Medical", value: "MEDICAL" },
          { title: "Advanced", value: "ADVANCED" },
          { title: "Confirmed", value: "CONFIRMED" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fee",
      title: "Fee",
      type: "string",
      description: "e.g. \"€80m + add-ons\", \"Free\", or \"—\" if unknown.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "counterpartClub",
      title: "Other club",
      type: "reference",
      to: [{ type: "club" }],
      description: "Pick the other side of the deal from Clubs — shows their real crest, same as everywhere else on the site. Leave blank for a free agent, loan-only move, or a club not worth adding (the badge text below is used instead).",
    }),
    defineField({
      name: "counterpartMark",
      title: "Other club's badge text (fallback)",
      type: "string",
      description: "Only shown when no club is picked above, e.g. \"PL\" (Premier League club), \"FA\" (free agent), \"CLB\" (unnamed club). Real Madrid's own badge always reads \"RMA\" automatically.",
      initialValue: "CLB",
    }),
    defineField({
      name: "latest",
      title: "Latest update",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first on the Transfer Centre table.",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "player", subtitle: "status" },
  },
});
