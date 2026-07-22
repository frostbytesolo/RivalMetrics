/**
 * Central site configuration — single source of truth for brand, nav,
 * socials, donation addresses, and SEO defaults used across the app.
 */

export const site = {
  name: "RivalMetrics",
  shortName: "RivalMetrics",
  tagline: "Global Rivalry Analytics",
  description:
    "RivalMetrics is a privacy-safe, global rivalry analytics platform. " +
    "Live leaderboards for countries, devices, OS, browsers, and regions — " +
    "updated in real time with anti-fake protection.",
  // Falls back to localhost in dev; override with NEXT_PUBLIC_SITE_URL.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  owner: "FrostByte",
  themeColor: { light: "#ffffff", dark: "#0f0f12" },
  brand: { primary: "#6A4DF5", secondary: "#4A3ACB", accent: "#C9B8FF" },
  locale: "en_US",
  languages: [
    { code: "en", hreflang: "en", label: "English" },
    { code: "x-default", hreflang: "x-default", label: "Default" }
  ]
} as const;

/** Primary navigation used in the header. */
export const mainNav = [
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/rivalries", label: "Rivalries" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About" },
  { href: "/trust", label: "Trust" }
] as const;

/** Footer link groups. */
export const footerNav = {
  Product: [
    { href: "/leaderboards", label: "Leaderboards" },
    { href: "/rivalries", label: "Country Rivalries" },
    { href: "/feed", label: "Live Movement Feed" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/changelog", label: "Changelog" }
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/owner", label: "Owner" },
    { href: "/trust", label: "Trust" },
    { href: "/contact", label: "Contact" }
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/security", label: "Security Disclosure" }
  ]
} as const;

/** FrostByte official socials (display-only; fill in real handles). */
export const socials = [
  { label: "GitHub", href: "https://github.com/frostbyte", handle: "@frostbyte" },
  { label: "X", href: "https://x.com/frostbyte", handle: "@frostbyte" },
  { label: "Email", href: "mailto:hello@rivalmetrics.app", handle: "hello@rivalmetrics.app" }
] as const;

/** Crypto donation addresses (replace with real FrostByte treasury). */
export const donationAddresses = {
  "USDT (TRC20)": "TX9Z...FROSTBYTE",
  Bitcoin: "bc1q...frostbyte",
  Ethereum: "0xFRO...5TByTe",
  "USDC (ERC-20)": "0xFRO...5TByTe",
  "BNB (BEP-20)": "0xFRO...5TByTe"
} as const;

/** FrostByte ownership verification hash (replace with signed proof). */
export const ownerVerificationHash = "0xRM7F3D2A9C1B4E8F5D0A6C3B9E2F1A7D8C4B6E0";

export type SiteConfig = typeof site;
