import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { getSiteSettings } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Follow",
  description: "Follow Madrid Zone across every platform — X, Instagram, Facebook, TikTok and YouTube.",
  alternates: { canonical: "/follow" },
};

export default async function FollowPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-[680px] flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">
            FOLLOW MADRID ZONE
          </h1>
          <p className="font-body text-[13px] text-muted">
            Join {settings.followerCount} Madridistas across our platforms.
          </p>
        </div>

        {settings.socialPlatforms.map((platform) => (
          <Card
            key={platform.key}
            hover
            className="flex items-center gap-4 p-4 sm:p-[18px_22px]"
          >
            <a href={platform.url} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center gap-4">
              <span
                className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl font-display text-lg font-bold text-white"
                style={{ background: platform.color }}
              >
                {platform.mark}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="font-display text-[17px] font-bold tracking-[0.04em] text-heading">{platform.name}</span>
                <span className="font-body text-xs text-muted">{platform.handle}</span>
              </span>
              <span className="flex flex-col items-end gap-0.5">
                <span className="font-display text-xl font-bold text-accent">{platform.followers}</span>
                <span className="font-display text-[10px] font-semibold tracking-[0.12em] text-muted">FOLLOWERS</span>
              </span>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
