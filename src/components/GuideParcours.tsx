"use client";
/**
 * GuideParcours — version interactive et "ludique" d'un guide Premium.
 *
 * Remplace l'affichage passif (GuideModal) pour les abonnés : chaque étape se
 * coche, la progression est visible (barre + X/N), le ton encourage, et UNIQUEMENT
 * à la fin (toutes les étapes faites) on propose de déclarer le montant récupéré.
 * La progression (doneSteps) est sauvegardée par le parent dans guide_progress.
 */
import { guides } from "@/lib/guides";
import { T, fonts } from "@/lib/theme";

type Props = {
  guideKey: string;
  /** Index des étapes déjà cochées. */
  doneSteps: number[];
  onToggleStep: (index: number) => void;
  /** L'utilisateur a tout fait et clique "Déclarer mon gain". */
  onComplete: () => void;
  /** Ouvrir le dossier (pour renseigner ses contrats). */
  onOpenDossier: () => void;
  onClose: () => void;
};

const ENCOURAGEMENTS = [
  "Allez, on attaque — 5 min par étape et c'est de l'argent récupéré.",
  "C'est parti ! Chaque étape te rapproche du but.",
  "Bien joué, continue sur ta lancée.",
  "Tu avances bien — garde le rythme.",
  "Belle progression, lâche rien.",
  "Plus de la moitié du chemin, tu gères.",
  "Tu y es presque, encore un petit effort.",
  "Dernière ligne droite…",
];

export default function GuideParcours({
  guideKey,
  doneSteps,
  onToggleStep,
  onComplete,
  onOpenDossier,
  onClose,
}: Props) {
  const guide = guides[guideKey];
  if (!guide) return null;

  const total = guide.steps.length;
  const done = doneSteps.length;
  const pct = Math.round((done / total) * 100);
  const allDone = done >= total;
  const encourage = allDone
    ? "Parcours terminé — bravo, tu as fait le plus dur !"
    : ENCOURAGEMENTS[Math.min(done, ENCOURAGEMENTS.length - 1)];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.bgCard, borderRadius: "20px", maxWidth: "640px", width: "100%", marginTop: "50px", marginBottom: "40px", border: `1px solid ${T.border}` }}>
        {/* En-tête */}
        <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "21px", fontWeight: 700, marginBottom: "6px", fontFamily: fonts.title }}>{guide.title}</h2>
            <div style={{ fontSize: "12px", color: T.textMuted, display: "flex", gap: "12px" }}>
              <span>⏱ {guide.time}</span>
              <span>📊 {guide.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer", width: 44, height: 44, flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* Progression */}
        <div style={{ padding: "16px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.navy }}>
              Étape {Math.min(done + (allDone ? 0 : 1), total)} / {total}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.green }}>{pct}%</span>
          </div>
          <div style={{ height: "8px", background: T.borderLight, borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: T.green, borderRadius: "99px", transition: "width .35s" }} />
          </div>
          <p style={{ fontSize: "13px", color: T.textSoft, margin: "10px 0 0" }}>{encourage}</p>

          {/* Accès dossier */}
          <button
            onClick={onOpenDossier}
            style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: T.blueLight, color: T.blue, border: `1px solid ${T.blue}33`, borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
          >
            📁 Renseigner mes contrats dans mon dossier →
          </button>
        </div>

        {/* Étapes */}
        <div style={{ padding: "18px 24px 8px" }}>
          {guide.steps.map((s, i) => {
            const isDone = doneSteps.includes(i);
            return (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 0", borderBottom: i < total - 1 ? `1px solid ${T.borderLight}` : "none" }}>
                <button
                  onClick={() => onToggleStep(i)}
                  aria-label={isDone ? "Marquer comme à faire" : "Marquer comme fait"}
                  style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", border: isDone ? "none" : `1.5px solid ${T.border}`, background: isDone ? T.green : "transparent", color: isDone ? "#fff" : T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, marginTop: "2px" }}
                >
                  {isDone ? "✓" : i + 1}
                </button>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px", color: isDone ? T.textMuted : T.navy, textDecoration: isDone ? "line-through" : "none" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>{s.content}</p>
                  <button
                    onClick={() => onToggleStep(i)}
                    style={{ marginTop: "8px", padding: "6px 12px", background: isDone ? T.greenLight : T.bg, color: isDone ? T.green : T.textSoft, border: `1px solid ${isDone ? T.green + "33" : T.border}`, borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    {isDone ? "✓ Fait" : "Marquer comme fait"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victoire + déclaration (montant seulement à la fin) */}
        {allDone && (
          <div style={{ margin: "8px 24px 0", background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "16px", padding: "22px", textAlign: "center" }}>
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>🎉</div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: T.green, margin: "0 0 6px" }}>Bravo, parcours bouclé !</p>
            <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.6, margin: "0 0 16px" }}>
              Tu as fait le plus dur. Combien as-tu récupéré au final ? Déclare-le pour l&apos;ajouter à ton total d&apos;économies.
            </p>
            <button
              onClick={onComplete}
              style={{ padding: "13px 30px", background: T.green, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: 44 }}
            >
              💰 Déclarer mon gain
            </button>
          </div>
        )}

        <div style={{ padding: "20px 24px 24px", textAlign: "center" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
            Fermer (ta progression est sauvegardée)
          </button>
        </div>
      </div>
    </div>
  );
}
