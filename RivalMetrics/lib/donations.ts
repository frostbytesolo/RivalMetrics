/**
 * Donations domain — types and constants.
 *
 * Totals come from the Supabase donations table. If Supabase is not
 * configured, all totals are zero — no fabricated numbers.
 */

import { donationAddresses } from "./site";

export interface DonationCoin {
  id: string;
  name: string;
  network: string;
  address: string;
  symbol: string;
}

export const donationCoins: DonationCoin[] = [
  {
    id: "usdt-trc20",
    name: "Tether",
    network: "TRC20 (Tron)",
    address: donationAddresses["USDT (TRC20)"],
    symbol: "USDT"
  },
  {
    id: "btc",
    name: "Bitcoin",
    network: "Bitcoin Mainnet",
    address: donationAddresses.Bitcoin,
    symbol: "BTC"
  },
  {
    id: "eth",
    name: "Ethereum",
    network: "ERC-20",
    address: donationAddresses.Ethereum,
    symbol: "ETH"
  },
  {
    id: "usdc",
    name: "USD Coin",
    network: "ERC-20",
    address: donationAddresses["USDC (ERC-20)"],
    symbol: "USDC"
  },
  {
    id: "bnb",
    name: "BNB",
    network: "BEP-20 (BSC)",
    address: donationAddresses["BNB (BEP-20)"],
    symbol: "BNB"
  }
];

export interface DonationTotals {
  totalUsd: number;
  goalUsd: number;
  contributors: number;
  lastUpdated: string;
}

/**
 * Honest defaults: zero donations, no contributors, goal is a target not a claim.
 * Only `goalUsd` is set because it's an aspiration, not fabricated data.
 */
export function emptyDonationTotals(): DonationTotals {
  return {
    totalUsd: 0,
    goalUsd: 12_000,
    contributors: 0,
    lastUpdated: new Date().toISOString()
  };
}
