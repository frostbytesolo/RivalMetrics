import type { Metadata } from "next";
import { PageHero, Card, Pill } from "@/components/ui";
import { changelog } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/changelog",
  title: "Changelog",
  description:
    "Every release of RivalMetrics. New features, privacy improvements, and anti-fake enhancements, version by version."
});

export default function ChangelogPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Changelog" title="Version by version">
        <p>
          A complete record of what changes in RivalMetrics, newest first. No
          silent updates — if it ships, it's here.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <ol className="rm-changelog">
          {changelog.map((entry) => (
            <li key={entry.version} className="rm-changelog-item">
              <Card>
                <div className="rm-changelog-head">
                  <h3>v{entry.version}</h3>
                  <Pill tone="brand">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </Pill>
                </div>
                <ul className="rm-changelog-list">
                  {entry.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
