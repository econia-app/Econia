/**
 * POST /api/stripe/webhook
 *
 * Reçoit les événements Stripe et synchronise l'état de l'abonnement en BDD.
 * Sécurité : vérifie la signature avec STRIPE_WEBHOOK_SECRET.
 *
 * Events gérés :
 *  - checkout.session.completed         → marque le profil comme Premium
 *  - customer.subscription.created      → idem (filet de sécurité)
 *  - customer.subscription.updated      → maj statut + period_end
 *  - customer.subscription.deleted      → désactive Premium
 *  - invoice.payment_failed             → marque past_due (Premium maintenu)
 *
 * À configurer côté Stripe Dashboard :
 *  URL : https://econia.fr/api/stripe/webhook
 *  Events : ceux listés ci-dessus
 *  Récupérer le whsec_... → variable STRIPE_WEBHOOK_SECRET
 */
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Next.js 16 : pas de body parsing, on lit le raw body
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET non configuré" },
      { status: 500 }
    );
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Signature invalide";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const isActiveStatus = (s: Stripe.Subscription.Status): boolean =>
    s === "trialing" || s === "active";

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (userId && subId) {
          await admin
            .from("profiles")
            .update({
              stripe_subscription_id: subId,
              is_premium: true,
              subscription_status: "trialing",
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        if (userId) {
          await admin
            .from("profiles")
            .update({
              stripe_subscription_id: sub.id,
              subscription_status: sub.status,
              subscription_period_end: periodEnd,
              is_premium: isActiveStatus(sub.status),
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await admin
            .from("profiles")
            .update({
              subscription_status: "canceled",
              is_premium: false,
            })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (subId) {
          // On marque past_due mais on garde is_premium = true tant que Stripe ne cancel pas
          await admin
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      default:
        // event ignoré
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur traitement webhook";
    // eslint-disable-next-line no-console
    console.error("[Econia][stripe/webhook]", event.type, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
