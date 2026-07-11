import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ThemeProvider, themeInitScript } from "@/components/layout/ThemeProvider";
import { Ticker } from "@/components/layout/Ticker";
import { getSiteSettings } from "@/lib/data/siteSettings";
import { siteConfig } from "@/lib/seo/constants";
import { oswald, sourceSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["Real Madrid", "Real Madrid news", "LaLiga", "football transfers", "Bernabéu", "Real Madrid fixtures"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.name} RSS Feed` }] },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e1017" },
    { media: "(prefers-color-scheme: light)", color: "#f2f3f6" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${oswald.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface font-body text-ink antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          {settings.tickerEnabled ? <Ticker /> : null}
          <Header followerCount={settings.followerCount} />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer socialLinks={settings.socialLinks} />
          <MobileTabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
