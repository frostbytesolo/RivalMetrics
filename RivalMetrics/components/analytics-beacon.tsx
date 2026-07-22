"use client";

import { useEffect } from "react";

/**
 * Analytics beacon — sends a single, real visit event to /api/log on each
 * page view. This is the source of all real data: anti-fake validated,
 * privacy-safe (no cookies, no fingerprinting), and fired via sendBeacon
 * so it survives page unload.
 *
 * The dimension sent is "countries" by default; the server derives the full
 * visitor profile (device/OS/browser/country) from request headers.
 */
export function AnalyticsBeacon({ dimension = "countries" }: { dimension?: string }) {
  useEffect(() => {
    const body = JSON.stringify({
      dimension,
      path: window.location.pathname,
      ref: document.referrer || null,
      ts: Date.now()
    });

    // sendBeacon is fire-and-forget and survives navigation/unload.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/log", blob);
      if (ok) return;
    }

    // Fallback to fetch with keepalive.
    try {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
      }).catch(() => {});
    } catch {
      /* silent — analytics must never break the page */
    }
  }, [dimension]);

  return null;
}
