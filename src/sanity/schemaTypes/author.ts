import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { CirclePhotoInput } from "@/sanity/components/SmartImageInput";

export const author = defineType({
  name: "author",
  title: "Authors",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description: "Shown as a small circle next to their byline. The crop auto-frames the face on upload — see the preview below the image.",
      components: { input: CirclePhotoInput },
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "name", media: "avatar" },
  },
});
