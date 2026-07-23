import type { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard";
import { StatCard } from "@/components/stat-card";
import { PageHero, SectionHeading, Card } from "@/components/ui";
import { queryStats } from "@/lib/queries";
import { pageMeta } from "@/lib/metadata";
import { formatCompact } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  path: "/leaderboards",
  title: "Global Leaderboards",
  description:
    "Live global leaderboards for countries, devices, operating systems, browsers, and regions. Daily, weekly, monthly, and yearly rankings."
});

export default async function LeaderboardsPage() {
  const stats = await queryStats("yearly");

  return (
    <div className="container">
      <PageHero eyebrow="Global rankings" title="Leaderboards">
        <p>
          The complete picture across every dimension RivalMetrics tracks.
          Pick a dimension and a timeframe to see who's leading the world.
        </p>
      </PageHero>

      {stats.totalVisits > 0 && (
        <section className="section" style={{ paddingTop: "0.5rem" }}>
          <div className="grid grid-4">
            <StatCard label="Yearly visits" value={formatCompact(stats.totalVisits)} icon="📅" />
            <StatCard label="Countries" value={stats.activeCountries} icon="🌍" />
            <StatCard label="Dimensions" value={5} hint="Countries · Devices · OS · Browsers · Regions" />
            <StatCard label="Periods" value={4} hint="Daily · Weekly · Monthly · Yearly" />
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading
          title="Full leaderboards"
          description="Tabs at the top switch dimensions; the second row switches time period."
        />
        <Leaderboard initialDimension="countries" initialPeriod="monthly" />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Card className="rm-prose-narrow">
          <h3>How rankings are calculated</h3>
          <p className="muted">
            Rankings are derived from privacy-safe visit counts. Each visit is
            represented only by a daily-rotating, one-way hash of the visitor's
            coarse network identifier — never raw IPs, cookies, or device
            fingerprints. Events that fail anti-fake heuristics (IP clustering,
            User-Agent detection, frequency limits) are dropped before they
            reach these numbers.
          </p>
          <p className="muted">
            For the current day and week, counts are aggregated live from the
            events table in real time. Monthly and yearly views read from a
            precomputed rollup. If a leaderboard is empty, it's because there
            isn't enough real data yet — never because we invented any.
          </p>
        </Card>
      </section>
    </div>
  );
}
