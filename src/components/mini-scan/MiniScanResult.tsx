"use client";
/**
 * MiniScanResult — composant générique de résultat pour tous les mini-scans.
 * Réutilisé par Prime activité, RSA, APL, etc.
 */
import { T, fonts } from "@/lib/theme";

export type MiniScanResultConfig = {
  /** Titre du levier ("Prime d'activité", "RSA", "APL"...) */
  leverName: string;
  /** Montant principal estimé (valeur affichée en gros) */
  montantMensuel: number;
  /** Unité affichée à côté du montant principal */
  uniteMontant?: "mois" | "an" | "unique";
  /** Montant annualisé pour l'affichage secondaire */
  montantAnnuel: number;
  /** Texte secondaire sous le montant principal (par défaut : "soit ≈ X€/an · estimation indicative") */
  sousMontantText?: string;
  /** Le profil est-il éligible ? */
  eligible: boolean;
  /** Titre du bloc non-éligible si pertinent */
  nonEligibleTitle?: string;
  /** Description du non-éligible */
  nonEligibleDesc?: string;
  /** Notes pédagogiques (max 3-4) */
  notes: string[];
  /** URL du simulateur officiel pour confirmation */
  simulateurUrl: string;
  /** Label du bouton vers le simulateur officiel */
  simulateurLabel?: string;
  /** Clé du guide Premium pour l'upsell — null si pas de guide associé */
  guideKey: string | null;
  /** Titre de l'upsell Premium */
  upsellTitle?: string;
  /** Bullets du contenu Premium */
  upsellBullets: string[];
  /** Date du barème pour la mention légale */
  dateBareme: string;
  /** Notes complémentaires en mention légale */
  baremeDisclaimer?: string;
};

type Props = {
  config: MiniScanResultConfig;
  isPremium: boolean;
  hasAccount: boolean;
  onUpgrade: () => void;
  onRetry: () => void;
  onOpenGuide?: () => void;
};

export default function MiniScanResult({
  config,
  isPremium,
  hasAccount,
  onUpgrade,
  onRetry,
  onOpenGuide,
}: Props) {
  const {
    leverName,
    montantMensuel,
    uniteMontant = "mois",
    montantAnnuel,
    sousMontantText,
    eligible,
    nonEligibleTitle,
    nonEligibleDesc,
    notes,
    simulateurUrl,
    simulateurLabel = "Confirmer sur le simulateur officiel →",
    guideKey,
    upsellTitle = `Maximise ton dossier avec le guide Premium`,
    upsellBullets,
    dateBareme,
    baremeDisclaimer,
  } = config;

  const uniteLabel = uniteMontant === "mois" ? "/mois" : uniteMontant === "an" ? "/an" : "";
  const sousText =
    sousMontantText ??
    (uniteMontant === "mois"
      ? `soit ≈ ${montantAnnuel.toLocaleString()}€/an · estimation indicative`
      : `estimation indicative`);

  return (
    <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto" }}>
      {/* Bloc principal : montant estimé ou non-éligible */}
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
            Estimation de votre {leverName}
          </div>
          <div style={{ fontFamily: fonts.title, fontSize: "clamp(44px, 8vw, 64px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1, marginBottom: "8px" }}>
            ≈ {montantMensuel.toLocaleString()}€
            {uniteLabel && <span style={{ fontSize: "22px", fontWeight: 400 }}>{uniteLabel}</span>}
          </div>
          <div style={{ fontSize: "13px", opacity: 0.85 }}>{sousText}</div>
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
            {nonEligibleTitle ?? "Profil non éligible"}
          </h3>
          <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
            {nonEligibleDesc ?? `Selon vos réponses, vous n'êtes probablement pas éligible. Vérifiez avec le simulateur officiel.`}
          </p>
        </div>
      )}

      {/* Plan d'action — ESTIMATION GRATUITE, ACTION PAYANTE.
          Le montant estimé reste visible par tous (hameçon + SEO) ; les étapes
          concrètes pour récupérer l'argent sont réservées aux abonnés. */}
      {notes.length > 0 &&
        (isPremium ? (
          <div style={{ background: T.bgWarm, borderRadius: "14px", padding: "18px 20px", marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
              ✅ Ton plan d&apos;action
            </div>
            {notes.map((note, i) => (
              <p key={i} style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.6, margin: i > 0 ? "12px 0 0" : 0 }}>
                {note}
              </p>
            ))}
          </div>
        ) : (
          <button
            onClick={onUpgrade}
            style={{
              width: "100%",
              textAlign: "left",
              background: T.bgWarm,
              borderRadius: "14px",
              padding: "18px 20px",
              marginBottom: "20px",
              border: `1px dashed ${T.border}`,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: T.navy, marginBottom: "6px" }}>
              🔒 Ton plan d&apos;action en {notes.length} étape{notes.length > 1 ? "s" : ""}
            </div>
            <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>
              Les étapes concrètes pour récupérer cet argent (démarches, résiliation,
              comparateurs, lettres types, pièges à éviter) sont réservées aux abonnés.
              <span style={{ color: T.blue, fontWeight: 700 }}> Débloquer →</span>
            </p>
          </button>
        ))}

      {/* Bouton démarche officielle */}
      <a
        href={simulateurUrl}
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
        {simulateurLabel}
      </a>

      {/* CTA Premium */}
      {eligible && guideKey && (
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
            🚀 {upsellTitle}
          </div>
          <ul style={{ margin: "0 0 16px", paddingLeft: "20px", fontSize: "13px", color: T.textSoft, lineHeight: 1.7 }}>
            {upsellBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
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
            {isPremium ? "📖 Voir le guide d'action" : hasAccount ? "Passer Premium" : "Débloquer le guide (3,49€/mois)"}
          </button>
        </div>
      )}

      {/* Refaire */}
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
        Estimation indicative basée sur le barème officiel du {dateBareme}.
        {baremeDisclaimer ? ` ${baremeDisclaimer}` : ""}
      </p>
    </div>
  );
}
