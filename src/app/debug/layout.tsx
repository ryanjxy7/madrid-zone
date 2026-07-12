import type { Metadata } from "next";

/**
 * Temporary debugging tools (/debug/api-football, /debug/system). Own
 * root layout — deliberately minimal, no site chrome, no CMS/Tailwind
 * dependency — so it can never be affected by (or affect) the main site.
 *
 * Delete this whole src/app/debug directory once you're done diagnosing
 * the integration; it's not meant to ship long-term.
 */
export const metadata: Metadata = {
  title: "Debug",
  robots: { index: false, follow: false },
};

export default function DebugLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0b0d12",
          color: "#e5e7eb",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 13,
          lineHeight: 1.5,
          padding: "24px 20px 80px",
        }}
      >
        {children}
      </body>
    </html>
  );
}
