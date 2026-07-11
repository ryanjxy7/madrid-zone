import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder imagery is generated locally (see src/lib/utils/images.ts)
    // with zero external dependency. Add your CDN / Sanity asset hostname
    // here once real photography is wired up, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    localPatterns: [{ pathname: "/api/placeholder/**" }],
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
