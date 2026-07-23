import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/terms",
  title: "Terms of Service",
  description:
    "RivalMetrics terms of service. Community-funded, open-source global rivalry analytics by FrostByte."
});

export default function TermsPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Legal" title="Terms of Service">
        <p>Last updated: July 2026</p>
      </PageHero>

      <section className="section prose rm-legal-page" style={{ paddingTop: "0.5rem" }}>
        <h2>1. Acceptance</h2>
        <p>
          By accessing {site.name}, you agree to these Terms of Service
          (&ldquo;Terms&rdquo;). If you disagree with any part, do not use the
          service.
        </p>

        <h2>2. Description</h2>
        <p>
          {site.name} is a free, open-source, privacy-safe global rivalry
          analytics platform operated by {site.owner}. It publishes aggregate
          leaderboards and head-to-head rivalry metrics. It does not track
          individuals.
        </p>

        <h2>3. Use of the service</h2>
        <p>You may use {site.name} to:</p>
        <ul>
          <li>View published analytics, leaderboards, and rivalries</li>
          <li>Submit voluntary contact messages</li>
          <li>Make voluntary cryptocurrency donations</li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>Attempt to manipulate, spam, or artificially inflate any leaderboard metric</li>
          <li>Scrape or redistribute the data in bulk without written permission</li>
          <li>Impersonate {site.owner} or claim affiliation falsely</li>
          <li>Attempt to compromise the platform's security or availability</li>
        </ul>

        <h2>4. Donations</h2>
        <p>
          Donations are voluntary, non-refundable, and carry no entitlement to
          ownership, equity, voting rights, or service guarantees. Donations are
          recorded on-chain and are not refundable once confirmed.
        </p>

        <h2>5. Intellectual property</h2>
        <p>
          The {site.name} name, logo, codebase, and published design are
          property of {site.owner}. Aggregate data and leaderboard rankings are
          published under a permissive license — see the repository for details.
        </p>

        <h2>6. Disclaimer</h2>
        <p>
          {site.name} is provided &ldquo;as is&rdquo; without warranty of any
          kind, express or implied. {site.owner} does not guarantee the
          accuracy, completeness, or timeliness of any published metric.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          {site.owner} shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of
          {site.name}, including but not limited to decisions made based on
          published rankings.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may revise these Terms at any time. Changes are reflected in
          the <a href="/changelog">changelog</a> and effective immediately
          upon publication.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These Terms are governed by the laws applicable to {site.owner}'s
          registered jurisdiction. Any disputes shall be resolved in the
          courts of that jurisdiction.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions? <a href="/contact">Reach out</a>.
        </p>
      </section>
    </div>
  );
}
