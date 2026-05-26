"use client";
import { useEffect, useState } from "react";
import { T, fonts } from "@/lib/theme";

type Props = {
  spotsLeft: number;
  onStartScan: () => void;
};

/**
 * Hero V2 — version mai 2026
 *
 * Changements vs V1 :
 *  - Hook chiffré direct dans le H1 ("500€/an", "sans le savoir")
 *  - Sources officielles affichées sous le H1 (CAF / DGFiP / Service-Public.fr / Légifrance)
 *  - Mockup statique remplacé par la "Jauge Econia" — élément signature animé :
 *    barre 6 couleurs qui se remplit + compteur 0 → 520€ au mount.
 *  - CTA secondaire renommé "Voir un exemple en 30s"
 *  - Tutoiement complet (cohérent avec le scan / mini-scans / dashboard)
 */

const JAUGE_SEGMENTS = [
  { cat: "Aides", color: T.blue, amount: 198, flex: 38 },
  { cat: "Assurance", color: T.purple, amount: 114, flex: 22 },
  { cat: "Abos", color: T.amber, amount: 94, flex: 18 },
  { cat: "Énergie", color: T.red, amount: 52, flex: 10 },
  { cat: "Fin d'offre", color: T.green, amount: 42, flex: 8 },
  { cat: "Mobilité", color: T.textLight, amount: 20, flex: 4 },
] as const;

const JAUGE_TOTAL = JAUGE_SEGMENTS.reduce((s, x) => s + x.amount, 0); // 520

export default function Hero({ spotsLeft, onStartScan }: Props) {
  // Compteur animé 0 → 520€ au mount
  const [displayed, setDisplayed] = useState(0);
  const [jaugeReveal, setJaugeReveal] = useState(false);

  useEffect(() => {
    // Respecte prefers-reduced-motion
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplayed(JAUGE_TOTAL);
      setJaugeReveal(true);
      return;
    }
    const t1 = setTimeout(() => setJaugeReveal(true), 350);
    const t2 = setTimeout(() => {
      const start = performance.now();
      const dur = 1400;
      let raf = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        // easeOutCubic
        const e = 1 - Math.pow(1 - p, 3);
        setDisplayed(Math.round(JAUGE_TOTAL * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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
      {/* Décor de fond : blobs + grille de points (inchangé V1) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(37,99,235,0.1)", top: "-150px", left: "-50px", animation: "drift 25s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(124,58,237,0.07)", bottom: "-100px", right: "-50px", animation: "drift 25s ease-in-out 12s infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(37,99,235,0.06) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ─────────── Colonne gauche : texte + CTA ─────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Compteur places restantes */}
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
            marginBottom: "22px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.green, boxShadow: "0 0 0 3px rgba(5,150,105,0.2)", animation: "blink 2s infinite" }} />
          Plus que <strong style={{ color: T.navy, fontWeight: 600 }}>{spotsLeft} places</strong> gratuites sur 50
        </div>

        {/* H1 — hook chiffré */}
        <h1
          className="anim d2"
          style={{
            fontSize: "clamp(34px,5.5vw,56px)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-2.5px",
            marginBottom: "16px",
          }}
        >
          Tu perds en moyenne{" "}
          <span style={{ color: T.blue }}>500€ par an</span>
          <br />
          sans le savoir.
        </h1>

        {/* Sous-titre */}
        <p
          className="anim d3 hero-p"
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: T.textSoft,
            maxWidth: "480px",
            marginBottom: "14px",
          }}
        >
          Econia scanne ta situation en 3 minutes et te montre exactement où ton argent file. Aides oubliées, doublons d&apos;assurance, abonnements fantômes, factures mal optimisées.
        </p>

        {/* Sources officielles (gain de crédibilité) */}
        <div
          className="anim d3"
          style={{
            fontSize: "11px",
            color: T.textMuted,
            marginBottom: "26px",
            lineHeight: 1.6,
          }}
        >
          Sources :{" "}
          <strong style={{ color: T.navy, fontWeight: 600 }}>CAF</strong> ·{" "}
          <strong style={{ color: T.navy, fontWeight: 600 }}>DGFiP</strong> ·{" "}
          <strong style={{ color: T.navy, fontWeight: 600 }}>Service-Public.fr</strong> ·{" "}
          <strong style={{ color: T.navy, fontWeight: 600 }}>Légifrance</strong>{" "}
          · barèmes 2026
        </div>

        {/* CTA principal + secondaire */}
        <div
          className="anim d4 hero-btns"
          style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}
        >
          <button
            onClick={onStartScan}
            style={{
              padding: "16px 34px",
              background: T.blue,
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(37,99,235,0.15)",
            }}
          >
            Scanner ma situation →
          </button>
          <button
            onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "16px 34px",
              background: T.bgCard,
              color: T.navy,
              border: `1.5px solid ${T.border}`,
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Voir un exemple
          </button>
        </div>

        {/* Stats sous CTA */}
        <div className="anim d5 hero-stats" style={{ display: "flex", gap: "28px" }}>
          {[
            { v: "10 Mds€", l: "Aides non réclamées/an" },
            { v: "~500€", l: "Économie moy./an" },
            { v: "3 min", l: "Durée du scan" },
          ].map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: fonts.title,
                  fontSize: "20px",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: "11px", color: T.textMuted, marginTop: "1px" }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────── Colonne droite : JAUGE ECONIA (élément signature) ─────────── */}
      <div
        className="anim d5 hero-card-wrap"
        style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}
      >
        <div
          className="hero-card"
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: "22px",
            padding: "26px",
            boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
            position: "relative",
            zIndex: 2,
            maxWidth: 440,
            width: "100%",
          }}
        >
          {/* Header carte */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontSize: "12px", color: T.textMuted, fontWeight: 500 }}>
              Jauge Econia · exemple de profil
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: T.green,
                background: T.greenLight,
                padding: "3px 9px",
                borderRadius: "6px",
              }}
            >
              7 pistes
            </span>
          </div>

          {/* Compteur animé */}
          <div
            style={{
              fontFamily: fonts.title,
              fontSize: "42px",
              fontWeight: 700,
              color: T.navy,
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: "4px",
            }}
            aria-live="polite"
          >
            {displayed.toLocaleString()}€
            <span style={{ fontSize: "16px", fontWeight: 400, color: T.textMuted, letterSpacing: 0 }}>
              {" "}/an récupérables
            </span>
          </div>
          <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "18px" }}>
            Salarié, 32 ans, locataire · estimation indicative
          </div>

          {/* La barre signature 6 segments */}
          <div
            style={{
              display: "flex",
              height: "14px",
              borderRadius: "8px",
              overflow: "hidden",
              gap: "2px",
              marginBottom: "16px",
              background: T.borderLight,
            }}
            role="img"
            aria-label={`Répartition par catégorie pour un total de ${JAUGE_TOTAL}€ par an`}
          >
            {JAUGE_SEGMENTS.map((seg, i) => (
              <div
                key={i}
                style={{
                  flex: jaugeReveal ? seg.flex : 0,
                  background: seg.color,
                  transition: `flex 800ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
                  minWidth: jaugeReveal ? 2 : 0,
                }}
              />
            ))}
          </div>

          {/* Légende détaillée */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 18px",
              fontSize: "12px",
            }}
          >
            {JAUGE_SEGMENTS.map((seg, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    background: seg.color,
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: T.textSoft }}>{seg.cat}</span>
                <strong
                  style={{
                    color: T.navy,
                    marginLeft: "auto",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {seg.amount}€
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
