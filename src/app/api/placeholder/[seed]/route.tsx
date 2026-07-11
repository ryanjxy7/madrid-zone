import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function clampDimension(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.round(parsed), 1600);
}

/**
 * Deterministic, offline placeholder "photography" — a branded gradient
 * card, not a real photo. Swap src/lib/utils/images.ts for real licensed
 * imagery (or Sanity-hosted assets) before launch; see the note there.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ seed: string }> }) {
  const { seed } = await params;
  const { searchParams } = new URL(request.url);
  const width = clampDimension(searchParams.get("w"), 800);
  const height = clampDimension(searchParams.get("h"), 600);

  const hash = hashSeed(seed);
  const angle = hash % 360;
  const ringSize = Math.min(width, height) * (0.55 + ((hash % 20) / 100));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#12141d",
          backgroundImage: `linear-gradient(${angle}deg, #1a1d29 0%, #12141d 55%, #0b0c12 100%)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: ringSize,
            height: ringSize,
            borderRadius: "50%",
            border: "1.5px solid rgba(224,36,62,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: ringSize * 0.55,
            height: ringSize * 0.55,
            borderRadius: "50%",
            backgroundImage: "radial-gradient(circle, rgba(224,36,62,0.30) 0%, rgba(224,36,62,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: Math.max(14, height * 0.04),
            right: Math.max(16, width * 0.04),
            display: "flex",
            color: "rgba(255,255,255,0.35)",
            fontSize: Math.max(12, Math.min(width, height) * 0.035),
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          MZ
        </div>
      </div>
    ),
    { width, height }
  );
}
