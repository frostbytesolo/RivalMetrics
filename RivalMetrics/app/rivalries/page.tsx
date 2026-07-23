import type { Metadata } from "next";
import { RivalryCard } from "@/components/rivalry-card";
import { PageHero, SectionHeading, Card } from "@/components/ui";
import { queryRivalries } from "@/lib/queries";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/rivalries",
  title: "Country Rivalries",
  description:
    "Head-to-head country rivalries ranked by visit difference, rank gap, and momentum. See who's pulling ahead in real time."
});

export default async function RivalriesPage() {
  const rivalries = await queryRivalries();

  return (
    <div className="container">
      <PageHero eyebrow="Head-to-head" title="Country Rivalries">
        <p>
          The world's most active rivalries, measured by visit volume and rank
          momentum. Each card shows the gap, the rank difference, and whether
          the lead is growing.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        {rivalries.length > 0 ? (
          <>
            <SectionHeading title="Active rivalries" />
            <div className="grid grid-3">
              {rivalries.map((r) => (
                <RivalryCard key={r.id} rivalry={r} />
              ))}
            </div>
          </>
        ) : (
          <Card className="rm-empty-state">
            <span className="rm-empty-icon" aria-hidden="true">⚔️</span>
            <h3>No rivalries to show yet</h3>
            <p>
              Rivalry cards appear once enough real country data exists to
              compute meaningful gaps between paired nations. We never
              fabricate comparisons — check back as traffic builds.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
