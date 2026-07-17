import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { siteSettingsQuery } from "@/lib/cms/sanity/queries";
import type { SanitySiteSettings } from "@/lib/cms/sanity/types";
import { siteConfig } from "@/lib/seo/constants";

export interface SocialPlatform {
  key: string;
  name: string;
  mark: string;
  color: string;
  handle: string;
  followers: string;
  url: string;
}

export interface SiteSettings {
  followerCount: string;
  monthlyReach: string;
  tickerEnabled: boolean;
  transferWindowClosesText: string;
  editorialEmail: string;
  partnersEmail: string;
  pressEmail: string;
  socialPlatforms: SocialPlatform[];
  newsletterHeading: string;
  newsletterBody: string;
  managerName: string;
}

const defaultSocialPlatforms: SocialPlatform[] = [
  { key: "x", name: "X / TWITTER", mark: "𝕏", color: "#0f1419", handle: "@theMadridZone", followers: "1.8M+", url: siteConfig.social.x },
  { key: "instagram", name: "INSTAGRAM", mark: "IG", color: "linear-gradient(45deg,#f09433,#dc2743,#bc1888)", handle: "@themadridzone", followers: "520K+", url: siteConfig.social.instagram },
  { key: "facebook", name: "FACEBOOK", mark: "f", color: "#1877f2", handle: "Madrid Zone", followers: "50K+", url: siteConfig.social.facebook },
  { key: "tiktok", name: "TIKTOK", mark: "TT", color: "#010101", handle: "@themadridzone", followers: "95K+", url: siteConfig.social.tiktok },
  { key: "youtube", name: "YOUTUBE", mark: "YT", color: "#cc0000", handle: "Madrid Zone", followers: "130K+", url: siteConfig.social.youtube },
];

const defaults: SiteSettings = {
  followerCount: "2.1M",
  monthlyReach: "40M+",
  tickerEnabled: true,
  transferWindowClosesText: "53 days",
  editorialEmail: siteConfig.emails.editorial,
  partnersEmail: siteConfig.emails.partners,
  pressEmail: siteConfig.emails.press,
  socialPlatforms: defaultSocialPlatforms,
  newsletterHeading: "THE MZ BRIEFING",
  newsletterBody: "Daily email. Every Madrid story that matters.",
  managerName: "José Mourinho",
};

/**
 * Sitewide, editor-controlled text and toggles — see the Site Settings
 * singleton in Studio. Falls back to src/lib/seo/constants.ts defaults
 * field-by-field, so an editor only needs to fill in what they want to
 * override.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanitySiteSettings>(siteSettingsQuery);
    if (result) {
      return {
        followerCount: result.followerCount ?? defaults.followerCount,
        monthlyReach: result.monthlyReach ?? defaults.monthlyReach,
        tickerEnabled: result.tickerEnabled ?? defaults.tickerEnabled,
        transferWindowClosesText: result.transferWindowClosesText ?? defaults.transferWindowClosesText,
        editorialEmail: result.editorialEmail ?? defaults.editorialEmail,
        partnersEmail: result.partnersEmail ?? defaults.partnersEmail,
        pressEmail: result.pressEmail ?? defaults.pressEmail,
        socialPlatforms:
          result.socialPlatforms && result.socialPlatforms.length > 0
            ? result.socialPlatforms.map((platform, index) => ({
                key: platform.key ?? defaultSocialPlatforms[index]?.key ?? `platform-${index}`,
                name: platform.name ?? defaultSocialPlatforms[index]?.name ?? "",
                mark: platform.mark ?? defaultSocialPlatforms[index]?.mark ?? "",
                color: platform.color ?? defaultSocialPlatforms[index]?.color ?? "#565d73",
                handle: platform.handle ?? defaultSocialPlatforms[index]?.handle ?? "",
                followers: platform.followers ?? defaultSocialPlatforms[index]?.followers ?? "",
                url: platform.url ?? defaultSocialPlatforms[index]?.url ?? "#",
              }))
            : defaults.socialPlatforms,
        newsletterHeading: result.newsletterHeading ?? defaults.newsletterHeading,
        newsletterBody: result.newsletterBody ?? defaults.newsletterBody,
        managerName: result.managerName ?? defaults.managerName,
      };
    }
  }
  return defaults;
}
