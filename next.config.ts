import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted photography (articles, squad, sponsor logos).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // API-Football player photos (the active provider — see src/lib/sports-api/api-football).
      { protocol: "https", hostname: "media.api-sports.io" },
      // Sofascore player photos (kept for the alternate provider — see src/lib/football/providers/sofascore.ts).
      { protocol: "https", hostname: "api.sofascore.com" },
      // ESPN player photos (kept for the alternate provider — see src/lib/football/providers/espn.ts).
      { protocol: "https", hostname: "a.espncdn.com" },
      // Circular national flag icons for Squad cards — see src/lib/utils/countries.ts.
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
    // Offline placeholder imagery (see src/lib/utils/images.ts) — zero
    // external dependency until real content is added in Studio. Also
    // covers /logo.png (public/), the site wordmark used in header/footer.
    localPatterns: [{ pathname: "/api/placeholder/**" }, { pathname: "/api/photo/normalize" }, { pathname: "/logo.png" }],
    formats: ["image/avif", "image/webp"],
    // Squad-card flag icons (src/lib/utils/countries.ts) are the only SVGs
    // this app renders through next/image, and they come from one fixed,
    // trusted CDN path (not user uploads) — safe to allow with a strict
    // CSP that blocks any script the SVG might otherwise try to run.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
