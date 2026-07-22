"use client";

import { useEffect, useState } from "react";
import type { DonationTotals } from "@/lib/donations";
import { emptyDonationTotals } from "@/lib/donations";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card } from "./ui";
import styles from "./donation-widget.module.css";

/**
 * Donation counter with a purple progress bar. Fetches real totals from
 * /api/donations (backed by the on-chain verified Supabase table).
 * Shows zero until real donations arrive — never fabricated.
 */
export function DonationWidget({ compact = false }: { compact?: boolean }) {
  const [totals, setTotals] = useState<DonationTotals>(emptyDonationTotals());

  useEffect(() => {
    let active = true;
    fetch("/api/donations", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: DonationTotals | null) => {
        if (active && data) setTotals(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const pct = totals.goalUsd > 0
    ? Math.min(100, Math.round((totals.totalUsd / totals.goalUsd) * 100))
    : 0;

  return (
    <Card className={styles.wrap} padding={!compact}>
      <div className={styles.head}>
        <div>
          <p className={styles.label}>Community-funded</p>
          <p className={styles.amount} aria-label="Total donated">
            {formatCurrency(totals.totalUsd)}
          </p>
        </div>
        <div className={styles.goal}>
          <span className={styles.goalLabel}>Goal</span>
          <span className={styles.goalAmount}>{formatCurrency(totals.goalUsd)}</span>
        </div>
      </div>

      <div
        className={styles.bar}
        role="progressbar"
        aria-valuenow={totals.totalUsd}
        aria-valuemin={0}
        aria-valuemax={totals.goalUsd}
        aria-valuetext={`${pct}% of ${formatCurrency(totals.goalUsd)} goal`}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }}>
          {pct > 0 && <span className={styles.fillLabel}>{pct}%</span>}
        </div>
      </div>

      <div className={styles.foot}>
        <span>{formatNumber(totals.contributors)} contributors</span>
        <span className={styles.updated}>
          {totals.totalUsd === 0
            ? "Awaiting first donation"
            : `Updated ${new Date(totals.lastUpdated).toLocaleDateString()}`}
        </span>
      </div>
    </Card>
  );
}
