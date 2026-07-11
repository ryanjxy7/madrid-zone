import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target — set this up once in Sanity's manage UI (no code):
 * Project → API → Webhooks → Create webhook
 *   URL: https://yourdomain.com/api/revalidate
 *   Dataset: production
 *   Trigger on: Create, Update, Delete
 *   Secret: same value as SANITY_REVALIDATE_SECRET
 *
 * Without this, published edits still go live automatically within the
 * cache window each query uses (60s for most content) — this route just
 * makes publishing instant instead of "within a minute."
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Missing document type" }, { status: 400 });
    }

    revalidateTag("sanity");

    return NextResponse.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (error) {
    console.error("[revalidate] webhook error:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
