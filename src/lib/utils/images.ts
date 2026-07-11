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
