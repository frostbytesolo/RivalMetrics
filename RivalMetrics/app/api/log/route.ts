import { NextRequest, NextResponse } from "next/server";
import { getClientIp, dailyVisitorId, getCountry, parseUserAgent } from "@/lib/privacy";
import { evaluateEvent } from "@/lib/anti-fake";
import { insertEvent } from "@/lib/queries";
import { type Dimension, ALL_DIMENSIONS } from "@/lib/data";

/**
 * POST /api/log — event ingestion endpoint.
 *
 * Accepts a JSON body with an optional `dimension` field. Runs anti-fake
 * checks server-side; silently drops suspicious events (202) so attackers
 * get no signal. Valid events are inserted into the Supabase events table.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = req.headers;

    const ip = getClientIp(headers);
    const ua = headers.get("user-agent") ?? null;
    const profile = parseUserAgent(ua);
    const visitorId = dailyVisitorId(ip);
    const country = getCountry(headers);

    // Validate dimension.
    const dim = (body.dimension ?? "countries") as Dimension;
    if (!ALL_DIMENSIONS.includes(dim)) {
      return NextResponse.json(
        { accepted: false, reason: "Invalid dimension." },
        { status: 400 }
      );
    }

    // Anti-fake evaluation.
    const { accept } = evaluateEvent({
      visitorId,
      ua,
      profile,
      ip,
      now: Date.now()
    });

    if (!accept) {
      return NextResponse.json(
        { accepted: false, reason: "Event did not pass validation." },
        { status: 202 }
      );
    }

    // Insert into Supabase.
    const ok = await insertEvent({
      visitorId,
      dimension: dim,
      country,
      device: profile.device,
      os: profile.os,
      browser: profile.browser
    });

    if (!ok) {
      return NextResponse.json(
        { accepted: false, reason: "Storage unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      accepted: true,
      visitor_id: visitorId.slice(0, 8) + "…"
    });
  } catch {
    return NextResponse.json(
      { error: "Bad request" },
      { status: 400 }
    );
  }
}
