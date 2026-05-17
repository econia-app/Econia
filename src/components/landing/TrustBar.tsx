"use client";
import { T } from "@/lib/theme";

const items = [
  { icon: "🔒", label: "Données chiffrées", bg: T.bgWarm },
  { icon: "🇪🇺", label: "Hébergement européen", bg: T.blueLight },
  { icon: "⚡", label: "Résultat en 3 min", bg: T.greenLight },
  { icon: "✕", label: "Sans engagement", bg: T.amberLight },
];

export default function TrustBar() {
  return (
    <div style={{ padding: "24px", background: T.bgCard, borderTop: `1px solid ${T.borderLight}`, borderBottom: `1px solid ${T.borderLight}` }}>
      <div className="trust-bar" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "36px", flexWrap: "wrap" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: T.textSoft, fontWeight: 500 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: it.bg }}>
              {it.icon}
            </div>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}
