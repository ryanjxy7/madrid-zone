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

/**
 * Unconstrained-aspect, generously-sized source for player photos whose
 * container's on-screen aspect ratio varies by breakpoint (the Squad
 * card's photo strip, for one) — deliberately doesn't bake in a fixed
 * crop the way portraitImageUrl does. The frontend does the one and only
 * crop itself via CSS object-fit/object-position, driven by the editor's
 * actual hotspot fraction (see Player.imageFocus), so there's no second,
 * mismatched crop fighting the first and cutting the subject off.
 */
export function avatarSourceImageUrl(source: SanityImageSource, width = 500): string {
  return urlForImage(source).width(width).fit("max").url();
}

/** Unconstrained-aspect crop for logos and avatars — no forced crop. */
export function logoImageUrl(source: SanityImageSource, width = 300): string {
  return urlForImage(source).width(width).fit("max").url();
}

/** Exact pixel crop for ad creatives — ad slots need precise dimensions. */
export function adImageUrl(source: SanityImageSource, width: number, height: number): string {
  return urlForImage(source).width(width).height(height).fit("crop").url();
}
