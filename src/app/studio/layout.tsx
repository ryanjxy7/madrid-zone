import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/constants";

/**
 * A separate root layout for /studio. Deliberately does NOT import
 * globals.css or render the site's Header/Ticker/Footer — Sanity Studio
 * ships its own complete UI and styling, and Next.js route groups give
 * each root layout its own <html>/<body> so the two never collide.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Studio | Madrid Zone",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
