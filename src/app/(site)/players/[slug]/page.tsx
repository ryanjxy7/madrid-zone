import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPlayerBio } from "@/lib/data/players";
import { getPlayerProfileBySlug, getPlayerSeasonStats } from "@/lib/football/footballService";
import { siteConfig } from "@/lib/seo/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);
  if (!player) return {};

  const title = `${player.name} — Stats & Profile`;
  const description = `${player.name} (#${player.number}, ${player.position}) — Real Madrid stats, appearances, goals and assists this season.`;
  const url = `${siteConfig.url}/players/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/players/${slug}` },
    openGraph: { type: "profile", title, description, url, images: player.photo ? [{ url: player.photo }] : undefined },
    twitter: { card: "summary", title, description, images: player.photo ? [player.photo] : undefined },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await getPlayerProfileBySlug(slug);
  if (!player) notFound();

  const [stats, bio] = await Promise.all([getPlayerSeasonStats(player.id), getPlayerBio(slug)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    nationality: player.nationality,
    jobTitle: player.position,
    memberOf: { "@type": "SportsTeam", name: "Real Madrid" },
    image: player.photo,
  };

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[200px_1fr]">
        {player.photo ? (
          <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-lg border border-border bg-card">
            <Image src={player.photo} alt={player.name} fill sizes="200px" className="object-cover" />
          </div>
        ) : null}
        <div className="flex flex-col justify-end gap-1">
          <span className="font-display text-xs font-bold tracking-[0.14em] text-accent">
            #{player.number} · {player.position.toUpperCase()}
          </span>
          <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">{player.name}</h1>
          <p className="font-body text-[13px] text-muted">
            {player.nationality ?? "Real Madrid"}
            {player.age ? ` · Age ${player.age}` : ""}
          </p>
        </div>
      </div>

      {bio ? (
        <Card className="p-5 sm:p-[22px_26px]">
          <p className="font-body text-sm leading-relaxed text-subtle">{bio}</p>
        </Card>
      ) : null}

      {stats ? (
        <Card className="flex flex-col p-4 sm:p-[16px_22px]">
          <SectionHeading title="SEASON STATISTICS" tone="heading" />
          <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3">
            <StatBlock label="Appearances" value={stats.appearances} />
            <StatBlock label="Minutes" value={stats.minutes} />
            <StatBlock label="Goals" value={stats.goals} />
            <StatBlock label="Assists" value={stats.assists} />
            <StatBlock label="Yellow cards" value={stats.yellowCards} />
            <StatBlock label="Red cards" value={stats.redCards} />
            {stats.rating !== null ? <StatBlock label="Avg. rating" value={stats.rating.toFixed(2)} /> : null}
          </div>
        </Card>
      ) : (
        <p className="font-body text-sm text-muted">Season statistics aren&apos;t available right now — check back soon.</p>
      )}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-xl font-bold text-heading">{value}</span>
      <span className="font-body text-[11px] uppercase tracking-[0.08em] text-muted">{label}</span>
    </div>
  );
}
