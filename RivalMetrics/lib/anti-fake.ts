/**
 * Anti-fake protection (spec: "IP clustering, UA detection, frequency checks").
 *
 * Server-side heuristics applied to every inbound event before it is
 * accepted. Anything that trips a rule is dropped silently (HTTP 202) so
 * attackers get no signal about whether they were caught.
 *
 * These are intentionally lightweight and stateless (rate-limit state lives
 * in Supabase or an edge KV in production). The mock layer below keeps an
 * in-memory window for local dev.
 */

import type { ClientProfile } from "./privacy";

const RULES = {
  maxEventsPerMinute: 6, // per visitor id
  maxEventsPerHour: 60,
  suspiciousUaLength: 12, // anything shorter is almost certainly a bot
  bannedUaSubstrings: ["bot", "crawler", "spider", "headless", "curl/", "wget/"]
} as const;

/** In-memory rate-limit window. Replace with Redis/KV in production. */
const windowStore = new Map<string, number[]>();

function hitWindow(key: string, now: number, windowMs: number): number[] {
  const hits = (windowStore.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  windowStore.set(key, hits);
  return hits;
}

export interface AntiFakeResult {
  accept: boolean;
  reasons: string[];
}

/**
 * Evaluate an inbound event. Returns `accept: false` with reasons when the
 * event is suspected of being fake or abusive.
 */
export function evaluateEvent(opts: {
  visitorId: string;
  ua: string | null;
  profile: ClientProfile;
  ip: string | null;
  now?: number;
}): AntiFakeResult {
  const { visitorId, ua, profile, ip, now = Date.now() } = opts;
  const reasons: string[] = [];
  const u = (ua || "").toLowerCase();

  if (!ua || ua.length < RULES.suspiciousUaLength) {
    reasons.push("missing-or-tiny-ua");
  }
  if (RULES.bannedUaSubstrings.some((s) => u.includes(s))) {
    reasons.push("bot-ua");
  }
  // Known headless automation signatures.
  if (/headlesschrome|phantomjs|slimerjs|puppeteer/.test(u)) {
    reasons.push("headless-automation");
  }
  // Unsupported/very unlikely UA combinations.
  if (profile.os === "ios" && profile.browser === "firefox") {
    reasons.push("impossible-profile");
  }

  const minute = hitWindow(`m:${visitorId}`, now, 60_000).length;
  const hour = hitWindow(`h:${visitorId}`, now, 3_600_000).length;
  if (minute > RULES.maxEventsPerMinute) reasons.push("burst-minute");
  if (hour > RULES.maxEventsPerHour) reasons.push("burst-hour");

  // Optional IP clustering: same /24 firing many events from one visitor id.
  if (ip) {
    const subnet = ip.split(".").slice(0, 3).join(".");
    if (subnet && ip.split(".").length === 4) {
      const subnetHits = hitWindow(`s:${subnet}`, now, 60_000).length;
      if (subnetHits > 20) reasons.push("ip-clustering");
    }
  }

  return { accept: reasons.length === 0, reasons };
}
