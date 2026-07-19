/**
 * Deterministic, offline placeholder image URLs — rendered locally by
 * src/app/api/placeholder/[seed]/route.tsx, so the site never depends on a
 * third-party image host (and never breaks behind a restrictive network
 * policy). Swap for real licensed photography or Sanity-hosted images
 * before launch — see src/lib/cms/sanity.
 */
export function placeholderImage(seed: string, width: number, height: number): string {
  return `/api/placeholder/${encodeURIComponent(seed)}?w=${width}&h=${height}`;
}

/**
 * Hosts a real (editor-uploaded) photo URL is allowed to come from before
 * /api/photo/normalize will fetch it — mirrors next.config.ts's image
 * remotePatterns. Keeps the normalize route from being used as an open
 * proxy/SSRF vector for arbitrary URLs.
 */
const NORMALIZABLE_PHOTO_HOSTS = ["cdn.sanity.io", "media.api-sports.io", "api.sofascore.com", "a.espncdn.com"];

export function isNormalizablePhotoHost(url: string): boolean {
  try {
    return NORMALIZABLE_PHOTO_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Routes a real uploaded photo through /api/photo/normalize, which forces
 * a clean, consistent backdrop behind the subject — see
 * normalizeBackground.ts. Never applied to placeholderImage() URLs (those
 * are deliberate dark site-themed art, not a photo with a background to
 * normalise).
 *
 * `mode: "transparent"` keys the background out to alpha 0 instead of
 * baking an opaque white fill — for photos that sit over another design
 * element meant to show through (the Squad card's number watermark).
 * Defaults to "white" (opaque) for every other use — small photo circles
 * with nothing behind them to reveal.
 */
export function normalizedPhotoUrl(url: string, mode: "white" | "transparent" = "white"): string {
  if (!isNormalizablePhotoHost(url)) return url;
  const modeParam = mode === "transparent" ? "&mode=transparent" : "";
  return `/api/photo/normalize?src=${encodeURIComponent(url)}${modeParam}`;
}

/**
 * CSS object-position for a player photo, given an optional editor-set
 * crop focal point (0-1 fractions). Every player photo on the site is now
 * served uncropped (see avatarSourceImageUrl) so this is the *only* crop
 * that happens — with no focal point set yet, biasing toward the top
 * rather than dead-center is deliberate: portrait photos overwhelmingly
 * frame the face in the upper portion of the shot, so a plain center crop
 * systematically clips the top of the head once that source gets cropped
 * down into a small square/circle. Once a hotspot is set (manually, or
 * automatically via Studio's auto-crop), that real focal point always
 * wins over this default.
 */
export function photoObjectPosition(focus?: { x: number; y: number }): string {
  return focus ? `${focus.x * 100}% ${focus.y * 100}%` : "50% 20%";
}
