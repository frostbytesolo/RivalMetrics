/**
 * Supabase client helpers.
 *
 * Two clients:
 *  - `supabasePublic` — browser-safe, uses the anon key + RLS.
 *  - `supabaseAdmin`  — server-only, uses the service-role key. NEVER import
 *    in client components (it bypasses RLS).
 *
 * If env vars are missing (e.g. local dev without a project), both getters
 * return `null` and the app falls back to the mock dataset in lib/data.ts.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith("http") && !url.includes("YOUR-PROJECT")
);

/** Browser-safe client. Safe to import anywhere. Returns null if unconfigured. */
export function supabasePublic(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(url!, anonKey!, {
    auth: { persistSession: false }
  });
}

/**
 * Server-only admin client (service-role key bypasses RLS).
 * Returns null if unconfigured. Only call from server components / route
 * handlers / server actions — never from client code.
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (serviceKey.includes("your-service-role-key")) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
