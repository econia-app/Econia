/**
 * POST /api/stripe/checkout
 *
 * Crée une session Stripe Checkout pour démarrer l'abonnement Founder.
 * - 1er mois gratuit (trial)
 * - 6 mois à -50 % (coupon)
 * - puis 6,99€/mois (prix nominal)
 *
 * Body : { user_id: string, email: string }
 * Retour : { url: string } → redirection vers Stripe Checkout
 */
import { NextResponse } from "next/server";
import {
  stripe,
  STRIPE_PRICE_FOUNDER,
  STRIPE_COUPON_FOUNDER,
  STRIPE_PRICE_FOUNDER_TRIAL_DAYS,
} from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = "https://econia.fr";

export async function POST(req: Request) {
  try {
    const { user_id, email } = await req.json();
    if (!user_id || !email) {
      return NextResponse.json({ error: "user_id et email requis" }, { status: 400 });
    }
    if (!STRIPE_PRICE_FOUNDER) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_FOUNDER non configuré côté serveur" },
        { status: 500 }
      );
    }

    const admin = getSupabaseAdmin();

    // Récupère le profil pour savoir s'il a déjà un customer_id Stripe
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id, is_premium")
      .eq("id", user_id)
      .single();

    if (profile?.is_premium) {
      return NextResponse.json(
        { error: "Tu es déjà Premium." },
        { status: 400 }
      );
    }

    let customerId = profile?.stripe_customer_id as string | null;

    // Crée un Customer Stripe si pas encore fait
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: user_id },
      });
      customerId = customer.id;
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user_id);
    }

    // Crée la session Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_FOUNDER, quantity: 1 }],
      subscription_data: {
        trial_period_days: STRIPE_PRICE_FOUNDER_TRIAL_DAYS,
        metadata: { supabase_user_id: user_id, plan: "founder" },
      },
      ...(STRIPE_COUPON_FOUNDER
        ? { discounts: [{ coupon: STRIPE_COUPON_FOUNDER }] }
        : {}),
      allow_promotion_codes: !STRIPE_COUPON_FOUNDER,
      success_url: `${SITE_URL}/mon-compte?stripe=success`,
      cancel_url: `${SITE_URL}/mon-compte?stripe=cancel`,
      locale: "fr",
      // Champs facturation
      billing_address_collection: "auto",
      // Important : permet à la session d'expirer si abandon
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    // eslint-disable-next-line no-console
    console.error("[Econia][stripe/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
