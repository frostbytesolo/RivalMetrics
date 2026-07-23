"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";
import styles from "./theme-toggle.module.css";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. Light is the default (spec). The theme itself is
 * applied by the inline ThemeScript before paint; this component only
 * syncs state, swaps the stored preference, and updates the theme-color
 * meta tag.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
      "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rm-theme", next);
    } catch {
      /* storage may be blocked; theme still applies for this session */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        next === "dark" ? site.themeColor.dark : site.themeColor.light
      );
    }
    setTheme(next);
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => apply(isDark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch. */}
      <span className={styles.icon} aria-hidden="true">
        {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
