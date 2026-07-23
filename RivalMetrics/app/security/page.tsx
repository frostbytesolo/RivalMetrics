import type { Metadata } from "next";
import { PageHero, Card, SectionHeading, Pill } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/security",
  title: "Security Disclosure",
  description:
    "RivalMetrics security disclosure policy. How we protect your data and how to report vulnerabilities responsibly."
});

export default function SecurityPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Security" title="Security Disclosure">
        <p>
          How we protect the platform and how to report vulnerabilities
          responsibly.
        </p>
      </PageHero>

      <section className="section rm-legal-page" style={{ paddingTop: "0.5rem" }}>
        <SectionHeading title="Our security posture" />

        <div className="grid grid-3">
          {[
            {
              title: "Supabase Row-Level Security",
              body: "All tables are protected by RLS policies. The browser-side client can only read published aggregates — never raw events.",
              icon: "🔐"
            },
            {
              title: "Server-side validation",
              body: "Every write endpoint runs server-side validation, anti-fake heuristics, and rate limiting before touching the database.",
              icon: "✅"
            },
            {
              title: "HTTPS everywhere",
              body: "All traffic is encrypted in transit. No HTTP endpoints are exposed. HSTS is enforced.",
              icon: "🔒"
            }
          ].map((item) => (
            <Card key={item.title} className="rm-value">
              <span className="rm-value-icon" aria-hidden="true">{item.icon}</span>
              <h4>{item.title}</h4>
              <p className="muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section rm-legal-page" style={{ paddingTop: 0 }}>
        <SectionHeading title="Reporting a vulnerability" />

        <Card>
          <h3>Responsible disclosure</h3>
          <p className="muted">
            If you discover a security vulnerability in {site.name}, please
            report it <strong>responsibly</strong> by emailing{" "}
            <a href="mailto:hello@rivalmetrics.app">hello@rivalmetrics.app</a>{" "}
            with the subject line &ldquo;Security: {site.name}&rdquo;.
          </p>
          <p className="muted">
            We ask that you:
          </p>
          <ul>
            <li>Do not publicly disclose the vulnerability before we have had a reasonable time to fix it (typically 90 days).</li>
            <li>Do not access, modify, or delete data belonging to other users.</li>
            <li>Do not degrade service availability (no DoS testing).</li>
            <li>Provide sufficient detail for us to reproduce the issue.</li>
          </ul>

          <h3>What we commit to</h3>
          <ul>
            <li>Acknowledge receipt within 48 hours.</li>
            <li>Keep you updated on remediation progress.</li>
            <li>Credit you in our changelog unless you prefer anonymity.</li>
            <li>Resolve the issue within 90 days or explain the timeline.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
