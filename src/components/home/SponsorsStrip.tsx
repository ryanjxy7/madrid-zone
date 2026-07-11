import Link from "next/link";
import { getSponsors } from "@/lib/data/sponsors";

export async function SponsorsStrip() {
  const sponsors = await getSponsors();

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-7 pt-5 sm:px-6 lg:px-8" id="sponsors">
      <div className="flex items-baseline gap-3.5 border-b border-border-strong pb-2">
        <h2 className="font-display text-[13px] font-bold tracking-[0.14em] text-muted">OUR SPONSORS</h2>
        <Link href="/about#partner" className="font-body text-[11px] font-semibold text-accent">
          Partner with us →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.name}
            className="flex h-[76px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card shadow-card"
          >
            <span className="font-display text-lg font-bold tracking-[0.2em] text-heading">{sponsor.name}</span>
            <span className="font-body text-[8.5px] font-semibold tracking-[0.32em] text-muted">{sponsor.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
