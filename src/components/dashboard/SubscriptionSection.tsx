"use client";
import { useState } from "react";
import { T } from "@/lib/theme";
import type { Profile } from "@/lib/supabase";

type Props = {
  user: { id: string; email: string };
  profile: Profile | null;
};

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  trialing: { label: "Période d'essai", bg: "#FEF3C7", color: "#D97706" },
  active: { label: "Actif", bg: "#ECFDF5", color: "#059669" },
  past_due: { label: "Paiement en retard", bg: "#FEE2E2", color: "#DC2626" },
  canceled: { label: "Annulé", bg: "#F1F5F9", color: "#64748B" },
  incomplete: { label: "Incomplet", bg: "#FEE2E2", color: "#DC2626" },
  unpaid: { label: "Impayé", bg: "#FEE2E2", color: "#DC2626" },
};

/**
 * SubscriptionSection — bloc abonnement dans le dashboard /mon-compte
 *
 * Affiche le statut + bouton d'action :
 *  - Pas d'abonnement → "Passer Premium" → checkout Stripe
 *  - Abonnement actif/trial → "Gérer mon abonnement" → Stripe Customer Portal
 *  - is_founder (manuellement marqué) → badge spécial, pas de bouton checkout
 */
export default function SubscriptionSection({ user, profile }: Props) {
  const [loading, setLoading] = useState(false);

  const hasStripeSub = !!profile?.stripe_subscription_id;
  const status = profile?.subscription_status || null;
  const isFounder = profile?.is_founder === true;
  const isPremium = profile?.is_premium === true;

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert(data.error || "Impossible de démarrer le paiement. Réessaie.");
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Erreur réseau. Réessaie ou contacte le support.");
    } finally {
      setLoading(false);
    }
  };

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert(data.error || "Impossible d'ouvrir le portail. Réessaie.");
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Erreur réseau. Réessaie ou contacte le support.");
    } finally {
      setLoading(false);
    }
  };

  const statusUI = status ? STATUS_LABEL[status] : null;

  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "18px 22px",
        marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: 0 }}>
          Mon abonnement
        </h3>
        {statusUI && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: statusUI.bg,
              color: statusUI.color,
              padding: "3px 9px",
              borderRadius: 6,
            }}
          >
            {statusUI.label}
          </span>
        )}
        {isFounder && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: T.amberLight,
              color: T.amber,
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            FONDATEUR
          </span>
        )}
      </div>

      {!isPremium && !isFounder && (
        <>
          <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, margin: "0 0 14px" }}>
            Tu n&apos;as pas encore d&apos;abonnement Premium. Avec le Founder Pass :{" "}
            <strong style={{ color: T.navy }}>1er mois gratuit, 6 mois à 3,49€/mois</strong>, puis
            6,99€/mois bloqué à vie.
          </p>
          <button
            onClick={startCheckout}
            disabled={loading}
            style={{
              padding: "12px 22px",
              background: T.blue,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1,
              minHeight: 44,
            }}
          >
            {loading ? "Redirection…" : "Passer Premium (Founder)"}
          </button>
        </>
      )}

      {isPremium && hasStripeSub && (
        <>
          <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, margin: "0 0 14px" }}>
            {profile?.subscription_period_end ? (
              <>
                Prochaine échéance :{" "}
                <strong style={{ color: T.navy }}>
                  {new Date(profile.subscription_period_end).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </>
            ) : (
              "Abonnement Premium actif."
            )}
          </p>
          <button
            onClick={openPortal}
            disabled={loading}
            style={{
              padding: "12px 22px",
              background: "transparent",
              color: T.navy,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1,
              minHeight: 44,
            }}
          >
            {loading ? "Redirection…" : "Gérer mon abonnement"}
          </button>
        </>
      )}

      {isFounder && !hasStripeSub && (
        <p style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
          Tu fais partie des Founders activés manuellement. Accès Premium à vie au tarif Founder
          (6,99€/mois bloqué). Aucune action requise.
        </p>
      )}
    </div>
  );
}
