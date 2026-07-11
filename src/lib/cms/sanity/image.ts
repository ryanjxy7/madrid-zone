import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Builds an optimized, CDN-resized image URL from a Sanity image
 * reference. Respects the crop/hotspot an editor chose in Studio — this
 * is why the frontend never needs to resize or crop images manually.
 */
function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/** Wide "hero" crop used for article cover photos across the site. */
export function articleImageUrl(source: SanityImageSource, width = 1600): string {
  return urlForImage(source).width(width).height(Math.round((width * 9) / 16)).fit("crop").url();
}

/** Tall 3:4 portrait crop used for squad cards. */
export function portraitImageUrl(source: SanityImageSource, width = 600): string {
  return urlForImage(source).width(width).height(Math.round((width * 4) / 3)).fit("crop").url();
}

/** Unconstrained-aspect crop for logos and avatars — no forced crop. */
export function logoImageUrl(source: SanityImageSource, width = 300): string {
  return urlForImage(source).width(width).fit("max").url();
}
