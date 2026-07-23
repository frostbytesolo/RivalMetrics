import { NextResponse } from "next/server";
import { queryStats } from "@/lib/queries";
import { type Period } from "@/lib/data";

/**
 * GET /api/stats?period=monthly
 *
 * Returns top-line stats from Supabase. Zero if no data.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = (url.searchParams.get("period") ?? "monthly") as Period;
  const stats = await queryStats(period);
  return NextResponse.json(stats);
}
