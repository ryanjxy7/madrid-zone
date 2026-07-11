import type { Metadata } from "next";
import { HeroCard } from "@/components/article/HeroCard";
import { StoryCard } from "@/components/article/StoryCard";
import { AdSlot } from "@/components/home/AdSlot";
import { FixturesWidget } from "@/components/home/FixturesWidget";
import { LatestNewsWidget } from "@/components/home/LatestNewsWidget";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { PlayerStatsWidget } from "@/components/home/PlayerStatsWidget";
import { SponsorsStrip } from "@/components/home/SponsorsStrip";
import { TopGoalscorersWidget } from "@/components/home/TopGoalscorersWidget";
import { getAllArticles, getFeaturedArticle } from "@/lib/data/articles";
import { siteConfig } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: siteConfig.tagline,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, articles] = await Promise.all([getFeaturedArticle(), getAllArticles()]);
  const gridStories = articles.filter((article) => article.slug !== featured.slug).slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-1 gap-5 px-4 pb-2 pt-5 sm:px-6 lg:grid-cols-[250px_1fr_280px] lg:px-8">
        <div className="order-2 flex flex-col gap-4 self-start lg:order-1">
          <LatestNewsWidget />
          <TopGoalscorersWidget />
          <PlayerStatsWidget />
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2">
          <HeroCard article={featured} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gridStories.map((article) => (
              <StoryCard key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <div className="order-3 flex flex-col gap-4">
          <FixturesWidget />
          <AdSlot />
          <NewsletterCta />
        </div>
      </div>

      <SponsorsStrip />
    </div>
  );
}
