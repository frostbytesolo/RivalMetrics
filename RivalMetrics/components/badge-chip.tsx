import type { Badge } from "@/lib/content";
import { cx } from "@/lib/utils";
import styles from "./badge-chip.module.css";

export function BadgeChip({
  badge,
  earned,
  className
}: {
  badge: Badge;
  earned?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(styles.chip, earned && styles.earned, className)} aria-label={`${badge.label} badge${earned ? " — earned" : ""}`}>
      <span className={styles.icon} aria-hidden="true">{badge.icon}</span>
      <div className={styles.body}>
        <p className={styles.label}>{badge.label}</p>
        <p className={styles.desc}>{badge.description}</p>
      </div>
      {earned && <span className={styles.tag}>Earned</span>}
    </div>
  );
}
