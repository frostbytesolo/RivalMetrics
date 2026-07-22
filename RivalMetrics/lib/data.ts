/**
 * Shared types and constants for the analytics domain.
 *
 * ALL DATA COMES FROM SUPABASE — there are no fake, seeded, or fabricated
 * numbers anywhere in this file. If Supabase is not configured, every query
 * returns an empty result and the UI shows honest "collecting data" states.
 */

export type Dimension = "countries" | "devices" | "os" | "browsers" | "regions";
export type Period = "daily" | "weekly" | "monthly" | "yearly" | "regions";

export interface RankRow {
  rank: number;
  key: string;
  label: string;
  icon: string;
  total: number;
  change: number;
  share: number;
}

export interface Rivalry {
  id: string;
  a: { key: string; label: string; icon: string; total: number; rank: number };
  b: { key: string; label: string; icon: string; total: number; rank: number };
  gap: number;
  trend: "rising" | "falling" | "steady";
}

export interface FeedEvent {
  id: string;
  at: string;
  dimension: Dimension;
  label: string;
  icon: string;
  kind: "overtake" | "surge" | "milestone" | "drop";
  message: string;
}

export interface StatsSummary {
  totalVisits: number;
  activeCountries: number;
  trackedRivalries: number;
  onlineNow: number;
  period: Period;
}

export const ALL_DIMENSIONS: Dimension[] = [
  "countries",
  "devices",
  "os",
  "browsers",
  "regions"
];

export const ALL_PERIODS: Period[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "regions"
];

/**
 * Maps a Dimension to the database column name in daily_aggregates.
 * The `bucket` column stores the value we rank on.
 */
export function dimensionToColumn(dim: Dimension): string {
  switch (dim) {
    case "countries":
      return "country";
    case "devices":
      return "device";
    case "os":
      return "os";
    case "browsers":
      return "browser";
    default:
      return "bucket";
  }
}

/**
 * Maps a Dimension to a display icon lookup. Icons come from the database
 * as ISO codes or enum strings — this maps them to emoji for the UI.
 */
export function bucketIcon(dim: Dimension, bucket: string): string {
  // Country flags: just return the ISO code prefixed indicator
  if (dim === "countries") {
    const flags: Record<string, string> = {
      US: "🇺🇸", GB: "🇬🇧", IN: "🇮🇳", BR: "🇧🇷", ID: "🇮🇩", JP: "🇯🇵",
      DE: "🇩🇪", FR: "🇫🇷", CA: "🇨🇦", AU: "🇦🇺", KR: "🇰🇷", MX: "🇲🇽"
    };
    return flags[bucket] ?? "🌍";
  }
  const deviceIcons: Record<string, string> = {
    mobile: "📱", desktop: "🖥️", tablet: "📲", tv: "📺", wearable: "⌚", other: "❓"
  };
  const osIcons: Record<string, string> = {
    android: "🤖", windows: "🪟", ios: "🍎", macos: "💻", linux: "🐧", chromeos: "🌐", other: "❓"
  };
  const browserIcons: Record<string, string> = {
    chrome: "🔵", safari: "🧭", edge: "🔷", firefox: "🦊", opera: "🔴", samsung: "📱", other: "❓"
  };
  const regionIcons: Record<string, string> = {
    na: "🌎", sa: "🌎", eu: "🌍", as: "🌏", af: "🌍", oc: "🌏", other: "🌍"
  };
  const maps: Record<Dimension, Record<string, string>> = {
    countries: {},
    devices: deviceIcons,
    os: osIcons,
    browsers: browserIcons,
    regions: regionIcons
  };
  return maps[dim]?.[bucket] ?? "❓";
}

/**
 * Maps a bucket key to a human-readable label.
 */
export function bucketLabel(dim: Dimension, bucket: string): string {
  if (dim === "countries") {
    const names: Record<string, string> = {
      US: "United States", GB: "United Kingdom", IN: "India", BR: "Brazil",
      ID: "Indonesia", JP: "Japan", DE: "Germany", FR: "France",
      CA: "Canada", AU: "Australia", KR: "South Korea", MX: "Mexico"
    };
    return names[bucket] ?? bucket;
  }
  const labels: Record<string, string> = {
    mobile: "Mobile", desktop: "Desktop", tablet: "Tablet", tv: "Smart TV",
    wearable: "Wearable", other: "Other",
    android: "Android", windows: "Windows", ios: "iOS", macos: "macOS",
    linux: "Linux", chromeos: "ChromeOS",
    chrome: "Chrome", safari: "Safari", edge: "Edge", firefox: "Firefox",
    opera: "Opera", samsung: "Samsung Internet",
    na: "North America", sa: "South America", eu: "Europe",
    as: "Asia", af: "Africa", oc: "Oceania"
  };
  return labels[bucket] ?? bucket;
}

/** Pre-defined head-to-head rivalry pairs for the rivalries view. */
export const RIVALRY_PAIRS: Array<[string, string, string]> = [
  // [countryA, countryB, label]
  ["US", "IN", "USA vs India"],
  ["US", "GB", "USA vs UK"],
  ["BR", "ID", "Brazil vs Indonesia"],
  ["JP", "KR", "Japan vs South Korea"],
  ["DE", "FR", "Germany vs France"],
  ["CA", "AU", "Canada vs Australia"]
];

/**
 * Calculates the date range for a given period.
 */
export function periodRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  switch (period) {
    case "daily": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { start, end };
    }
    case "weekly": {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { start, end };
    }
    case "monthly": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end };
    }
    case "yearly": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end };
    }
    case "regions": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end };
    }
  }
}
