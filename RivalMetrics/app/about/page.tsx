import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PageHero, Card, SectionHeading, Button } from "@/components/ui";
import { socials, site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/about",
  title: "About",
  description:
    "RivalMetrics is an open-source, privacy-safe global rivalry analytics platform built by FrostByte."
});

const values: Array<{ title: string; body: string; icon: string }> = [
  {
    title: "Precision",
    body: "Every number is computed from verified, anti-fake-checked events. No estimates dressed up as fact.",
    icon: "🎯"
  },
  {
    title: "Transparency",
    body: "Our methodology is public. Our changelog is public. Our donation counter is on-chain verifiable.",
    icon: "🔍"
  },
  {
    title: "Global reach",
    body: "Leaderboards span every continent. If something is being used, we're measuring it.",
    icon: "🌍"
  },
  {
    title: "Clean analytics",
    body: "No tracking pixels, no third-party scripts, no behavioral profiling. Just counts.",
    icon: "✨"
  },
  {
    title: "Privacy-safe",
    body: "No personal data, no cookies, no fingerprinting. A daily-rotating hash is all we keep.",
    icon: "🔒"
  },
  {
    title: "FrostByte engineering",
    body: "Built to the engineering standard of FrostByte: accessible, fast, and built to last.",
    icon: "❄️"
  }
];

export default function AboutPage() {
  return (
    <div className="container">
      <PageHero eyebrow="About" title="What is RivalMetrics?">
        <p>
          RivalMetrics is an open-source, privacy-safe global rivalry analytics
          platform. It tracks how the world uses technology — countries,
          devices, operating systems, browsers, and regions — and turns those
          counts into live leaderboards and head-to-head rivalries.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <Card className="rm-about-intro">
          <div className="rm-about-logo">
            <Logo size={56} href={null} />
          </div>
          <div className="rm-about-text">
            <h3>The project</h3>
            <p>
              RivalMetrics was created by <strong>{site.owner}</strong> to
              answer a simple question: who is actually winning, globally,
              right now? Existing analytics tools were either closed, ad-driven,
              privacy-invasive, or all three. RivalMetrics is the opposite:
              open methodology, community-funded, and designed so the people
              being measured can't be identified.
            </p>
            <p>
              It is, and will remain, <strong>open-source</strong>. The
              methodology, the anti-fake heuristics, and the data model are all
              published. What we don't publish is anything about you.
            </p>
          </div>
        </Card>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="Core values"
          title="What we stand for"
        />
        <div className="grid grid-3">
          {values.map((v) => (
            <Card key={v.title} className="rm-value">
              <span className="rm-value-icon" aria-hidden="true">{v.icon}</span>
              <h4>{v.title}</h4>
              <p className="muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Card className="rm-about-cta">
          <div>
            <h3>Open source</h3>
            <p className="muted">
              RivalMetrics is built in the open. Read the methodology, file an
              issue, or contribute. The code and the data model are public.
            </p>
          </div>
          <div className="rm-about-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rm-about-social"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Card>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="rm-about-actions">
          <Button href="/trust">Read the trust page</Button>
          <Button href="/owner" variant="secondary">Who owns RivalMetrics?</Button>
          <Link href="/changelog" className="rm-link">View changelog →</Link>
        </div>
      </section>
    </div>
  );
}
