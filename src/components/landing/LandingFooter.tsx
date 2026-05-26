"use client";
import { T, fonts } from "@/lib/theme";

export default function LandingFooter() {
  return (
    <footer style={{ background: T.navy, color: "rgba(255,255,255,0.4)", padding: "56px 32px 28px" }}>
      <div className="landing-footer-grid" style={{ maxWidth: "1080px", margin: "0 auto", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: fonts.title, fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            ec
            <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              o
            </span>
            nia
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.7, maxWidth: "260px" }}>
            L&apos;agent IA qui détecte l&apos;argent que tu perds sans le savoir et t&apos;accompagne pour le récupérer.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
            Produit
          </h4>
          <a href="#how" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Fonctionnement</a>
          <a href="#detect" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Économies</a>
          <a href="#prix" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Tarifs</a>
          <a href="#faq" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>FAQ</a>
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
            Légal
          </h4>
          <a href="/mentions-legales" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Mentions légales</a>
          <a href="/confidentialite" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Confidentialité</a>
          <a href="/cgu" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>CGU</a>
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
            Contact
          </h4>
          <a href="mailto:econia.app@gmail.com" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>
            econia.app@gmail.com
          </a>
        </div>
      </div>
      <div style={{ maxWidth: "1080px", margin: "0 auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.25)", flexWrap: "wrap", gap: "8px" }}>
        <span>© 2026 Econia — Estimations indicatives basées sur les barèmes officiels</span>
        <span>Fait en France 🇫🇷</span>
      </div>
    </footer>
  );
}
