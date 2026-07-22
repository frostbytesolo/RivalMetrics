"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";
import styles from "./copy-button.module.css";

/** Copy-to-clipboard button with accessible status feedback. */
export function CopyButton({
  value,
  label = "Copy",
  className
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cx(styles.btn, className)}
      aria-label={`${copied ? "Copied" : "Copy"} ${label}`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
