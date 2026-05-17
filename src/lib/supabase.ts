/**
 * Client Supabase partagé (singleton)
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pxbntlbtngcecbhcghzu.supabase.co",
  "sb_publishable_RK6hui-9UQCUy5H36tj9_A_gcGNtfIQ"
);

export type ActionStatus = "todo" | "doing" | "done";

export type ActionState = {
  status: ActionStatus;
  montant?: number; // montant déclaré récupéré (€) — uniquement si done
  date?: string; // ISO timestamp passage en "done"
};

export type Profile = {
  id: string;
  email: string;
  is_premium: boolean;
  is_founder: boolean;
  scan_data: Record<string, string> | null;
  /** Total cumulé déclaré par l'utilisateur (calculé côté front à partir d'actions_state) */
  gains_total: number;
  /** Map<gain_title, ActionState> — état de chaque levier pour cet utilisateur */
  actions_state: Record<string, ActionState> | null;
};
