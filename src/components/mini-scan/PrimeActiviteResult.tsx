"use client";
/**
 * Résultat du mini-scan Prime d'activité.
 * Affiche : montant estimé + démarche officielle (gratuit) + CTA Premium pour le guide complet.
 */
import { T, fonts } from "@/lib/theme";
import { PRIME_ACTIVITE_2026 } from "@/lib/baremes-2026";
import type { PrimeActiviteEstimation } from "@/lib/mini-scans/prime-activite";

type Props = {
  estimation: PrimeActiviteEstimation;
  isPremium: boolean;
  onUpgrade: () => void;
  onRetry: () => void;
  onOpenGuide?: () => void;
};

export default function PrimeActiviteResult({ estimation, isPremium, onUpgrade, onRetry, onOpenGuide }: Props) {
  const { montantMensuel, montantAnnuel, eligible, cas, notes } = estimation;

  return (
    <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto" }}>
      {/* Bloc principal : montant estimé */}
      {eligible ? (
        <div
          style={{
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            borderRadius: "20px",
            padding: "32px 28px",
            color: "#fff",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.85, marginBottom: "8px", fontWeight: 500 }}>
            Estimation de votre Prime d&apos;activité
          </div>
          <div style={{ fontFamily: fonts.title, fontSize: "clamp(44px, 8vw, 64px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1, marginBottom: "8px" }}>
            ≈ {montantMensuel}€<span style={{ fontSize: "22px", fontWeight: 400 }}>/mois</span>
          </div>
          <div style={{ fontSize: "13px", opacity: 0.85 }}>
            soit ≈ {montantAnnuel.toLocaleString()}€/an · estimation indicative
          </div>
        </div>
      ) : (
        <div
          style={{
            background: T.bgCard,
            border: `1.5px solid ${T.border}`,
            borderRadius: "20px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤔</div>
          <h3 style={{ fontFamily: fonts.title, fontSize: "22px", fontWeight: 600, marginBottom: "10px", letterSpacing: "-0.5px" }}>
            {cas === "non_eligible_revenus" ? "Vos revenus dépassent le seuil" : "Profil non éligible"}
          </h3>
          <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
            Selon votre profil, vous n&apos;êtes probablement pas éligible à la Prime d&apos;activité.
            Vérifiez directement avec le simulateur officiel pour confirmer.
          </p>
        </div>
      )}

      {/* Notes pédagogiques */}
      {notes.length > 0 && (
        <div style={{ background: T.bgWarm, borderRadius: "14px", padding: "18px 20px", marginBottom: "20px" }}>
          {notes.map((note, i) => (
            <p key={i} style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.6, margin: i > 0 ? "12px 0 0" : 0 }}>
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Bouton démarche officielle (toujours visible, gratuit) */}
      <a
        href={PRIME_ACTIVITE_2026.simulateurUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
          padding: "16px",
          background: T.navy,
          color: "#fff",
          borderRadius: "14px",
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: 700,
          marginBottom: "12px",
          boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
        }}
      >
        Confirmer sur le simulateur officiel CAF →
      </a>

      {/* CTA Premium pour le guide complet */}
      {eligible && (
        <div
          style={{
            background: T.bgCard,
            border: `2px solid ${T.blue}`,
            borderRadius: "16px",
            padding: "20px 22px",
            marginBottom: "20px",
            boxShadow: "0 8px 24px rgba(37,99,235,0.08)",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: 700, color: T.navy, marginBottom: "8px" }}>
            🚀 Maximise ton dossier avec le guide Premium
          </div>
          <ul style={{ margin: "0 0 16px", paddingLeft: "20px", fontSize: "13px", color: T.textSoft, lineHeight: 1.7 }}>
            <li>Les pièces à préparer avant la demande</li>
            <li>Les revenus à déclarer (et ceux à oublier — légalement)</li>
            <li>Comment réagir en cas de refus ou de baisse</li>
            <li>Quand faire ta déclaration trimestrielle pour optimiser</li>
          </ul>
          <button
            onClick={() => (isPremium && onOpenGuide ? onOpenGuide() : onUpgrade())}
            style={{
              width: "100%",
              padding: "14px",
              background: T.blue,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            {isPremium ? "📖 Voir le guide d'action" : "Débloquer le guide (3,49€/mois)"}
          </button>
        </div>
      )}

      {/* Refaire le mini-scan */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          onClick={onRetry}
          style={{
            background: "none",
            border: "none",
            color: T.textMuted,
            fontSize: "13px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Refaire l&apos;estimation
        </button>
      </div>

      {/* Mention légale */}
      <p style={{ fontSize: "11px", color: T.textLight, textAlign: "center", marginTop: "24px", lineHeight: 1.5 }}>
        Estimation indicative basée sur le barème CAF {PRIME_ACTIVITE_2026.dateBareme}.
        Le calcul officiel prend en compte d&apos;autres facteurs (revenus 3 derniers mois, autres aides perçues).
        Confirmation à faire sur caf.fr.
      </p>
    </div>
  );
}
