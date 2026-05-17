"use client";
import { guides } from "@/lib/guides";
import { T, fonts } from "@/lib/theme";

type Props = {
  guideKey: string;
  onClose: () => void;
};

export default function GuideModal({ guideKey, onClose }: Props) {
  const guide = guides[guideKey];
  if (!guide) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.bgCard, borderRadius: "20px", maxWidth: "640px", width: "100%", marginTop: "60px", marginBottom: "40px", border: `1px solid ${T.border}` }}>
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", fontFamily: fonts.title }}>{guide.title}</h2>
            <div style={{ fontSize: "12px", color: T.textMuted, display: "flex", gap: "12px" }}>
              <span>⏱ {guide.time}</span>
              <span>📊 {guide.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>
        <div style={{ padding: "24px" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "start", marginBottom: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: T.blueLight, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{s.title}</h3>
              </div>
              <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.75, marginLeft: "40px" }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
          <button onClick={onClose} style={{ padding: "12px 32px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
