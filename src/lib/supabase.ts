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
  montant?: number;
  date?: string;
};

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | null;

export type Profile = {
  id: string;
  email: string;
  is_premium: boolean;
  is_founder: boolean;
  scan_data: Record<string, string> | null;
  gains_total: number;
  actions_state: Record<string, ActionState> | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_period_end: string | null;
};
