"use client";
import { useState, useEffect } from "react";
import { T, fonts } from "@/lib/theme";

type Props = {
  gainTitle: string;
  currentAmount?: number;
  onClose: () => void;
  onSave: (montant: number) => void;
};

/** Modal pour saisir le montant récupéré sur un levier */
export default function DeclareAmountModal({ gainTitle, currentAmount, onClose, onSave }: Props) {
  const [montant, setMontant] = useState<string>(currentAmount?.toString() ?? "");
  const [error, setError] = useState("");

  // Lock du scroll quand modal ouvert
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = () => {
    const value = parseInt(montant.replace(/\s/g, ""), 10);
    if (isNaN(value) || value < 0) {
      setError("Saisis un montant valide en euros.");
      return;
    }
    if (value > 100000) {
      setError("Montant supérieur à 100 000€ — vérifie ta saisie.");
      return;
    }
    onSave(value);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.bgCard,
          borderRadius: "20px",
          maxWidth: "420px",
          width: "100%",
          padding: "28px",
          boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
          border: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, fontFamily: fonts.title, margin: 0 }}>
            Bravo !
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: T.textMuted,
              cursor: "pointer",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: "14px", color: T.textSoft, marginBottom: "20px", lineHeight: 1.6 }}>
          Combien tu as récupéré sur le levier <strong style={{ color: T.navy }}>{gainTitle}</strong> ?
          Ce montant sera ajouté à ton compteur &quot;déjà récupéré à vie&quot;.
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500 }}>
            MONTANT RÉCUPÉRÉ (€)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="500"
              style={{
                width: "100%",
                padding: "14px 36px 14px 16px",
                border: `1.5px solid ${error ? T.red : T.border}`,
                borderRadius: "12px",
                fontSize: "20px",
                fontWeight: 600,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: fonts.title,
              }}
            />
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: T.textMuted, fontSize: "16px" }}>
              €
            </span>
          </div>
          {error && <p style={{ color: T.red, fontSize: "12px", marginTop: "6px" }}>{error}</p>}
        </div>

        <p style={{ fontSize: "12px", color: T.textMuted, marginBottom: "20px", lineHeight: 1.5 }}>
          💡 Indique le montant brut récupéré sur 12 mois (ou ponctuel s&apos;il s&apos;agit d&apos;une aide unique).
        </p>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "14px",
            background: T.green,
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            minHeight: 48,
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
