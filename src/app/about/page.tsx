import type { Metadata } from "next";
import { getSponsors } from "@/lib/data/sponsors";
import { siteConfig } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "About",
  description: "About Madrid Zone — an independent Real Madrid news outlet trusted by over 2.1 million followers.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "2.1M", label: "Followers" },
  { value: "40M+", label: "Monthly reach" },
  { value: "24/7", label: "Coverage" },
];

export default async function AboutPage() {
  const sponsors = await getSponsors();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">
            ABOUT MADRID ZONE
          </h1>
          <p className="font-body text-[15px] leading-relaxed text-body">
            Madrid Zone is an independent Real Madrid news outlet trusted by over{" "}
            <b className="text-heading">2.1 million followers</b> across social media. We cover transfers, matches
            and club news with one rule: verified before published.
          </p>
          <p className="font-body text-[15px] leading-relaxed text-body">
            Founded by fans, run like a newsroom — our team works sources in Madrid daily to bring you the story
            before it breaks, and the context after it does.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 rounded-md border border-border bg-card px-5 py-3.5">
                <span className="font-display text-2xl font-bold text-accent">{stat.value}</span>
                <span className="font-body text-[11px] font-medium text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="partner" className="flex flex-col gap-3 rounded-md border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-[15px] font-bold tracking-[0.1em] text-heading">WORK WITH US</h2>
          <p className="font-body text-[13px] leading-relaxed text-subtle">
            Reach one of football&apos;s most engaged audiences. Sponsorships, branded content and display
            placements available.
          </p>
          <a
            href={`mailto:${siteConfig.emails.partners}`}
            className="rounded-[4px] bg-brand py-2.5 text-center font-body text-[13px] font-bold text-white hover:opacity-90"
          >
            PARTNER WITH US
          </a>
          <p className="text-center font-body text-xs text-muted">{siteConfig.emails.partners}</p>
        </div>
      </div>

      <div id="sponsors" className="flex flex-col gap-3.5">
        <h2 className="border-b border-border-strong pb-2 font-display text-[13px] font-bold tracking-[0.14em] text-muted">
          OUR SPONSORS
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex h-[110px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card shadow-card"
            >
              <span className="font-display text-2xl font-bold tracking-[0.2em] text-heading">{sponsor.name}</span>
              <span className="font-body text-[9.5px] font-semibold tracking-[0.34em] text-muted">{sponsor.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
