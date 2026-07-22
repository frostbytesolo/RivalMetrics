import { NextRequest, NextResponse } from "next/server";
import { insertContactMessage } from "@/lib/queries";

/**
 * POST /api/contact — contact form handler.
 *
 * Validates the form payload, checks the honeypot, and stores the message
 * in Supabase. Returns success regardless (silent on honeypot catches).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, website } = body as {
      name: string;
      email: string;
      subject: string;
      message: string;
      website?: string;
    };

    // Honeypot: real users leave this empty.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    // Basic validation.
    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const ok = await insertContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || "General").trim(),
      message: message.trim()
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Could not store message. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
