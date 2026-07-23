"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ALL_DIMENSIONS,
  ALL_PERIODS,
  type Dimension,
  type Period,
  type RankRow
} from "@/lib/data";
import { formatCompact, formatNumber, cx } from "@/lib/utils";
import { Card } from "./ui";
import styles from "./leaderboard.module.css";

/**
 * Leaderboard widget. Fetches real data from /api/leaderboard.
 * Shows an honest "collecting data" state when no rows are returned.
 */
export function Leaderboard({
  initialDimension = "countries",
  initialPeriod = "monthly",
  showTabs = true,
  limit
}: {
  initialDimension?: Dimension;
  initialPeriod?: Period;
  showTabs?: boolean;
  limit?: number;
}) {
  const [dim, setDim] = useState<Dimension>(initialDimension);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [rows, setRows] = useState<RankRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dimension: dim,
        period,
        limit: String(limit ?? 50)
      });
      const res = await fetch(`/api/leaderboard?${params}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.rows)) {
        setRows(data.rows);
      }
    } catch {
      /* network error — keep previous state */
    } finally {
      setLoading(false);
    }
  }, [dim, period, limit]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Re-fetch periodically to stay live.
  useEffect(() => {
    const id = window.setInterval(fetchRows, 30_000);
    return () => window.clearInterval(id);
  }, [fetchRows]);

  return (
    <Card className={styles.wrap} padding={false}>
      {showTabs && (
        <div className={styles.controls}>
          <div className={styles.tabGroup} role="tablist" aria-label="Dimension">
            {ALL_DIMENSIONS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={dim === d}
                className={cx(styles.tab, dim === d && styles.tabActive)}
                onClick={() => setDim(d)}
              >
                {capitalize(d)}
              </button>
            ))}
          </div>
          <div className={styles.tabGroup} role="tablist" aria-label="Period">
            {ALL_PERIODS.map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={period === p}
                className={cx(styles.tab, period === p && styles.tabActive)}
                onClick={() => setPeriod(p)}
              >
                {capitalize(p)}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && rows.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptySpinner} aria-hidden="true" />
          <p>Loading rankings…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">📊</span>
          <h3>No data yet</h3>
          <p>
            Rankings will appear here once events start flowing in.
            We never fabricate numbers — these counts come from real visits.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">
              {capitalize(dim)} leaderboard — {period} totals
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.rankCol}>#</th>
                <th scope="col" className={styles.nameCol}>{capitalize(dim)}</th>
                <th scope="col" className={styles.numCol}>Total</th>
                <th scope="col" className={styles.numCol}>Movement</th>
                <th scope="col" className={styles.shareCol}>Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const trend = row.change > 0 ? "up" : row.change < 0 ? "down" : "flat";
                return (
                  <tr key={row.key} className={styles.row}>
                    <td className={styles.rankCol}>
                      <span className={styles.rankBadge} data-trend={trend}>
                        {row.rank}
                      </span>
                    </td>
                    <th scope="row" className={styles.nameCol}>
                      <span className={styles.icon} aria-hidden="true">{row.icon}</span>
                      <span className={styles.label}>{row.label}</span>
                    </th>
                    <td className={styles.numCol} data-label="Total">
                      <span className={styles.total}>{formatCompact(row.total)}</span>
                      <span className={styles.totalLong}>{formatNumber(row.total)}</span>
                    </td>
                    <td className={styles.numCol} data-label="Movement">
                      <MovementBadge change={row.change} />
                    </td>
                    <td className={styles.shareCol} data-label="Share">
                      <div className={styles.shareBar}>
                        <div
                          className={styles.shareFill}
                          style={{ width: `${Math.min(100, row.share)}%` }}
                        />
                        <span className={styles.shareText}>
                          {row.share.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function MovementBadge({ change }: { change: number }) {
  if (change === 0) {
    return <span className={cx(styles.move, styles.moveFlat)}>—</span>;
  }
  const positive = change > 0;
  return (
    <span
      className={cx(styles.move, positive ? styles.moveUp : styles.moveDown)}
      title={`${positive ? "+" : "-"}${formatNumber(Math.abs(change))}`}
    >
      {positive ? "▲" : "▼"} {formatCompact(Math.abs(change))}
    </span>
  );
}

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}
