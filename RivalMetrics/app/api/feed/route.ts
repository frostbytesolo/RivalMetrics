import { NextRequest, NextResponse } from "next/server";
import { queryFeed } from "@/lib/queries";

/**
 * GET /feed?limit=20
 *
 * Returns movement feed events. Empty array if no data — never fabricated.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
  const events = await queryFeed(limit);
  return NextResponse.json({ events });
}
