import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveMatchCentre } from "@/components/matches/LiveMatchCentre";
import { getMatchDetail } from "@/lib/football/footballService";
import { siteConfig } from "@/lib/seo/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchDetail(id);
  if (!match) return {};

  const title = `${match.home.name} vs ${match.away.name}`;
  const description = `${match.competition} — ${match.home.name} ${match.home.score ?? ""} - ${match.away.score ?? ""} ${match.away.name}. ${match.kickOff}.`;
  const url = `${siteConfig.url}/matches/${id}`;

  return {
    title,
    description,
    alternates: { canonical: `/matches/${id}` },
    openGraph: { type: "website", title, description, url },
    twitter: { card: "summary", title, description },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const match = await getMatchDetail(id);
  if (!match) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.home.name} vs ${match.away.name}`,
    startDate: undefined,
    location: match.venue ? { "@type": "Place", name: match.venue } : undefined,
    competitor: [
      { "@type": "SportsTeam", name: match.home.name },
      { "@type": "SportsTeam", name: match.away.name },
    ],
    eventStatus:
      match.status === "finished"
        ? "https://schema.org/EventCompleted"
        : match.status === "postponed"
          ? "https://schema.org/EventPostponed"
          : match.status === "canceled"
            ? "https://schema.org/EventCancelled"
            : "https://schema.org/EventScheduled",
  };

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[22px] font-bold tracking-[0.02em] text-heading sm:text-[28px]">
          {match.home.name} vs {match.away.name}
        </h1>
        <p className="font-body text-[13px] text-muted">{match.competition}</p>
      </div>
      <div className="max-w-2xl">
        <LiveMatchCentre matchId={id} initialMatch={match} />
      </div>
    </div>
  );
}
