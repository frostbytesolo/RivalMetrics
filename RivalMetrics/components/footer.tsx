import Link from "next/link";
import { Logo } from "./logo";
import { footerNav, socials, site } from "@/lib/site";
import { ownerVerificationHash } from "@/lib/site";
import styles from "./footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>
            {site.tagline}. A {site.owner} project — privacy-safe, transparent, global.
          </p>
          <ul className={styles.socials} aria-label="Social links">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className={styles.social} rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.navGrid}>
          {Object.entries(footerNav).map(([group, items]) => (
            <nav key={group} className={styles.navCol} aria-label={group}>
              <h3 className={styles.navTitle}>{group}</h3>
              <ul className={styles.navList}>
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.footerLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copy}>
          © {year} {site.name}. Built by {site.owner}.
        </p>
        <p className={styles.hash} title="FrostByte ownership verification hash">
          Owner proof: <code>{ownerVerificationHash}</code>
        </p>
      </div>
    </footer>
  );
}
