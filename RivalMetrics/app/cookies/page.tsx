import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/cookies",
  title: "Cookie Policy",
  description:
    "RivalMetrics cookie policy. We do not use cookies."
});

export default function CookiesPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Legal" title="Cookie Policy">
        <p>Last updated: July 2026</p>
      </PageHero>

      <section className="section prose rm-legal-page" style={{ paddingTop: "0.5rem" }}>
        <h2>Short version</h2>
        <p>
          <strong>{site.name} does not use cookies.</strong> Not first-party,
          not third-party, not analytics, not advertising, not essential. None.
        </p>

        <h2>What this means for you</h2>
        <p>
          Because {site.name} sets no cookies, you don't need a cookie banner,
          consent dialog, or cookie preferences panel. Your browser's default
          settings are all you need.
        </p>

        <h2>How we track visitors without cookies</h2>
        <p>
          Instead of cookies, we derive a <strong>one-way, daily-rotating
          SHA-256 hash</strong> from a coarse network identifier provided by
          your ISP or CDN (e.g., a /24 subnet or country header). This hash:
        </p>
        <ul>
          <li>Cannot be reversed to identify you</li>
          <li>Changes every calendar day, so it cannot track you over time</li>
          <li>Contains no personal data whatsoever</li>
          <li>Is stored only long enough to aggregate into daily counts</li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          We use <strong>Supabase</strong> for data storage. Supabase may
          set its own functional cookies for authentication, but since
          {site.name} never authenticates visitors, no Supabase cookies
          are set in your browser by using this site.
        </p>

        <h2>Changes</h2>
        <p>
          If we ever introduce cookies for any reason, this page will be
          updated and a notice will be added to the <a href="/changelog">changelog</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? <a href="/contact">Reach out</a>.
        </p>
      </section>
    </div>
  );
}
