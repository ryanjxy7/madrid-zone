import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { siteSettingsQuery } from "@/lib/cms/sanity/queries";
import type { SanitySiteSettings } from "@/lib/cms/sanity/types";
import { siteConfig } from "@/lib/seo/constants";

export interface SiteSettings {
  followerCount: string;
  monthlyReach: string;
  tickerEnabled: boolean;
  adSlotEnabled: boolean;
  transferWindowClosesText: string;
  editorialEmail: string;
  partnersEmail: string;
  pressEmail: string;
  socialLinks: { x: string; facebook: string; instagram: string; youtube: string; tiktok: string };
  newsletterHeading: string;
  newsletterBody: string;
}

const defaults: SiteSettings = {
  followerCount: "2.1M",
  monthlyReach: "40M+",
  tickerEnabled: true,
  adSlotEnabled: true,
  transferWindowClosesText: "53 days",
  editorialEmail: siteConfig.emails.editorial,
  partnersEmail: siteConfig.emails.partners,
  pressEmail: siteConfig.emails.press,
  socialLinks: siteConfig.social,
  newsletterHeading: "THE MZ BRIEFING",
  newsletterBody: "Daily email. Every Madrid story that matters.",
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
        adSlotEnabled: result.adSlotEnabled ?? defaults.adSlotEnabled,
        transferWindowClosesText: result.transferWindowClosesText ?? defaults.transferWindowClosesText,
        editorialEmail: result.editorialEmail ?? defaults.editorialEmail,
        partnersEmail: result.partnersEmail ?? defaults.partnersEmail,
        pressEmail: result.pressEmail ?? defaults.pressEmail,
        socialLinks: {
          x: result.socialLinks?.x ?? defaults.socialLinks.x,
          facebook: result.socialLinks?.facebook ?? defaults.socialLinks.facebook,
          instagram: result.socialLinks?.instagram ?? defaults.socialLinks.instagram,
          youtube: result.socialLinks?.youtube ?? defaults.socialLinks.youtube,
          tiktok: result.socialLinks?.tiktok ?? defaults.socialLinks.tiktok,
        },
        newsletterHeading: result.newsletterHeading ?? defaults.newsletterHeading,
        newsletterBody: result.newsletterBody ?? defaults.newsletterBody,
      };
    }
  }
  return defaults;
}
