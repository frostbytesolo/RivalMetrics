import type { Metadata } from "next";
import { PageHero, Card, SectionHeading, Pill } from "@/components/ui";
import { DonationWidget } from "@/components/donation-widget";
import { trustFaq, backups } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/trust",
  title: "Trust",
  description:
    "How RivalMetrics stays privacy-safe, prevents fake data, and keeps donations transparent. Anonymous analytics with verifiable integrity."
});

const pillars: Array<{ title: string; body: string; icon: string }> = [
  {
    title: "Anonymous analytics",
    body: "We never store raw IPs, set cookies, or fingerprint devices. A daily-rotating, one-way hash is the most identifying thing we keep.",
    icon: "🕵️"
  },
  {
    title: "Anti-fake protection",
    body: "IP clustering detection, User-Agent validation, and frequency-based rate limiting drop suspicious events before they reach the leaderboards.",
    icon: "🛡️"
  },
  {
    title: "Donation transparency",
    body: "Every crypto donation is on-chain verifiable. The public counter reflects real contributions and infrastructure spending summaries.",
    icon: "💎"
  },
  {
    title: "Row-level security",
    body: "The Supabase backend is locked down with row-level security policies. Writes only happen through validated server endpoints.",
    icon: "🔐"
  }
];

export default function TrustPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Trust & integrity" title="How we stay trustworthy">
        <p>
          Trust is earned with specifics, not promises. Here's exactly how
          RivalMetrics protects your privacy, prevents manipulation, and keeps
          its donations honest.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="grid grid-4">
          {pillars.map((p) => (
            <Card key={p.title} className="rm-trust-pillar">
              <span className="rm-value-icon" aria-hidden="true">{p.icon}</span>
              <h4>{p.title}</h4>
              <p className="muted">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="Anti-fake"
          title="The pipeline a request goes through"
          description="Every event is validated server-side before it can influence a single ranking."
        />
        <ol className="rm-pipeline">
          <li>
            <Pill tone="brand">1</Pill>
            <div>
              <h4>Inbound request</h4>
              <p className="muted">Visitor hash (not IP) and coarse UA profile are derived at the edge.</p>
            </div>
          </li>
          <li>
            <Pill tone="brand">2</Pill>
            <div>
              <h4>Frequency check</h4>
              <p className="muted">Per-minute and per-hour windows cap how many events a single visitor can send.</p>
            </div>
          </li>
          <li>
            <Pill tone="brand">3</Pill>
            <div>
              <h4>IP clustering</h4>
              <p className="muted">Suspicious bursts from the same network range are flagged and dropped.</p>
            </div>
          </li>
          <li>
            <Pill tone="brand">4</Pill>
            <div>
              <h4>UA detection</h4>
              <p className="muted">Bots, headless browsers, and impossible OS/browser combinations are rejected.</p>
            </div>
          </li>
          <li>
            <Pill tone="brand">5</Pill>
            <div>
              <h4>Aggregation</h4>
              <p className="muted">Only validated events are aggregated into the counts you see on leaderboards.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Backups" title="Data durability" />
        <Card padding={false}>
          <div className="rm-table-wrap">
            <table className="rm-simple-table">
              <thead>
                <tr>
                  <th>Backup</th>
                  <th>Scope</th>
                  <th>Taken</th>
                  <th>Size</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => (
                  <tr key={b.id}>
                    <td><code>{b.id}</code></td>
                    <td><Pill tone={b.scope === "yearly" ? "brand" : "neutral"}>{b.scope}</Pill></td>
                    <td>{new Date(b.takenAt).toLocaleDateString()}</td>
                    <td>{(b.sizeBytes / 1_000_000).toFixed(0)} MB</td>
                    <td className="muted">{b.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="Donations" title="Where the money goes" />
        <DonationWidget />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="FAQ" title="Common trust questions" />
        <div className="rm-faq">
          {trustFaq.map((f) => (
            <Card key={f.q} className="rm-faq-item">
              <h4>{f.q}</h4>
              <p className="muted">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
