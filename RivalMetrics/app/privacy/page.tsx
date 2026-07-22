import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "RivalMetrics privacy policy. No personal data, no cookies, no fingerprinting. Anonymous analytics only.",
  noindex: false
});

export default function PrivacyPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Legal" title="Privacy Policy">
        <p>Last updated: July 2026</p>
      </PageHero>

      <section className="section prose rm-legal-page" style={{ paddingTop: "0.5rem" }}>
        <h2>1. Introduction</h2>
        <p>
          {site.name} is operated by {site.owner} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
          This Privacy Policy explains what data we collect, how we use it, and
          what rights you have. We keep it short because we keep almost nothing.
        </p>

        <h2>2. What we collect</h2>
        <p>
          <strong>Nothing personal.</strong> RivalMetrics does not collect names,
          email addresses, device identifiers, advertising identifiers, precise
          geolocation, browsing history, or any other personal data.
        </p>
        <p>Specifically, we do <strong>not</strong> collect:</p>
        <ul>
          <li>Cookies of any kind</li>
          <li>Browser fingerprint hashes (canvas, WebGL, font probing)</li>
          <li>IP addresses in a stored, reversible form</li>
          <li>Email addresses unless you voluntarily send one through the contact form</li>
          <li>Any form of persistent cross-session identifier</li>
        </ul>
        <p>
          The only data we process for analytics purposes is a <strong>one-way,
          daily-rotating SHA-256 hash</strong> derived from a coarse network
          identifier. This hash changes every calendar day and cannot be
          reversed to identify an individual. It exists solely to count unique
          daily visitors.
        </p>

        <h2>3. How we use data</h2>
        <p>
          We aggregate the hashed visitor counts into dimension-specific
          leaderboards (countries, devices, OS, browsers, regions). These
          aggregates are the only thing we publish or store long-term.
        </p>

        <h2>4. Data retention</h2>
        <p>
          The one-way daily hash expires at the end of each calendar day and
          is never stored beyond the current aggregation window. Aggregate
          counts are retained indefinitely as part of the public leaderboards.
        </p>
        <p>
          Contact form submissions are processed only to respond to your
          inquiry and deleted after 90 days. Donation transaction records are
          public on-chain and are not stored by us beyond the on-chain ledger.
        </p>

        <h2>5. Third parties</h2>
        <p>
          We use <strong>Supabase</strong> as our database host. All data
          stored there is protected by row-level security and HTTPS. We use
          no analytics trackers, advertising networks, or third-party data
          processors.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Because we do not collect personal data, there is no data to
          access, correct, delete, or port. If you believe we hold something
          we shouldn't, contact us at the addresses on the{" "}
          <a href="/contact">contact page</a> and we will investigate
          immediately.
        </p>

        <h2>7. Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will
          be noted in the <a href="/changelog">changelog</a>. Continued use
          of {site.name} after a change constitutes acceptance of the revised
          policy.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about this policy? <a href="/contact">Reach out</a> or
          email <a href="mailto:hello@rivalmetrics.app">hello@rivalmetrics.app</a>.
        </p>
      </section>
    </div>
  );
}
