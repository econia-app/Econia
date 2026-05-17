/**
 * Client Supabase partagé (singleton)
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pxbntlbtngcecbhcghzu.supabase.co",
  "sb_publishable_RK6hui-9UQCUy5H36tj9_A_gcGNtfIQ"
);

export type Profile = {
  id: string;
  email: string;
  is_premium: boolean;
  is_founder: boolean;
  scan_data: Record<string, string> | null;
  gains_total: number;
};
