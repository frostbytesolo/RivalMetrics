/**
 * SEO metadata builders. Centralized so every page produces consistent
 * Open Graph / Twitter / canonical tags, which is what the Lighthouse SEO
 * audit checks for.
 */

import type { Metadata } from "next";
import { site } from "./site";
import { absUrl } from "./utils";

interface PageMetaInput {
  path: string;
  title: string;
  description?: string;
  /** Mark pages we don't want indexed (legal stubs, etc.). */
  noindex?: boolean;
}

export function pageMeta({ path, title, description, noindex }: PageMetaInput): Metadata {
  const url = absUrl(path);
  const fullTitle =
    title === site.name ? site.name : `${title} · ${site.name}`;
  const desc = description ?? site.description;

  const ogImages = [
    {
      url: absUrl("/og.svg"),
      width: 1200,
      height: 630,
      alt: `${site.name} — ${site.tagline}`,
      type: "image/svg+xml" as const
    }
  ];

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        "x-default": url
      }
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description: desc,
      locale: site.locale,
      images: ogImages
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [absUrl("/og.svg")]
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    icons: {
      icon: [
        { url: "/icons/favicon.svg", type: "image/svg+xml" },
        { url: "/icons/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
        { url: "/icons/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" }
      ],
      apple: [{ url: "/icons/apple-touch-icon.svg", sizes: "180x180" }]
    },
    manifest: "/manifest.json"
  };
}

/** Organization JSON-LD used on the homepage for rich results. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absUrl("/icons/favicon.svg"),
    description: site.description,
    founder: { "@type": "Organization", name: site.owner }
  };
}

/** WebSite JSON-LD with SearchAction placeholder. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    publisher: { "@type": "Organization", name: site.owner }
  };
}
