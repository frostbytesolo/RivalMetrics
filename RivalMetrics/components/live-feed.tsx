"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedEvent } from "@/lib/data";
import { formatRelative, cx } from "@/lib/utils";
import { Card } from "./ui";
import styles from "./live-feed.module.css";

/**
 * Live movement feed. Fetches real events from /feed (which reads the
 * feed_events table). Shows an honest empty state when there's nothing yet.
 */
export function LiveFeed({
  initial = [],
  limit = 20
}: {
  initial?: FeedEvent[];
  limit?: number;
}) {
  const [events, setEvents] = useState<FeedEvent[]>(initial.slice(0, limit));
  const [now, setNow] = useState(() => Date.now());
  const [paused, setPaused] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const tick = useCallback(async () => {
    try {
      const res = await fetch(`/feed?limit=${limit}&t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.ok) return;
      const data = (await res.json()) as { events: FeedEvent[] };
      if (Array.isArray(data.events)) {
        setEvents(data.events.slice(0, limit));
      }
    } catch {
      /* network failures are silent; initial state stays on screen */
    }
    setNow(Date.now());
    setHasFetched(true);
  }, [limit]);

  useEffect(() => {
    tick(); // fetch once on mount
    if (paused) return;
    const id = window.setInterval(tick, 6000);
    return () => window.clearInterval(id);
  }, [tick, paused]);

  return (
    <Card className={styles.wrap} padding={false}>
      <header className={styles.head}>
        <div className={styles.title}>
          <span className={styles.liveDot} aria-hidden="true" />
          <h3>Live Movement</h3>
        </div>
        <button
          type="button"
          className={styles.pauseBtn}
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </header>

      {events.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">📡</span>
          <h4>{hasFetched ? "Nothing moving yet" : "Connecting…"}</h4>
          <p>
            Movement events appear here in real time as rankings shift.
            We never fabricate feed items — check back once traffic builds.
          </p>
        </div>
      ) : (
        <ol className={styles.list} aria-live="polite" aria-label="Live movement feed">
          {events.map((evt) => (
            <li key={evt.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">{evt.icon}</span>
              <div className={styles.body}>
                <p className={styles.message}>
                  <KindTag kind={evt.kind} />
                  <span className={styles.text}>{evt.message}</span>
                </p>
                <p className={styles.meta}>
                  <span className={styles.dim}>{prettyDim(evt.dimension)}</span>
                  <span className={styles.sep}>·</span>
                  <time dateTime={evt.at}>{formatRelative(evt.at, now)} ago</time>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function KindTag({ kind }: { kind: FeedEvent["kind"] }) {
  const map: Record<FeedEvent["kind"], { label: string; tone: string }> = {
    overtake: { label: "Overtake", tone: "brand" },
    surge: { label: "Surge", tone: "positive" },
    milestone: { label: "Milestone", tone: "warning" },
    drop: { label: "Drop", tone: "negative" }
  };
  const { label, tone } = map[kind];
  return <span className={cx(styles.kindTag, styles[`tone_${tone}`])}>{label}</span>;
}

function prettyDim(d: string): string {
  return d[0].toUpperCase() + d.slice(1);
}
