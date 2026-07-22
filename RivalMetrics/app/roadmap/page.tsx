import type { Metadata } from "next";
import { PageHero, Card, Pill, SectionHeading } from "@/components/ui";
import { roadmap } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/roadmap",
  title: "Roadmap",
  description:
    "What's next for RivalMetrics: regional sub-leaderboards, a public API, on-chain donation verification, and more."
});

const statusTone = {
  done: "positive",
  "in-progress": "brand",
  planned: "neutral"
} as const;

const statusLabel = {
  done: "Done",
  "in-progress": "In progress",
  planned: "Planned"
} as const;

export default function RoadmapPage() {
  // Group by quarter, preserving order.
  const quarters = Array.from(new Set(roadmap.map((r) => r.quarter)));

  return (
    <div className="container">
      <PageHero eyebrow="Roadmap" title="Where RivalMetrics is headed">
        <p>
          A living look at what's shipped, what's in progress, and what's
          planned. Dates may shift, but the direction won't.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="rm-roadmap">
          {quarters.map((q) => (
            <div key={q} className="rm-roadmap-quarter">
              <SectionHeading title={q} />
              <div className="grid grid-2">
                {roadmap
                  .filter((r) => r.quarter === q)
                  .map((item) => (
                    <Card key={item.title} className="rm-roadmap-item">
                      <div className="rm-roadmap-head">
                        <h4>{item.title}</h4>
                        <Pill tone={statusTone[item.status]}>
                          {statusLabel[item.status]}
                        </Pill>
                      </div>
                      <p className="muted">{item.description}</p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
