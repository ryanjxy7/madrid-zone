import { NextResponse } from "next/server";
import { getMatchDetail } from "@/lib/football/footballService";

export const dynamic = "force-dynamic";

/**
 * The only network hop the Live Match Centre client component is allowed
 * to poll — it calls this route, never Sofascore directly. This keeps the
 * "server-side only" fetching rule intact while still letting the client
 * refresh a live match every 30-60s.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchDetail(id);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }
  return NextResponse.json(match);
}
