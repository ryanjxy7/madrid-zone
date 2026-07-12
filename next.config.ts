import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted photography (articles, squad, sponsor logos).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // API-Football player photos (kept for the alternate provider — see src/lib/sports-api).
      { protocol: "https", hostname: "media.api-sports.io" },
      // Sofascore player photos (the active provider — see src/lib/football).
      { protocol: "https", hostname: "api.sofascore.com" },
    ],
    // Offline placeholder imagery (see src/lib/utils/images.ts) — zero
    // external dependency until real content is added in Studio.
    localPatterns: [{ pathname: "/api/placeholder/**" }],
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
