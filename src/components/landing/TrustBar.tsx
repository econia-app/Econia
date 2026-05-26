"use client";
import { T } from "@/lib/theme";

/**
 * TrustBar V2 — sources officielles concrètes
 *
 * Remplace les 4 badges génériques (chiffrement / EU / 3 min / sans engagement)
 * par les 4 sources officielles sur lesquelles s'appuie réellement Econia.
 * C'est le signal de crédibilité #1 pour un service "argent perdu".
 */

const items = [
  {
    label: "CAF",
    sub: "Barèmes 2026",
    bg: T.blueLight,
    color: T.blue,
  },
  {
    label: "DGFiP",
    sub: "Service-Public.fr",
    bg: T.bgWarm,
    color: T.purple,
  },
  {
    label: "Légifrance",
    sub: "Textes en vigueur",
    bg: T.amberLight,
    color: T.amber,
  },
  {
    label: "RGPD",
    sub: "Hébergement EU",
    bg: T.greenLight,
    color: T.green,
  },
];

export default function TrustBar() {
  return (
    <div
      style={{
        padding: "26px 24px",
        background: T.bgCard,
        borderTop: `1px solid ${T.borderLight}`,
        borderBottom: `1px solid ${T.borderLight}`,
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          textAlign: "center",
          marginBottom: "16px",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: T.textMuted,
        }}
      >
        Données vérifiées — sources officielles
      </div>
      <div
        className="trust-bar"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: "12px",
              minWidth: 160,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                background: it.bg,
                color: it.color,
                letterSpacing: "-0.3px",
                flexShrink: 0,
              }}
            >
              {it.label.length <= 3 ? it.label : it.label.slice(0, 3)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: T.navy, lineHeight: 1.2 }}>
                {it.label}
              </div>
              <div style={{ fontSize: "11px", color: T.textMuted, lineHeight: 1.3 }}>
                {it.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
