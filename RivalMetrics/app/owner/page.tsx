import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { PageHero, Card } from "@/components/ui";
import { CopyButton } from "@/components/copy-button";
import { site, socials, ownerVerificationHash } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/owner",
  title: "Owner",
  description:
    "RivalMetrics is owned and operated by FrostByte. Verify ownership with the public verification hash."
});

export default function OwnerPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Ownership" title={`Owned by ${site.owner}`}>
        <p>
          RivalMetrics is owned and operated by {site.owner}. This page exists
          so anyone can verify who is responsible for the platform.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="grid grid-2">
          <Card className="rm-owner-card">
            <div className="rm-owner-logo">
              <Logo size={48} href={null} />
            </div>
            <h3>{site.owner}</h3>
            <p className="muted">
              {site.owner} is the sole owner and operator of {site.name}. All
              infrastructure, data custody, and publishing decisions sit with
              the {site.owner} team.
            </p>
            <ul className="rm-owner-list">
              <li><span>Owner</span><strong>{site.owner}</strong></li>
              <li><span>Project</span><strong>{site.name}</strong></li>
              <li><span>Established</span><strong>2026</strong></li>
              <li><span>Model</span><strong>Open-source, community-funded</strong></li>
            </ul>
          </Card>

          <Card className="rm-owner-verify">
            <h3>Verification hash</h3>
            <p className="muted">
              This signed hash is published openly so ownership of {site.name}
              can be independently verified. It is reproduced on {site.owner}'s
              official channels.
            </p>
            <div className="rm-owner-hash-row">
              <code className="rm-owner-hash">{ownerVerificationHash}</code>
              <CopyButton value={ownerVerificationHash} label="ownership hash" />
            </div>
            <p className="rm-owner-note">
              Compare this hash against the one posted on {site.owner}'s
              verified socials below before trusting any claim of ownership.
            </p>
          </Card>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Card>
          <h3>Official {site.owner} channels</h3>
          <p className="muted">
            These are the only accounts authorized to speak for {site.name}.
            Treat any other account claiming affiliation as impersonation.
          </p>
          <ul className="rm-owner-socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="rm-owner-social" rel="noopener noreferrer">
                  <span className="rm-owner-social-label">{s.label}</span>
                  <span className="rm-owner-social-handle">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
