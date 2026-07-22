import type { Rivalry } from "@/lib/data";
import { formatCompact, formatNumber } from "@/lib/utils";
import { Card, Pill } from "./ui";
import styles from "./rivalry-card.module.css";

/** Head-to-head country rivalry card. */
export function RivalryCard({ rivalry }: { rivalry: Rivalry }) {
  const { a, b, gap, trend } = rivalry;
  const total = a.total + b.total;
  const aShare = (a.total / total) * 100;

  const trendTone =
    trend === "rising" ? "positive" : trend === "falling" ? "negative" : "neutral";
  const trendLabel =
    trend === "rising" ? "Gap widening" : trend === "falling" ? "Gap closing" : "Steady";

  return (
    <Card className={styles.card} padding={false}>
      <div className={styles.head}>
        <span className={styles.vs}>Head-to-head</span>
        <Pill tone={trendTone as "positive" | "negative" | "neutral"}>{trendLabel}</Pill>
      </div>

      <div className={styles.matchup}>
        <Side
          icon={a.icon}
          label={a.label}
          rank={a.rank}
          total={a.total}
          winning={a.total >= b.total}
        />
        <div className={styles.center}>
          <span className={styles.vsLabel}>VS</span>
        </div>
        <Side
          icon={b.icon}
          label={b.label}
          rank={b.rank}
          total={b.total}
          winning={b.total > a.total}
        />
      </div>

      <div className={styles.barWrap}>
        <div className={styles.barA} style={{ width: `${aShare}%` }} />
        <div className={styles.barB} style={{ width: `${100 - aShare}%` }} />
      </div>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Gap</dt>
          <dd>{formatCompact(gap)} visits</dd>
        </div>
        <div className={styles.stat}>
          <dt>Rank diff</dt>
          <dd>{Math.abs(a.rank - b.rank)} spots</dd>
        </div>
        <div className={styles.stat}>
          <dt>Combined</dt>
          <dd title={formatNumber(total)}>{formatCompact(total)}</dd>
        </div>
      </dl>
    </Card>
  );
}

function Side({
  icon,
  label,
  rank,
  total,
  winning
}: {
  icon: string;
  label: string;
  rank: number;
  total: number;
  winning: boolean;
}) {
  return (
    <div className={styles.side} data-winning={winning}>
      <span className={styles.flag} aria-hidden="true">{icon}</span>
      <div>
        <p className={styles.name}>{label}</p>
        <p className={styles.meta}>
          #{rank} · {formatCompact(total)}
        </p>
      </div>
      {winning && <span className={styles.crown} aria-label="Leading">👑</span>}
    </div>
  );
}
