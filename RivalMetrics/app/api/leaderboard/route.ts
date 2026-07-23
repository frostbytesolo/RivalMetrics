import { NextRequest, NextResponse } from "next/server";
import { queryLeaderboard } from "@/lib/queries";
import { ALL_DIMENSIONS, ALL_PERIODS, type Dimension, type Period } from "@/lib/data";

/**
 * GET /api/leaderboard?dimension=countries&period=monthly&limit=10
 *
 * Returns leaderboard rows from the Supabase daily_aggregates table.
 * If Supabase is not configured or no data exists, returns an empty array.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dim = (searchParams.get("dimension") ?? "countries") as Dimension;
  const period = (searchParams.get("period") ?? "monthly") as Period;
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50));

  if (!ALL_DIMENSIONS.includes(dim) || !ALL_PERIODS.includes(period)) {
    return NextResponse.json(
      { error: "Invalid dimension or period." },
      { status: 400 }
    );
  }

  const rows = await queryLeaderboard(dim, period, limit);
  return NextResponse.json({ dimension: dim, period, rows });
}
