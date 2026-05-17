"use client";
import { T } from "@/lib/theme";
import { questions } from "@/lib/questions";

type Props = {
  qIdx: number;
  visNum: number;
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
};

export default function ScanFlow({ qIdx, visNum, answers, onAnswer }: Props) {
  if (qIdx >= questions.length) return null;
  const q = questions[qIdx];

  // Nombre de questions effectivement visibles pour ce profil (dynamique)
  // Pour chaque question conditionnelle, on évalue showIf avec les réponses
  // actuelles. Min 1 pour éviter division par 0.
  const totalVisible = Math.max(
    1,
    questions.filter((qq) => !qq.showIf || qq.showIf(answers)).length
  );
  // Bornage : le compteur affiché ne peut pas dépasser le total
  const displayNum = Math.min(visNum, totalVisible);
  const progressPct = (displayNum / totalVisible) * 100;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "100px 20px 40px", background: T.bg }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "13px", color: T.textMuted, fontWeight: 600 }}>
            {displayNum}/{totalVisible}
          </span>
          <div style={{ width: "140px", height: "5px", background: T.borderLight, borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${T.blue}, ${T.purple})`,
                borderRadius: "3px",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "6px", lineHeight: 1.2, letterSpacing: "-1px" }}>
          {q.q}
        </h2>
        {q.sub ? (
          <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "20px" }}>{q.sub}</p>
        ) : (
          <div style={{ height: "20px" }} />
        )}
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
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
