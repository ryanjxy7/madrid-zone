import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e1017",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(224,36,62,0.35), transparent 45%), radial-gradient(circle at 80% 85%, rgba(224,36,62,0.25), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: 24,
            backgroundColor: "#e0243e",
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          MZ
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 68, fontWeight: 700, letterSpacing: 4 }}>
          MADRID ZONE
        </div>
        <div style={{ display: "flex", color: "#8b90a0", fontSize: 28, marginTop: 18 }}>{siteConfig.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
