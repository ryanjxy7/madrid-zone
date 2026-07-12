import { adImageUrl, adSlotQuery, isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import type { SanityAdSlot } from "@/lib/cms/sanity/types";

export interface AdSlotContent {
  enabled: boolean;
  mode: "placeholder" | "image" | "code";
  imageUrl?: string;
  imageAlt?: string;
  linkUrl?: string;
  adNetworkCode?: string;
  width: number;
  height: number;
}

const defaults: AdSlotContent = {
  enabled: true,
  mode: "placeholder",
  width: 300,
  height: 250,
};

/**
 * The homepage ad box, entirely editor-controlled from the Ad Slot
 * singleton in Studio — on/off, a house-ad image, or a sandboxed ad
 * network embed. Defaults to a neutral placeholder when unconfigured.
 */
export async function getAdSlot(): Promise<AdSlotContent> {
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityAdSlot>(adSlotQuery);
    if (result) {
      const width = result.width ?? defaults.width;
      const height = result.height ?? defaults.height;
      return {
        enabled: result.enabled ?? defaults.enabled,
        mode: result.mode ?? defaults.mode,
        imageUrl: result.creative ? adImageUrl(result.creative, width, height) : undefined,
        imageAlt: result.advertiserName ?? "Advertisement",
        linkUrl: result.linkUrl,
        adNetworkCode: result.adNetworkCode,
        width,
        height,
      };
    }
  }
  return defaults;
}
