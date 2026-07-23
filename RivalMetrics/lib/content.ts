/**
 * Static content collections: badges, roadmap, changelog, backups, FAQ.
 * Kept in code (not the DB) because they're editorial, not transactional.
 */

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const badges: Badge[] = [
  {
    id: "donor",
    label: "Donor",
    description: "Contributed to RivalMetrics infrastructure.",
    icon: "💜"
  },
  {
    id: "streak-master",
    label: "Streak Master",
    description: "Maintained a 30-day visit streak.",
    icon: "🔥"
  },
  {
    id: "top-contributor",
    label: "Top Contributor",
    description: "Ranked #1 in a tracked rivalry for a month.",
    icon: "🏆"
  },
  {
    id: "early-supporter",
    label: "Early Supporter",
    description: "Joined during the launch month.",
    icon: "🌱"
  },
  {
    id: "rivalry-champion",
    label: "Rivalry Champion",
    description: "Backed the winning side of a head-to-head rivalry.",
    icon: "⚔️"
  }
];

export interface RoadmapItem {
  quarter: string;
  status: "done" | "in-progress" | "planned";
  title: string;
  description: string;
}

export const roadmap: RoadmapItem[] = [
  {
    quarter: "Q1 2026",
    status: "done",
    title: "Public analytics launch",
    description: "Global leaderboards, country rivalries, and the live movement feed."
  },
  {
    quarter: "Q1 2026",
    status: "done",
    title: "Anti-fake protection",
    description: "IP clustering, UA detection, and frequency-based rate limiting."
  },
  {
    quarter: "Q2 2026",
    status: "in-progress",
    title: "Supabase real-time ingestion",
    description: "Edge-collected events streamed into Supabase with RLS-protected aggregates."
  },
  {
    quarter: "Q2 2026",
    status: "in-progress",
    title: "Verified donation tracking",
    description: "On-chain verification of crypto donations with a transparent counter."
  },
  {
    quarter: "Q3 2026",
    status: "planned",
    title: "Regional sub-leaderboards",
    description: "Drill into state/province-level rivalries for top countries."
  },
  {
    quarter: "Q3 2026",
    status: "planned",
    title: "Public read-only API",
    description: "Documented REST API for researchers and the community."
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    title: "Annual report builder",
    description: "Exportable yearly summaries and custom date-range comparisons."
  }
];

export interface ChangelogEntry {
  version: string;
  date: string;
  highlights: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.4.0",
    date: "2026-07-20",
    highlights: [
      "Public analytics platform live with global leaderboards.",
      "Anti-fake protection deployed across all ingestion endpoints.",
      "Privacy-safe daily visitor hashing (no cookies, no fingerprinting)."
    ]
  },
  {
    version: "0.3.0",
    date: "2026-06-02",
    highlights: [
      "Added country rivalry head-to-head cards.",
      "Introduced streak and badge systems.",
      "Dark mode default for first-time visitors who prefer it."
    ]
  },
  {
    version: "0.2.0",
    date: "2026-04-15",
    highlights: [
      "Leaderboard tabs: daily, weekly, monthly, yearly, regions.",
      "Donation counter and crypto donation page."
    ]
  },
  {
    version: "0.1.0",
    date: "2026-02-01",
    highlights: ["Initial FrostByte internal release."]
  }
];

export interface BackupEntry {
  id: string;
  scope: "monthly" | "yearly";
  takenAt: string;
  sizeBytes: number;
  location: string;
}

export const backups: BackupEntry[] = [
  {
    id: "bk-2026-07",
    scope: "monthly",
    takenAt: "2026-07-01T03:00:00Z",
    sizeBytes: 184_320_000,
    location: "Supabase storage · encrypted"
  },
  {
    id: "bk-2026-06",
    scope: "monthly",
    takenAt: "2026-06-01T03:00:00Z",
    sizeBytes: 171_400_000,
    location: "Supabase storage · encrypted"
  },
  {
    id: "bk-2025-yearly",
    scope: "yearly",
    takenAt: "2026-01-01T03:00:00Z",
    sizeBytes: 1_980_000_000,
    location: "Cold storage · encrypted"
  }
];

export interface FaqItem {
  q: string;
  a: string;
}

export const trustFaq: FaqItem[] = [
  {
    q: "Do you track who I am?",
    a: "No. We never store raw IPs, set cookies, or fingerprint your device. The only thing we keep is a one-way, daily-rotating hash that lets us count unique visitors for a single day — and nothing more."
  },
  {
    q: "How does anti-fake protection work?",
    a: "Every event is run through server-side heuristics: IP clustering, User-Agent detection, and frequency checks. Suspicious events are dropped before they ever reach the leaderboard."
  },
  {
    q: "Are donations transparent?",
    a: "Yes. Every donation is verifiable on-chain, and the donation counter on the home page reflects the live total. We publish infrastructure spending summaries alongside it."
  },
  {
    q: "Who owns the data?",
    a: "Aggregates are owned by RivalMetrics and published openly. There is no personal data to own — we never collect any."
  }
];
