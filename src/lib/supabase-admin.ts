/**
 * Client Supabase admin — server-side uniquement
 *
 * Utilise la SERVICE_ROLE_KEY (bypass RLS). À utiliser exclusivement :
 *  - dans les API routes (Stripe webhook, delete-account)
 *  - pour les opérations privilégiées (update is_premium, etc.)
 *
 * NE JAMAIS exposer ce client côté client / browser.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pxbntlbtngcecbhcghzu.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      "[Econia] SUPABASE_SERVICE_ROLE_KEY absent — variable d'environnement requise pour les opérations admin."
    );
  }
  cached = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
