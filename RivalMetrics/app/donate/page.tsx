import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { DonationWidget } from "@/components/donation-widget";
import { TrustBadge } from "@/components/trust-badge";
import { BadgeChip } from "@/components/badge-chip";
import { PageHero, SectionHeading, Card } from "@/components/ui";
import { donationCoins } from "@/lib/donations";
import { badges } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/donate",
  title: "Donate",
  description:
    "Support RivalMetrics with crypto. USDT TRC20, Bitcoin, Ethereum, USDC, and BNB. Transparent, on-chain, community-funded."
});

export default function DonatePage() {
  return (
    <div className="container">
      <PageHero eyebrow="Community-funded" title="Keep RivalMetrics ad-free">
        <p>
          RivalMetrics takes no investor money and runs no ads. Donations
          cover infrastructure, data ingestion, and development. Every
          contribution is verifiable on-chain and reflected in the live
          counter below.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <DonationWidget />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="Crypto"
          title="Choose a coin"
          description="Send only on the matching network. Wrong-network transfers are unrecoverable."
        />
        <div className="grid grid-3">
          {donationCoins.map((coin) => (
            <Card key={coin.id} className="rm-donate-coin">
              <div className="rm-coin-head">
                <div>
                  <p className="rm-coin-name">{coin.name}</p>
                  <p className="rm-coin-network">{coin.network}</p>
                </div>
                <span className="rm-coin-symbol">{coin.symbol}</span>
              </div>
              <div className="rm-coin-qr" aria-hidden="true">
                {/* Decorative QR placeholder; replace with generated QR image. */}
                <div className="rm-qr-grid" data-seed={coin.symbol} />
              </div>
              <label className="rm-addr-label" htmlFor={`addr-${coin.id}`}>
                {coin.symbol} address
              </label>
              <div className="rm-addr-row">
                <code id={`addr-${coin.id}`} className="rm-addr">
                  {coin.address}
                </code>
                <CopyButton value={coin.address} label={`${coin.symbol} address`} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Card className="rm-donate-thanks">
          <div className="rm-donate-thanks-head">
            <h3>Every donor earns the Donor badge</h3>
            <TrustBadge label="Transparent · on-chain verifiable" />
          </div>
          <p className="muted">
            Send any amount and your contribution is permanently recorded on
            the matching chain. Email a transaction link after donating to
            claim your Donor badge on your stats page.
          </p>
          <div className="rm-donate-badges">
            {badges
              .filter((b) => b.id === "donor" || b.id === "early-supporter")
              .map((b) => (
                <BadgeChip key={b.id} badge={b} earned={b.id === "donor"} />
              ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
