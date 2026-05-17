"use client";
import { T, fonts } from "@/lib/theme";

const steps = [
  {
    n: "01",
    title: "Répondez au scan",
    desc: "19 questions simples. Revenus, logement, famille, assurances. 3 minutes, aucun document.",
  },
  {
    n: "02",
    title: "Découvrez vos pistes",
    desc: "Econia croise votre profil avec les barèmes officiels 2026. Résultat instantané, chaque euro identifié.",
  },
  {
    n: "03",
    title: "Passez à l'action",
    desc: "Guides pas à pas, scripts de négociation, alertes. On vous accompagne jusqu'au bout.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section" style={{ padding: "110px 24px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>
          Fonctionnement
        </div>
        <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>
          Trois étapes.
          <br />
          Zéro prise de tête.
        </h2>
        <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>
          Econia fait le travail. Vous récoltez.
        </p>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "22px", padding: "36px 28px" }}>
              <div style={{ fontFamily: fonts.title, fontSize: "48px", fontWeight: 700, lineHeight: 1, marginBottom: "16px", WebkitTextStroke: `1.5px ${T.border}`, color: "transparent" }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "8px" }}>{s.title}</h3>
              <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
