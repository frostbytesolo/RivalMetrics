import Link from "next/link";
import { cx } from "@/lib/utils";
import styles from "./ui.module.css";

/** Card surface — rounded, soft shadow, themed. */
export function Card({
  children,
  className,
  as: Tag = "div",
  padding = true,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  padding?: boolean;
}) {
  return (
    <Tag
      className={cx(styles.card, padding && styles.padded, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Section heading with an eyebrow + title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={cx(styles.heading, align === "center" && styles.center)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}

/** Pill / tag chip. */
export function Pill({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "negative" | "warning" | "brand";
  className?: string;
}) {
  return (
    <span className={cx(styles.pill, styles[`tone_${tone}`], className)}>
      {children}
    </span>
  );
}

/** Primary / secondary button — renders as <Link> when href is provided. */
export function Button({
  href,
  variant = "primary",
  children,
  className,
  ...rest
}: {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = cx(styles.btn, styles[`btn_${variant}`], className);
  if (href) {
    return (
      <Link href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/** Show a signed change (e.g. leaderboard movement) with color + arrow. */
export function Delta({ value, compact }: { value: number; compact?: boolean }) {
  const tone = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
  const arrow = value > 0 ? "▲" : value < 0 ? "▼" : "–";
  const text = compact
    ? `${arrow} ${Math.abs(value).toLocaleString()}`
    : `${arrow} ${Math.abs(value).toLocaleString()}`;
  return <span className={cx(styles.delta, styles[`tone_${tone}`])}>{text}</span>;
}

/** Page hero block with a gradient backdrop. */
export function PageHero({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.hero}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={styles.heroTitle}>{title}</h1>
      {children && <div className={styles.heroLead}>{children}</div>}
    </header>
  );
}
