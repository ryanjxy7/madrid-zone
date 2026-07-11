export const siteConfig = {
  name: "Madrid Zone",
  shortName: "MZ",
  tagline: "Your hub for everything Real Madrid",
  description:
    "Independent Real Madrid news, transfers, match coverage, stats and analysis — verified before we publish.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://themadridzone.com",
  locale: "en_US",
  twitter: "@themadridzone",
  social: {
    x: "https://x.com/themadridzone",
    facebook: "https://facebook.com/themadridzone",
    instagram: "https://instagram.com/themadridzone",
    youtube: "https://youtube.com/@themadridzone",
    tiktok: "https://tiktok.com/@themadridzone",
  },
  emails: {
    editorial: "editorial@themadridzone.com",
    partners: "partners@themadridzone.com",
    press: "press@themadridzone.com",
  },
} as const;
