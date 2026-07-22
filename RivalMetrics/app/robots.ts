import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.ts — Next.js generates /robots.txt at build time.
 * Allows all crawlers and points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: `${site.url}/sitemap.xml`
  };
}
