import Link from "next/link";
import { Leaderboard } from "@/components/leaderboard";
import { LiveFeed } from "@/components/live-feed";
import { RivalryCard } from "@/components/rivalry-card";
import { DonationWidget } from "@/components/donation-widget";
import { StatCard } from "@/components/stat-card";
import { TrustBadge } from "@/components/trust-badge";
import { Button, Card, PageHero, SectionHeading } from "@/components/ui";
import { queryFeed, queryLeaderboard, queryRivalries, queryStats } from "@/lib/queries";
import { formatCompact, formatNumber } from "@/lib/utils";

export default async function HomePage() {
  const [stats, rivalries, feed, topCountries] = await Promise.all([
    queryStats("monthly"),
    queryRivalries(),
    queryFeed(12),
    queryLeaderboard("countries", "monthly", 5)
  ]);

  const hasStats = stats.totalVisits > 0;

  return (
    <div className="container">
      <PageHero eyebrow="Global Rivalry Metrics — Live" title="The world's rivalries, measured.">
        <p>
          Real-time leaderboards across countries, devices, OS, browsers, and regions.
          Privacy-safe by design — no cookies, no fingerprinting, no personal data,
          and no fabricated numbers.
        </p>
        <div className="rm-hero-actions">
          <Button href="/leaderboards">Explore leaderboards</Button>
          <Button href="/donate" variant="secondary">Support the project</Button>
        </div>
      </PageHero>

      {/* Donation banner */}
      <div className="donate-banner rm-fade-in">
        <p>
          <strong>RivalMetrics is community-funded.</strong>{" "}
          Every contribution keeps the data flowing and ad-free.
        </p>
        <Link href="/donate" className="rm-mini-cta">Donate →</Link>
      </div>

      {/* Top-line stats */}
      <section className="section" style={{ paddingTop: "1rem", paddingBottom: "1.5rem" }}>
        {hasStats ? (
          <div className="grid grid-4">
            <StatCard
              label="Visits this month"
              value={formatCompact(stats.totalVisits)}
              hint={formatNumber(stats.totalVisits)}
              icon="📊"
            />
            <StatCard
              label="Active countries"
              value={stats.activeCountries}
              hint="Tracked globally"
              icon="🌍"
            />
            <StatCard
              label="Tracked rivalries"
              value={stats.trackedRivalries}
              hint="Head-to-head"
              icon="⚔️"
            />
            <StatCard
              label="Online now"
              value={formatNumber(stats.onlineNow)}
              hint="Last 60 seconds"
              icon="🟢"
            />
          </div>
        ) : (
          <Card className="rm-empty-state">
            <span className="rm-empty-icon" aria-hidden="true">📊</span>
            <h3>Collecting real data</h3>
            <p>
              Stats will populate here as real visits flow in. RivalMetrics never
              fabricates numbers — every count is derived from actual, validated events.
            </p>
          </Card>
        )}
      </section>

      {/* Leaderboard + Live feed */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="rm-split">
          <div className="rm-split-main">
            <SectionHeading
              eyebrow="Leaderboards"
              title="Who's on top right now"
              description="Switch between countries, devices, OS, browsers, and regions across daily, weekly, monthly, and yearly views."
            />
            <Leaderboard initialDimension="countries" initialPeriod="monthly" limit={8} />
            <p className="rm-section-foot">
              <Link href="/leaderboards">View full leaderboards →</Link>
            </p>
          </div>
          <aside className="rm-split-aside">
            <LiveFeed initial={feed} limit={12} />
          </aside>
        </div>
      </section>

      {/* Country rivalries */}
      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="Country Rivalries"
          title="The head-to-head that matters"
          description="Visit gaps, rank differences, and momentum between the world's most active rivals."
        />
        {rivalries.length > 0 ? (
          <div className="grid grid-3">
            {rivalries.map((r) => (
              <RivalryCard key={r.id} rivalry={r} />
            ))}
          </div>
        ) : (
          <Card className="rm-empty-state">
            <span className="rm-empty-icon" aria-hidden="true">⚔️</span>
            <h3>No rivalries to show yet</h3>
            <p>
              Head-to-head cards appear once enough real country data exists to
              compute meaningful gaps. No data is invented.
            </p>
          </Card>
        )}
        {rivalries.length > 0 && (
          <p className="rm-section-foot">
            <Link href="/rivalries">All rivalries →</Link>
          </p>
        )}
      </section>

      {/* Trust + donate row */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid grid-2">
          <Card className="rm-home-trust">
            <div className="rm-home-trust-head">
              <h3>Built private. Verified transparent.</h3>
              <TrustBadge />
            </div>
            <ul className="rm-check-list">
              <li><span aria-hidden="true">✓</span> No personal data, no cookies, no fingerprinting</li>
              <li><span aria-hidden="true">✓</span> Anti-fake: IP clustering, UA, and frequency checks</li>
              <li><span aria-hidden="true">✓</span> Supabase backend with row-level security</li>
              <li><span aria-hidden="true">✓</span> Open methodology and public changelog</li>
            </ul>
            <Button href="/trust" variant="secondary">Read the trust page</Button>
          </Card>

          <DonationWidget />
        </div>
      </section>

      {/* Top countries quick list */}
      <section className="section" style={{ paddingTop: 0 }}>
        {topCountries.length > 0 ? (
          <Card>
            <div className="rm-quick-head">
              <h3>Top 5 countries</h3>
              <Link href="/leaderboards" className="rm-link">Full ranking →</Link>
            </div>
            <ol className="rm-quick-list">
              {topCountries.map((c) => (
                <li key={c.key}>
                  <span className="rm-quick-rank">#{c.rank}</span>
                  <span className="rm-quick-icon" aria-hidden="true">{c.icon}</span>
                  <span className="rm-quick-name">{c.label}</span>
                  <span className="rm-quick-total">{formatCompact(c.total)}</span>
                </li>
              ))}
            </ol>
          </Card>
        ) : (
          <Card className="rm-empty-state">
            <span className="rm-empty-icon" aria-hidden="true">🌍</span>
            <h3>No country data yet</h3>
            <p>
              The top-5 list populates as real visits arrive from different countries.
              Check back soon — or explore the <Link href="/leaderboards">full leaderboards</Link>.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
