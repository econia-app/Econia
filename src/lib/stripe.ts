/**
 * Stripe — instance partagée côté serveur
 *
 * Utilisable uniquement dans les API routes (server-side).
 * Les clés et IDs viennent des variables d'environnement (jamais commit en clair).
 *
 * Variables requises côté Vercel :
 *   - STRIPE_SECRET_KEY              (sk_live_... ou sk_test_...)
 *   - STRIPE_WEBHOOK_SECRET          (whsec_...)
 *   - STRIPE_PRICE_FOUNDER           (price_..., 6,99€/mois nominal)
 *   - STRIPE_COUPON_FOUNDER          (50OFF6MONTHS — coupon -50% pendant 6 mois)
 *   - STRIPE_PRICE_FOUNDER_TRIAL_DAYS (30 — durée du 1er mois gratuit)
 *
 * Côté client (publique) :
 *   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_... ou pk_test_...)
 *
 * Procédure setup dans docs/stripe-setup.md
 */
import Stripe from "stripe";

const SECRET = process.env.STRIPE_SECRET_KEY;
if (!SECRET) {
  // eslint-disable-next-line no-console
  console.warn("[Econia] STRIPE_SECRET_KEY absent — les routes Stripe vont échouer.");
}

export const stripe = new Stripe(SECRET || "sk_live_missing", {
  // Version d'API alignée sur celle embarquée par le SDK stripe@22 installé.
  // (On ne caste plus vers Stripe.LatestApiVersion : ce type n'existe pas dans
  // cette version du SDK et cassait le build Vercel.)
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

// Helpers pour récupérer les IDs depuis l'env (avec défauts safe)
export const STRIPE_PRICE_FOUNDER = process.env.STRIPE_PRICE_FOUNDER || "";
export const STRIPE_COUPON_FOUNDER = process.env.STRIPE_COUPON_FOUNDER || "";
export const STRIPE_PRICE_FOUNDER_TRIAL_DAYS = parseInt(
  process.env.STRIPE_PRICE_FOUNDER_TRIAL_DAYS || "30",
  10
);
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Status d'abonnement utilisés en BDD (sous-ensemble des Stripe.Subscription.Status)
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | null;

export type SubscriptionInfo = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_period_end: string | null; // ISO timestamp
};
