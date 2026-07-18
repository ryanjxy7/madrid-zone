import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isNormalizablePhotoHost } from "@/lib/utils/images";
import { normalizeToWhiteBackground } from "@/lib/utils/normalizeBackground";

export const runtime = "nodejs";

/**
 * Fetches a real uploaded player photo and forces a clean white backdrop
 * behind the subject (see normalizeBackground.ts) — used instead of the
 * raw CMS URL wherever a player/transfer photo renders, so a PNG with a
 * transparent, black, or off-white background always reads consistently
 * against the site's card chrome in both themes. `src` is restricted to
 * the same hosts next.config.ts already trusts for images, so this can't
 * be used as an open proxy for arbitrary URLs.
 */
export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src || !isNormalizablePhotoHost(src)) {
    return NextResponse.json({ error: "Invalid or disallowed src" }, { status: 400 });
  }

  const upstream = await fetch(src);
  if (!upstream.ok) {
    return NextResponse.json({ error: "Could not fetch source image" }, { status: 502 });
  }

  const input = Buffer.from(await upstream.arrayBuffer());
  const output = await normalizeToWhiteBackground(input);

  return new NextResponse(new Uint8Array(output), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
