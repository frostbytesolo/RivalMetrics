import Link from "next/link";
import { cx } from "@/lib/utils";
import styles from "./trust-badge.module.css";

/** Small reusable trust pill linking to the trust page. */
export function TrustBadge({
  className,
  label = "Privacy-safe · Anti-fake protected"
}: {
  className?: string;
  label?: string;
}) {
  return (
    <Link href="/trust" className={cx(styles.badge, className)}>
      <span className={styles.shield} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </span>
      <span>{label}</span>
    </Link>
  );
}
