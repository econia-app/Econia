"use client";
import { T } from "@/lib/theme";

type Props = {
  onStartScan: () => void;
};

export default function FinalCta({ onStartScan }: Props) {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <h2 style={{ fontSize: "clamp(30px,5.5vw,48px)", fontWeight: 600, letterSpacing: "-2px", marginBottom: "8px", lineHeight: 1.08 }}>
        Combien tu perds
        <br />
        <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          sans le savoir
        </span>{" "}
        ?
      </h2>
      <p style={{ fontSize: "15px", color: T.textSoft, marginBottom: "12px" }}>3 minutes. Gratuit. Sans engagement.</p>
      <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px" }}>
        <strong style={{ color: T.amber, fontWeight: 600 }}>🎁 Offre 50 premiers :</strong> 1er mois gratuit + 6 mois à −50%
      </p>
      <button
        onClick={onStartScan}
        style={{ padding: "16px 34px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)" }}
      >
        Scanner ma situation →
      </button>
    </div>
  );
}
