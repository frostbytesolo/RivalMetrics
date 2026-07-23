/**
 * Server-only query layer — all reads from Supabase go through here.
 *
 * Real-time analytics: for the current period we aggregate directly from the
 * events table via RPC functions; for historical periods we read from the
 * precomputed daily_aggregates table. No fake data anywhere — if there's no
 * data, callers get empty arrays and zeros.
 */

import { supabaseAdmin } from "./supabase";
import {
  type Dimension,
  type Period,
  type RankRow,
  type FeedEvent,
  type StatsSummary,
  type Rivalry,
  bucketIcon,
  bucketLabel,
  periodRange,
  RIVALRY_PAIRS
} from "./data";
import type { DonationTotals } from "./donations";
import { emptyDonationTotals } from "./donations";

/** The cutoff: if a period is "now-ish", read live from events. */
function isRealtimePeriod(period: Period): boolean {
  return period === "daily" || period === "weekly";
}

// ─── Leaderboard ──────────────────────────────────────────────────────────

/**
 * Fetch leaderboard rows. For the current day/week we aggregate live from
 * events via the realtime_leaderboard RPC; for monthly/yearly we read from
 * daily_aggregates (populated by the rollup).
 */
export async function queryLeaderboard(
  dim: Dimension,
  period: Period,
  limit = 50
): Promise<RankRow[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];

  if (isRealtimePeriod(period)) {
    return queryLeaderboardRealtime(sb, dim, period, limit);
  }
  return queryLeaderboardAggregated(sb, dim, period, limit);
}

/** Live aggregation straight from the events table via RPC. */
async function queryLeaderboardRealtime(
  sb: NonNullable<ReturnType<typeof supabaseAdmin>>,
  dim: Dimension,
  period: Period,
  limit: number
): Promise<RankRow[]> {
  const { start } = periodRange(period);
  const sinceIso = start.toISOString();

  const { data, error } = await sb.rpc("realtime_leaderboard", {
    p_dimension: dim,
    p_since: sinceIso,
    p_limit: limit
  });

  if (error || !data || !data.length) return [];

  const grandTotal = data.reduce((s: number, r: { total: number }) => s + r.total, 0);
  if (grandTotal === 0) return [];

  return data.map((row: { bucket: string; total: number }, i: number) => ({
    rank: i + 1,
    key: row.bucket,
    label: bucketLabel(dim, row.bucket),
    icon: bucketIcon(dim, row.bucket),
    total: row.total,
    change: 0, // Change requires comparing to previous period; populated below for weekly.
    share: (row.total / grandTotal) * 100
  }));
}

/** Historical aggregation from daily_aggregates. */
async function queryLeaderboardAggregated(
  sb: NonNullable<ReturnType<typeof supabaseAdmin>>,
  dim: Dimension,
  period: Period,
  limit: number
): Promise<RankRow[]> {
  const { start, end } = periodRange(period);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  // Current period totals.
  const { data: current, error: errCurrent } = await sb
    .from("daily_aggregates")
    .select("bucket, total")
    .eq("dimension", dim)
    .gte("day", startDate)
    .lte("day", endDate);

  if (errCurrent || !current || !current.length) return [];

  // Aggregate by bucket across the days.
  const currentMap = new Map<string, number>();
  for (const row of current) {
    currentMap.set(row.bucket, (currentMap.get(row.bucket) ?? 0) + row.total);
  }

  // Previous period for change calculation.
  const periodDuration = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - periodDuration);
  const prevEnd = new Date(start.getTime());
  const { data: previous } = await sb
    .from("daily_aggregates")
    .select("bucket, total")
    .eq("dimension", dim)
    .gte("day", prevStart.toISOString().slice(0, 10))
    .lt("day", prevEnd.toISOString().slice(0, 10));

  const prevMap = new Map<string, number>();
  if (previous) {
    for (const row of previous) {
      prevMap.set(row.bucket, (prevMap.get(row.bucket) ?? 0) + row.total);
    }
  }

  const grandTotal = [...currentMap.values()].reduce((s, v) => s + v, 0);
  if (grandTotal === 0) return [];

  const sorted = [...currentMap.entries()].sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, limit).map(([bucket, total], i) => {
    const prev = prevMap.get(bucket) ?? 0;
    return {
      rank: i + 1,
      key: bucket,
      label: bucketLabel(dim, bucket),
      icon: bucketIcon(dim, bucket),
      total,
      change: total - prev,
      share: (total / grandTotal) * 100
    };
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────

/**
 * Top-line stats. Uses the realtime_stats RPC for current periods.
 */
export async function queryStats(period: Period): Promise<StatsSummary> {
  const sb = supabaseAdmin();
  if (!sb) {
    return {
      totalVisits: 0,
      activeCountries: 0,
      trackedRivalries: RIVALRY_PAIRS.length,
      onlineNow: 0,
      period
    };
  }

  const { start } = periodRange(period);
  const sinceIso = start.toISOString();

  if (isRealtimePeriod(period)) {
    const { data, error } = await sb.rpc("realtime_stats", { p_since: sinceIso });
    if (error || !data) {
      return zeroStats(period);
    }
    const row = Array.isArray(data) ? data[0] : data;
    return {
      totalVisits: row?.total_events ?? 0,
      activeCountries: row?.active_countries ?? 0,
      trackedRivalries: RIVALRY_PAIRS.length,
      // "Online now" = unique visitors in the last 60 seconds. Requires a
      // second RPC call — we approximate with a fresh realtime query.
      onlineNow: await queryOnlineNow(sb),
      period
    };
  }

  // Monthly/yearly: read from aggregates.
  const { start: aggStart, end: aggEnd } = periodRange(period);
  const { data } = await sb
    .from("daily_aggregates")
    .select("total")
    .eq("dimension", "countries")
    .gte("day", aggStart.toISOString().slice(0, 10))
    .lte("day", aggEnd.toISOString().slice(0, 10));

  const totalVisits = data ? data.reduce((s, r) => s + r.total, 0) : 0;
  const { count: activeCountries } = await sb
    .from("daily_aggregates")
    .select("bucket", { count: "exact", head: true })
    .eq("dimension", "countries")
    .gte("day", aggStart.toISOString().slice(0, 10))
    .lte("day", aggEnd.toISOString().slice(0, 10))
    .gt("total", 0);

  return {
    totalVisits,
    activeCountries: activeCountries ?? 0,
    trackedRivalries: RIVALRY_PAIRS.length,
    onlineNow: await queryOnlineNow(sb),
    period
  };
}

/** Count unique visitors active in the last 60 seconds. */
async function queryOnlineNow(sb: NonNullable<ReturnType<typeof supabaseAdmin>>): Promise<number> {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { data, error } = await sb.rpc("realtime_stats", { p_since: since });
  if (error || !data) return 0;
  const row = Array.isArray(data) ? data[0] : data;
  return row?.unique_visitors ?? 0;
}

function zeroStats(period: Period): StatsSummary {
  return {
    totalVisits: 0,
    activeCountries: 0,
    trackedRivalries: RIVALRY_PAIRS.length,
    onlineNow: 0,
    period
  };
}

// ─── Feed ─────────────────────────────────────────────────────────────────

/**
 * Recent feed events from the feed_events table, populated by the daily
 * rollup when ranks change. Returns [] if nothing has happened yet —
 * never fabricated.
 */
export async function queryFeed(limit = 20): Promise<FeedEvent[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];

  const { data, error } = await sb.rpc("recent_feed", { p_limit: limit });
  if (error || !data) return [];

  return (data as Array<{
    id: string;
    at: string;
    dimension: Dimension;
    bucket: string;
    kind: FeedEvent["kind"];
    message: string;
  }>).map((row) => ({
    id: row.id,
    at: row.at,
    dimension: row.dimension,
    label: bucketLabel(row.dimension, row.bucket),
    icon: bucketIcon(row.dimension, row.bucket),
    kind: row.kind,
    message: row.message
  }));
}

// ─── Rivalries ───────────────────────────────────────────────────────────

/**
 * Head-to-head rivalries computed from actual country data for the month.
 * Only shows a rivalry if both countries have real data.
 */
export async function queryRivalries(): Promise<Rivalry[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];

  const rows = await queryLeaderboard("countries", "monthly", 50);
  if (!rows.length) return [];

  const map = new Map<string, RankRow>();
  for (const r of rows) {
    map.set(r.key, r);
  }

  const results: Rivalry[] = [];
  for (const [aKey, bKey] of RIVALRY_PAIRS) {
    const a = map.get(aKey);
    const b = map.get(bKey);
    if (!a || !b) continue;

    const top = a.total >= b.total ? a : b;
    const low = top === a ? b : a;
    const gap = top.total - low.total;

    results.push({
      id: `${aKey}-vs-${bKey}`,
      a: { key: a.key, label: a.label, icon: a.icon, total: a.total, rank: a.rank },
      b: { key: b.key, label: b.label, icon: b.icon, total: b.total, rank: b.rank },
      gap,
      trend: "steady"
    });
  }

  return results;
}

// ─── Donations ───────────────────────────────────────────────────────────

/**
 * Donation totals from the on-chain verified donations table.
 * Returns zeros if no donations exist.
 */
export async function queryDonationTotals(): Promise<DonationTotals> {
  const sb = supabaseAdmin();
  if (!sb) return emptyDonationTotals();

  const { data, error } = await sb
    .from("donations")
    .select("amount_usd, confirmed_at");

  if (error || !data || !data.length) return emptyDonationTotals();

  const totalUsd = data.reduce((s, r) => s + Number(r.amount_usd), 0);
  const lastUpdated = [...data].sort(
    (a, b) => new Date(b.confirmed_at).getTime() - new Date(a.confirmed_at).getTime()
  )[0]?.confirmed_at ?? new Date().toISOString();

  return {
    totalUsd,
    goalUsd: 12_000,
    contributors: data.length,
    lastUpdated
  };
}

// ─── Ingestion ────────────────────────────────────────────────────────────

/**
 * Insert a validated event into the events table. The `bucket` is derived
 * from the visitor's profile (country for countries dimension, device for
 * devices, etc.) so the realtime_leaderboard RPC can group by it.
 */
export async function insertEvent(opts: {
  visitorId: string;
  dimension: Dimension;
  country: string | null;
  device: string;
  os: string;
  browser: string;
}): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;

  // For each dimension the bucket is the relevant profile field.
  const buckets: Record<Dimension, string> = {
    countries: opts.country ?? "unknown",
    devices: opts.device,
    os: opts.os,
    browsers: opts.browser,
    regions: countryToRegion(opts.country)
  };

  const { error } = await sb.from("events").insert({
    visitor_id: opts.visitorId,
    dimension: opts.dimension,
    bucket: buckets[opts.dimension],
    country: opts.country,
    device: opts.device,
    os: opts.os,
    browser: opts.browser
  });

  return !error;
}

/** Map a country code to a continent/region bucket. */
function countryToRegion(country: string | null): string {
  if (!country) return "other";
  const regions: Record<string, string> = {
    US: "na", CA: "na", MX: "na",
    BR: "sa", AR: "sa", CO: "sa", CL: "sa",
    GB: "eu", DE: "eu", FR: "eu", ES: "eu", IT: "eu", NL: "eu",
    IN: "as", JP: "as", KR: "as", CN: "as", ID: "as", SG: "as",
    AU: "oc", NZ: "oc",
    ZA: "af", NG: "af", EG: "af"
  };
  return regions[country] ?? "other";
}

/**
 * Insert a contact message.
 */
export async function insertContactMessage(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;

  const { error } = await sb.from("contact_messages").insert({
    name: opts.name,
    email: opts.email,
    subject: opts.subject,
    message: opts.message
  });

  return !error;
}
