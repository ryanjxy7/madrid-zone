import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Story tips, corrections, partnerships and our RSS feed.",
  alternates: { canonical: "/contact" },
};

const cards = [
  {
    title: "EDITORIAL & TIPS",
    body: "Story tips and corrections. Sources always protected.",
    value: siteConfig.emails.editorial,
    href: `mailto:${siteConfig.emails.editorial}`,
  },
  {
    title: "PARTNERSHIPS",
    body: "Sponsorships, branded content and display advertising.",
    value: siteConfig.emails.partners,
    href: `mailto:${siteConfig.emails.partners}`,
  },
  {
    title: "PRESS & LEGAL",
    body: "Media enquiries, licensing and legal notices.",
    value: siteConfig.emails.press,
    href: `mailto:${siteConfig.emails.press}`,
  },
  {
    title: "RSS FEED",
    body: "Follow every story in your reader of choice.",
    value: "themadridzone.com/rss.xml",
    href: "/rss.xml",
    mono: true,
  },
];

export default function ContactPage() {
  return (
    <div className="flex max-w-[900px] flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">CONTACT</h1>
        <p className="font-body text-[13px] text-muted">Tips, corrections, partnerships and feeds.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-5">
            <h2 className="font-display text-[13px] font-bold tracking-[0.1em] text-accent">{card.title}</h2>
            <p className="font-body text-[13px] leading-relaxed text-subtle">{card.body}</p>
            <a
              href={card.href}
              className={`font-body text-[13px] font-semibold text-heading ${card.mono ? "font-mono" : ""}`}
            >
              {card.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
