"use client";
import { T, fonts } from "@/lib/theme";

type Props = {
  gainPotentielMin: number;
  gainPotentielMax: number;
  gainRecupere: number;
  nbPistes: number;
};

/** Bloc principal : gain potentiel restant + déjà récupéré (lifetime counter) */
export default function GainSummary({ gainPotentielMin, gainPotentielMax, gainRecupere, nbPistes }: Props) {
  const gainMoyen = Math.round(((gainPotentielMin + gainPotentielMax) / 2) / 100) * 100;

  return (
    <div style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }} className="dash-gain-grid">
      {/* Bloc gain potentiel */}
      <div
        style={{
          background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
          borderRadius: "20px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.75, marginBottom: "4px", fontWeight: 500 }}>
          Gain potentiel à récupérer
        </div>
        <div style={{ fontFamily: fonts.title, fontSize: "clamp(34px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: "8px" }}>
          ≈ {gainMoyen.toLocaleString()}€<span style={{ fontSize: "18px", fontWeight: 400 }}>/an</span>
        </div>
        <div style={{ fontSize: "12px", opacity: 0.85 }}>
          {nbPistes} {nbPistes > 1 ? "pistes identifiées" : "piste identifiée"} ·
          {" "}fourchette {gainPotentielMin.toLocaleString()}€ — {gainPotentielMax.toLocaleString()}€
        </div>
      </div>

      {/* Bloc compteur lifetime */}
      <div
        style={{
          background: T.bgCard,
          border: `1.5px solid ${T.green}33`,
          borderRadius: "20px",
          padding: "24px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "4px", fontWeight: 500 }}>
          Déjà récupéré
        </div>
        <div style={{ fontFamily: fonts.title, fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1, color: T.green, marginBottom: "4px" }}>
          {gainRecupere.toLocaleString()}€
        </div>
        <div style={{ fontSize: "12px", color: T.textMuted }}>
          déclaré à vie
        </div>
      </div>
    </div>
  );
}
