/**
 * Privacy-safe analytics helpers.
 *
 * Spec: "No personal data, no cookies, no fingerprinting."
 *
 * To honor that we:
 *  - hash the IP + a per-day salt into an opaque daily visitor id (one-way;
 *    the raw IP is never stored or logged);
 *  - only ever persist aggregates and the daily hash (which rotates daily so
 *    it can't be used to track a person over time);
 *  - do not set any cookies and do not read canvas/fonts/WebGL for
 *    fingerprinting.
 */

import { createHash } from "crypto";

/** Extract the client IP from common proxy headers, best-effort. */
export function getClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return (
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("fastly-client-ip") ||
    null
  );
}

/**
 * Produce a daily-rotating, one-way visitor id from an IP.
 * The raw IP is never persisted — only this irreversible hash.
 * Salt changes each calendar day so ids can't be correlated across days.
 */
export function dailyVisitorId(ip: string | null, now = new Date()): string {
  const salt = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const input = `${ip ?? "anon"}::${salt}`;
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

/**
 * Coarse geolocation from Cloudflare/Supabase headers only. Never from a
 * third-party IP-lookup API. Country-level is the most granular we store.
 */
export function getCountry(headers: Headers): string | null {
  return (
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country-code") ||
    null
  );
}

/**
 * Parse a User-Agent into coarse, privacy-safe device/OS/browser buckets.
 * We do not store the raw UA — only the derived category.
 */
export interface ClientProfile {
  device: "mobile" | "desktop" | "tablet" | "tv" | "wearable" | "other";
  os: "android" | "windows" | "ios" | "macos" | "linux" | "chromeos" | "other";
  browser: "chrome" | "safari" | "edge" | "firefox" | "opera" | "samsung" | "other";
}

export function parseUserAgent(ua: string | null): ClientProfile {
  const u = (ua || "").toLowerCase();
  const device: ClientProfile["device"] = /tv|smarttv|bravia|roku/.test(u)
    ? "tv"
    : /watch|wearable|galaxy watch/.test(u)
    ? "wearable"
    : /ipad|tablet|kindle|silk/.test(u)
    ? "tablet"
    : /mobile|iphone|android.*mobile|opera mini/.test(u)
    ? "mobile"
    : "desktop";
  const os: ClientProfile["os"] = /android/.test(u)
    ? "android"
    : /windows/.test(u)
    ? "windows"
    : /iphone|ipad|ios/.test(u)
    ? "ios"
    : /mac os|macintosh/.test(u)
    ? "macos"
    : /cros|chromeos/.test(u)
    ? "chromeos"
    : /linux/.test(u)
    ? "linux"
    : "other";
  const browser: ClientProfile["browser"] = /edg/.test(u)
    ? "edge"
    : /opera|opr/.test(u)
    ? "opera"
    : /samsungbrowser/.test(u)
    ? "samsung"
    : /chrome|crios/.test(u)
    ? "chrome"
    : /firefox|fxios/.test(u)
    ? "firefox"
    : /safari/.test(u)
    ? "safari"
    : "other";
  return { device, os, browser };
}
