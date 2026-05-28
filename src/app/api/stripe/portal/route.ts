/**
 * POST /api/stripe/portal
 *
 * Crée une session du Customer Portal Stripe pour que l'utilisateur :
 *  - mette à jour son moyen de paiement
 *  - annule son abonnement
 *  - télécharge ses factures
 *
 * Body : { user_id: string }
 * Retour : { url: string } → redirection vers le portail
 */
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = "https://econia.fr";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return NextResponse.json({ error: "user_id requis" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user_id)
      .single();

    const customerId = profile?.stripe_customer_id as string | null;
    if (!customerId) {
      return NextResponse.json(
        { error: "Aucun abonnement Stripe rattaché à ce compte." },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${SITE_URL}/mon-compte`,
      locale: "fr",
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    // eslint-disable-next-line no-console
    console.error("[Econia][stripe/portal]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
