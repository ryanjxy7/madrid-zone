import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const adSlot = defineType({
  name: "adSlot",
  title: "Ad Slot",
  type: "document",
  icon: ImageIcon,
  description: "Controls the ad box on the homepage sidebar.",
  fields: [
    defineField({
      name: "enabled",
      title: "Show the ad slot",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "mode",
      title: "What to show",
      type: "string",
      options: {
        list: [
          { title: "Neutral placeholder box", value: "placeholder" },
          { title: "Your own ad image", value: "image" },
          { title: "Ad network code (e.g. Google AdSense)", value: "code" },
        ],
        layout: "radio",
      },
      initialValue: "placeholder",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "creative",
      title: "Ad image",
      type: "image",
      options: { hotspot: true },
      description: "Drag an image in — sized for the slot automatically.",
      hidden: ({ parent }) => parent?.mode !== "image",
    }),
    defineField({
      name: "linkUrl",
      title: "Link when clicked",
      type: "url",
      hidden: ({ parent }) => parent?.mode !== "image",
    }),
    defineField({
      name: "advertiserName",
      title: "Advertiser name",
      type: "string",
      description: "Used as the image's accessibility label.",
      hidden: ({ parent }) => parent?.mode !== "image",
    }),
    defineField({
      name: "adNetworkCode",
      title: "Ad network embed code",
      type: "text",
      rows: 6,
      description:
        "Paste the exact embed snippet your ad network (e.g. Google AdSense) gave you. It runs inside an isolated frame, sandboxed from the rest of the site — only paste code from a provider you trust.",
      hidden: ({ parent }) => parent?.mode !== "code",
    }),
    defineField({
      name: "width",
      title: "Width (px)",
      type: "number",
      initialValue: 300,
    }),
    defineField({
      name: "height",
      title: "Height (px)",
      type: "number",
      initialValue: 250,
    }),
  ],
  preview: {
    select: { mode: "mode", enabled: "enabled" },
    prepare({ mode, enabled }) {
      return { title: "Ad Slot", subtitle: enabled ? `On · ${mode}` : "Off" };
    },
  },
});
