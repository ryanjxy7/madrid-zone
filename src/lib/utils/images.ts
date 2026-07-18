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
 * a clean white backdrop behind the subject — see normalizeBackground.ts.
 * Never applied to placeholderImage() URLs (those are deliberate dark
 * site-themed art, not a photo with a background to normalise).
 */
export function normalizedPhotoUrl(url: string): string {
  if (!isNormalizablePhotoHost(url)) return url;
  return `/api/photo/normalize?src=${encodeURIComponent(url)}`;
}
