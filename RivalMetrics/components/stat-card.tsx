import { cx } from "@/lib/utils";
import { Card } from "./ui";
import styles from "./stat-card.module.css";

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: string;
  trend?: { value: string; positive?: boolean };
}) {
  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      </div>
      <p className={styles.value}>{value}</p>
      <div className={styles.foot}>
        {hint && <span className={styles.hint}>{hint}</span>}
        {trend && (
          <span
            className={cx(
              styles.trend,
              trend.positive ? styles.trendUp : styles.trendDown
            )}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
}
