import type { Metadata } from "next";
import { LiveFeed } from "@/components/live-feed";
import { PageHero } from "@/components/ui";
import { queryFeed } from "@/lib/queries";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/feed",
  title: "Live Movement Feed",
  description:
    "A real-time feed of overtakes, surges, milestones, and drops across every dimension RivalMetrics tracks."
});

export default async function FeedPage() {
  const initial = await queryFeed(20);
  return (
    <div className="container">
      <PageHero eyebrow="Real-time" title="Live Movement Feed">
        <p>
          The latest movements across all leaderboards. Updates automatically —
          sit back and watch the rankings shift. No event is ever fabricated.
        </p>
      </PageHero>
      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="rm-feed-narrow">
          <LiveFeed initial={initial} limit={20} />
        </div>
      </section>
    </div>
  );
}
