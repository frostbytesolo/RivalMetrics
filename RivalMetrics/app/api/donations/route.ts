import { NextResponse } from "next/server";
import { queryDonationTotals } from "@/lib/queries";

/**
 * GET /api/donations
 *
 * Returns real donation totals from the on-chain verified Supabase table.
 * Returns zeros if no donations exist.
 */
export async function GET() {
  const totals = await queryDonationTotals();
  return NextResponse.json(totals);
}
