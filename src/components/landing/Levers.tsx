"use client";
import { T } from "@/lib/theme";

const levers = [
  {
    icon: "🏛️",
    iconBg: "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.1))",
    title: "Aides sociales non réclamées",
    desc: "RSA, prime d'activité, APL, CSS, AAH",
    range: "600 — 7 000€",
  },
  {
    icon: "🛡️",
    iconBg: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.1))",
    title: "Assurances non optimisées",
    desc: "Comparaison, négociation, doublons CB",
    range: "150 — 1 200€",
  },
  {
    icon: "📱",
    iconBg: "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(249,115,22,0.1))",
    title: "Abonnements fantômes",
    desc: "Détection, résiliation, alertes fin d'offre",
    range: "200 — 500€",
  },
  {
    icon: "⚡",
    iconBg: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(37,99,235,0.1))",
    title: "Énergie non optimisée",
    desc: "Fournisseur, option tarifaire, puissance",
    range: "100 — 300€",
  },
  {
    icon: "⏰",
    iconBg: "linear-gradient(135deg,rgba(239,68,68,0.15),rgba(249,115,22,0.1))",
    title: "Fins d'offre oubliées",
    desc: "Alertes + scripts de négociation",
    range: "100 — 400€",
  },
  {
    icon: "🚗",
    iconBg: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(6,182,212,0.1))",
    title: "Aides mobilité & véhicule",
    desc: "Leasing social, bonus écologique, rétrofit",
    range: "1 500 — 9 500€",
    spanLast: true,
  },
];

export default function Levers() {
  return (
    <div
      id="detect"
      className="levers-bg"
      style={{
        background: T.navy,
        borderRadius: "28px",
        margin: "0 24px",
        padding: "80px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle,rgba(37,99,235,0.12),transparent 70%)", borderRadius: "50%" }} />
      <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
          Sources d&apos;économie
        </div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px", color: "#fff" }}>
          6 leviers. Des milliers
          <br />
          d&apos;euros récupérables.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>
          Chaque levier a son guide d&apos;action complet, vérifié et à jour.
        </p>
        <div className="lev-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {levers.map((lev, i) => (
            <div
              key={i}
              className={lev.spanLast ? "lev-last" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "18px 20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                gridColumn: lev.spanLast ? "span 2" : undefined,
              }}
            >
              <div style={{ width: "46px", height: "46px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", background: lev.iconBg }}>
                {lev.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "1px" }}>{lev.title}</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{lev.desc}</p>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: T.green, background: "rgba(5,150,105,0.12)", padding: "5px 12px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                {lev.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
