import Link from "next/link";
import { siteConfig } from "@/lib/seo/constants";

const sectionLinks = [
  { label: "News", href: "/" },
  { label: "Transfers", href: "/transfers" },
  { label: "Matches", href: "/matches" },
  { label: "Stats", href: "/stats" },
  { label: "Analysis", href: "/analysis" },
];

const clubLinks = [
  { label: "Squad", href: "/squad" },
  { label: "About us", href: "/about" },
  { label: "Sponsors", href: "/about#sponsors" },
  { label: "Partner with us", href: "/about#partner" },
  { label: "Contact", href: "/contact" },
];

const followLinks = [
  { label: "X / Twitter", href: siteConfig.social.x },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "TikTok", href: siteConfig.social.tiktok },
  { label: "RSS Feed", href: "/rss.xml", accent: true },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-ink-900 px-4 py-7 text-white sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-8 text-center">
        <FooterColumn title="SECTIONS" links={sectionLinks} />
        <FooterColumn title="CLUB" links={clubLinks} />
        <FooterColumn title="FOLLOW" links={followLinks} />
      </div>

      <div className="mt-7 flex flex-col items-center gap-1.5 border-t border-white/[0.07] pt-5">
        <span className="font-display text-[28px] font-bold leading-none tracking-[0.02em] text-white">MZ</span>
        <span className="font-display text-[17px] font-bold tracking-[0.08em]">MADRID ZONE</span>
        <p className="max-w-md text-center font-body text-xs leading-relaxed text-[#8b90a0]">
          Independent Real Madrid coverage. Not affiliated with Real Madrid C.F.
        </p>
      </div>

      <div className="mt-3 flex flex-col items-center gap-2 text-center font-body text-[11px] text-[#6b6f7e]">
        <p>© {new Date().getFullYear()} Madrid Zone. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/cookies">Cookie Policy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; accent?: boolean }[];
}) {
  return (
    <div className="flex flex-col items-center gap-2 font-body text-[12.5px] font-medium text-[#a9adbd]">
      <span className="font-display text-[11px] font-bold tracking-[0.14em] text-[#8b90a0]">{title}</span>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={link.accent ? "text-accent" : "hover:text-white"}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
