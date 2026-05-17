"use client";
import { T, fonts } from "@/lib/theme";

type Props = {
  onStartScan: () => void;
  onSignup: () => void;
};

const freeFeatures = [
  { ok: true, label: "Scan complet en 3 minutes" },
  { ok: true, label: "Résultats personnalisés" },
  { ok: true, label: "Liste des pistes détectées" },
  { ok: false, label: "Guides pas à pas" },
  { ok: false, label: "Scripts de négociation" },
  { ok: false, label: "Alertes proactives" },
];

const premiumFeatures = [
  "Tout le gratuit inclus",
  "Guides d'action pas à pas",
  "Scripts de négociation personnalisés",
  "Alertes fin d'offre proactives",
  "Coffre-fort documents",
  "Compteur de gains temps réel",
];

export default function Pricing({ onStartScan, onSignup }: Props) {
  return (
    <section id="prix" className="section" style={{ background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgWarm} 100%)`, padding: "110px 24px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>Tarifs</div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>
          Transparent. Sans piège.
        </h2>
        <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>
          Le scan est gratuit. L&apos;accompagnement complet est réservé aux membres Premium.
        </p>

        <div className="pr-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "800px" }}>
          {/* Gratuit */}
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "24px", padding: "40px 36px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px", color: T.textMuted }}>Gratuit</div>
            <div style={{ fontFamily: fonts.title, fontSize: "48px", fontWeight: 700, letterSpacing: "-2px", marginBottom: "4px" }}>0€</div>
            <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px" }}>Pour tout le monde, sans inscription</div>
            <ul style={{ listStyle: "none", marginBottom: "36px", padding: 0 }}>
              {freeFeatures.map((f, i) => (
                <li key={i} style={{ padding: "7px 0", fontSize: "14px", color: T.textSoft, display: "flex", alignItems: "center", gap: "10px", opacity: f.ok ? 1 : 0.35 }}>
                  <span style={{ color: f.ok ? T.green : T.textLight, fontWeight: 800 }}>{f.ok ? "✓" : "✗"}</span>
                  {f.label}
                </li>
              ))}
            </ul>
            <button
              onClick={onStartScan}
              style={{ width: "100%", padding: "16px", background: T.bg, color: T.navy, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
            >
              Lancer le scan
            </button>
          </div>

          {/* Premium */}
          <div style={{ background: T.bgCard, border: `2px solid ${T.blue}`, borderRadius: "24px", padding: "40px 36px", position: "relative", boxShadow: "0 20px 60px rgba(15,23,42,0.1), 0 0 0 4px rgba(37,99,235,0.06)" }}>
            <div style={{ position: "absolute", top: "18px", right: "18px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", padding: "6px 14px", borderRadius: "8px", background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff" }}>
              50 premiers
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px", color: T.blue }}>Premium</div>
            <div style={{ fontFamily: fonts.title, fontSize: "48px", fontWeight: 700, letterSpacing: "-2px", marginBottom: "4px" }}>
              3,49€ <small style={{ fontSize: "16px", fontWeight: 400, color: T.textMuted, letterSpacing: 0 }}>/mois</small>
            </div>
            <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px" }}>
              1er mois gratuit · 6 premiers mois à −50%
              <br />
              puis 6,99€/mois · sans engagement
            </div>
            <ul style={{ listStyle: "none", marginBottom: "36px", padding: 0 }}>
              {premiumFeatures.map((f, i) => (
                <li key={i} style={{ padding: "7px 0", fontSize: "14px", color: T.textSoft, display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: T.green, fontWeight: 800 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onSignup}
              style={{ width: "100%", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)" }}
            >
              Rejoindre les 50 premiers →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
