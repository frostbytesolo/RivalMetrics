import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeScript } from "@/components/theme-script";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { site } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.owner,
  publisher: site.owner,
  keywords: [
    "rivalry analytics",
    "global analytics",
    "leaderboard",
    "country rankings",
    "device analytics",
    "browser market share",
    "privacy-safe analytics",
    "FrostByte"
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/changelog"
    }
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: site.locale,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: site.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: site.themeColor.dark }
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1
};

const jsonLd = [organizationJsonLd(), websiteJsonLd()];

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {jsonLd.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AnalyticsBeacon />
        <Header />
        <main id="main" className="rm-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
