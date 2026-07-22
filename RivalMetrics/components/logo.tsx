import Link from "next/link";
import styles from "./logo.module.css";

/**
 * RivalMetrics logo — inline SVG so it inherits theme via CSS variables,
 * plus an HTML wordmark for crisp rendering at any size.
 * `iconOnly` renders just the mark (used in favicons/avatars).
 */
export function Logo({
  size = 32,
  withWordmark = true,
  href = "/",
  ariaLabel = "RivalMetrics home"
}: {
  size?: number;
  withWordmark?: boolean;
  href?: string | null;
  ariaLabel?: string;
}) {
  const mark = (
    <>
      <svg
        className={styles.mark}
        width={size}
        height={size}
        viewBox="0 0 512 512"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="rm-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--logo-color, #6A4DF5)" />
            <stop offset="100%" stopColor="var(--logo-secondary, #4A3ACB)" />
          </linearGradient>
        </defs>
        <rect
          x="56"
          y="56"
          width="400"
          height="400"
          rx="96"
          ry="96"
          fill="none"
          stroke="url(#rm-grad)"
          strokeWidth="20"
        />
        <path
          d="M150 168 L246 256 L150 344"
          fill="none"
          stroke="url(#rm-grad)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M362 168 L266 256 L362 344"
          fill="none"
          stroke="var(--logo-accent, #C9B8FF)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="256" cy="256" r="14" fill="url(#rm-grad)" />
      </svg>
      {withWordmark && (
        <span className={styles.wordmark}>RivalMetrics</span>
      )}
    </>
  );

  if (href === null) {
    return (
      <span className={styles.logo} aria-label={withWordmark ? "RivalMetrics" : ariaLabel}>
        {mark}
      </span>
    );
  }

  return (
    <Link href={href} className={styles.logo} aria-label={ariaLabel}>
      {mark}
    </Link>
  );
}
