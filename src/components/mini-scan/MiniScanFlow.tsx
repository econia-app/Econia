"use client";
/**
 * MiniScanFlow — flow générique pour un mini-scan (3-5 questions ciblées).
 *
 * Réutilisable pour tous les leviers (Prime activité, RSA, APL, etc.).
 * État géré côté parent : on lui notifie chaque réponse et il décide
 * quand passer en step "résultat".
 */
import { T, fonts } from "@/lib/theme";
import type { MiniScanQuestion } from "@/lib/mini-scans/prime-activite";

type Props = {
  /** Liste des questions du mini-scan */
  questions: MiniScanQuestion[];
  /** Index de la question courante */
  qIdx: number;
  /** Couleur d'accent du mini-scan (par thématique : bleu pour aides, etc.) */
  accentColor?: string;
  /** Callback à chaque réponse */
  onAnswer: (id: string, value: string) => void;
};

export default function MiniScanFlow({ questions, qIdx, accentColor = T.blue, onAnswer }: Props) {
  if (qIdx >= questions.length) return null;
  const q = questions[qIdx];
  const progressPct = ((qIdx + 1) / questions.length) * 100;

  return (
    <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto" }}>
      {/* Header progression */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <span style={{ fontSize: "13px", color: T.textMuted, fontWeight: 600 }}>
          Question {qIdx + 1} / {questions.length}
        </span>
        <div style={{ width: "140px", height: "5px", background: T.borderLight, borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              width: `${progressPct}%`,
              height: "100%",
              background: accentColor,
              borderRadius: "3px",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 style={{ fontFamily: fonts.title, fontSize: "26px", fontWeight: 600, marginBottom: "6px", lineHeight: 1.2, letterSpacing: "-1px" }}>
        {q.q}
      </h2>
      {q.sub ? (
        <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "20px" }}>{q.sub}</p>
      ) : (
        <div style={{ height: "20px" }} />
      )}

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => onAnswer(q.id, o.value)}
            style={{
              padding: "16px 20px",
              background: T.bgCard,
              border: `1.5px solid ${T.border}`,
              borderRadius: "14px",
              fontSize: "15px",
              color: T.text,
              cursor: "pointer",
              textAlign: "left",
              fontWeight: 500,
              minHeight: 56,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
