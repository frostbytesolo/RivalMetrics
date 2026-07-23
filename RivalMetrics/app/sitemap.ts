import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Dynamic sitemap.ts — Next.js generates /sitemap.xml at build time.
 * Lists all public pages with their change frequency and priority.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const pages: Array<{ path: string; priority: number; changeFreq: string }> = [
    { path: "/", priority: 1, changeFreq: "hourly" },
    { path: "/leaderboards", priority: 0.9, changeFreq: "hourly" },
    { path: "/rivalries", priority: 0.8, changeFreq: "daily" },
    { path: "/feed", priority: 0.7, changeFreq: "always" },
    { path: "/donate", priority: 0.7, changeFreq: "monthly" },
    { path: "/about", priority: 0.6, changeFreq: "monthly" },
    { path: "/owner", priority: 0.5, changeFreq: "monthly" },
    { path: "/trust", priority: 0.7, changeFreq: "monthly" },
    { path: "/roadmap", priority: 0.5, changeFreq: "monthly" },
    { path: "/changelog", priority: 0.5, changeFreq: "monthly" },
    { path: "/contact", priority: 0.4, changeFreq: "yearly" },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" },
    { path: "/cookies", priority: 0.3, changeFreq: "yearly" },
    { path: "/security", priority: 0.4, changeFreq: "yearly" }
  ];

  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: p.priority
  }));
}
