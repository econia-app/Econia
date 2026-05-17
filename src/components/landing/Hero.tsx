"use client";
import { T, fonts } from "@/lib/theme";

type Props = {
  spotsLeft: number;
  onStartScan: () => void;
};

export default function Hero({ spotsLeft, onStartScan }: Props) {
  return (
    <div
      className="hero hero-grid"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "48px",
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "130px 32px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Décor de fond : blobs + grille de points */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(37,99,235,0.1)", top: "-150px", left: "-50px", animation: "drift 25s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(124,58,237,0.07)", bottom: "-100px", right: "-50px", animation: "drift 25s ease-in-out 12s infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(37,99,235,0.06) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* Colonne gauche : texte + CTA */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="anim d1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 16px 7px 10px",
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: 500,
            color: T.textSoft,
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.green, boxShadow: "0 0 0 3px rgba(5,150,105,0.2)", animation: "blink 2s infinite" }} />
          Plus que <strong style={{ color: T.navy, fontWeight: 600 }}>{spotsLeft} places</strong> gratuites sur 50
        </div>
        <h1 className="anim d2" style={{ fontSize: "clamp(34px,5.5vw,56px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-2.5px", marginBottom: "18px" }}>
          Récupérez l&apos;argent que vous perdez{" "}
          <span style={{ position: "relative", display: "inline-block" }}>chaque mois</span>
        </h1>
        <p className="anim d3 hero-p" style={{ fontSize: "16px", lineHeight: 1.75, color: T.textSoft, maxWidth: "440px", marginBottom: "32px" }}>
          Econia scanne votre situation en 3 minutes et identifie chaque euro que vous pourriez récupérer.
        </p>
        <div className="anim d4 hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
          <button
            onClick={onStartScan}
            style={{ padding: "16px 34px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)" }}
          >
            Scanner ma situation →
          </button>
          <button
            onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "16px 34px", background: T.bgCard, color: T.navy, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            Comment ça marche
          </button>
        </div>
        <div className="anim d5 hero-stats" style={{ display: "flex", gap: "28px" }}>
          {[
            { v: "10 Mds€", l: "Aides non réclamées/an" },
            { v: "~500€", l: "Économie moy./an" },
            { v: "3 min", l: "Durée du scan" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: fonts.title, fontSize: "20px", fontWeight: 700, background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.v}
              </div>
              <div style={{ fontSize: "11px", color: T.textMuted, marginTop: "1px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Colonne droite : carte d'analyse mockup */}
      <div className="anim d5 hero-card-wrap" style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", maxWidth: "400px", width: "100%" }}>
          {/* Card flottante top-right : doublon détecté (feature reveal, sans chiffre additionnel) */}
          <div className="hero-float hero-float-tr" style={{ position: "absolute", top: "-16px", right: "-24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 32px rgba(15,23,42,0.06)", zIndex: 3, display: "flex", alignItems: "center", gap: "10px", animation: "float 5s ease-in-out infinite" }}>
            <span style={{ fontSize: "18px" }}>💳</span>
            <div style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>
              Doublon détecté
              <br />
              <small style={{ fontWeight: 400, color: T.textMuted, fontSize: "11px" }}>Assurance déjà incluse</small>
            </div>
          </div>

          {/* Carte centrale */}
          <div className="hero-card" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "22px", padding: "28px", boxShadow: "0 20px 60px rgba(15,23,42,0.1)", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>Votre analyse Econia</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: T.green, background: T.greenLight, padding: "4px 10px", borderRadius: "6px" }}>✓ 7 pistes</div>
            </div>
            <div style={{ fontFamily: fonts.title, fontSize: "38px", fontWeight: 700, letterSpacing: "-2px", marginBottom: "2px" }}>
              520€
              <span style={{ fontSize: "15px", fontWeight: 400, color: T.textMuted, letterSpacing: 0 }}> /an</span>
            </div>
            <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "20px" }}>Exemple de profil — gain identifié</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: "🛡️", title: "Assurance habitation", sub: "Non comparée", amount: "+18€/mois" },
                { icon: "📱", title: "2 abonnements", sub: "Probablement inutilisés", amount: "+19€/mois" },
                { icon: "⚡", title: "Énergie", sub: "Fournisseur non comparé", amount: "+6€/mois" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: T.bg, border: `1px solid ${T.borderLight}`, borderRadius: "12px" }}>
                  <span style={{ fontSize: "18px" }}>{row.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{row.title}</div>
                    <div style={{ fontSize: "11px", color: T.textMuted }}>{row.sub}</div>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: T.green }}>{row.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card flottante bottom-left : Alerte fin d'offre */}
          <div className="hero-float hero-float-bl" style={{ position: "absolute", bottom: "-12px", left: "-20px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 32px rgba(15,23,42,0.06)", zIndex: 3, display: "flex", alignItems: "center", gap: "10px", animation: "float 5s ease-in-out 2.5s infinite" }}>
            <span style={{ fontSize: "18px" }}>⏰</span>
            <div style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>
              Alerte fin d&apos;offre
              <br />
              <small style={{ fontWeight: 400, color: T.textMuted, fontSize: "11px" }}>Free → 19,99€ dans 28j</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
