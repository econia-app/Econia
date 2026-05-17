"use client";
import { T, fonts, catLabels, catColors } from "@/lib/theme";
import { guides, gainToGuide } from "@/lib/guides";
import type { ScanResult, Gain } from "@/lib/analyze";

type Props = {
  data: ScanResult;
  user: { id: string; email: string } | null;
  isPremium: boolean;
  spotsLeft: number;
  onShowAuth: () => void;
  onOpenGuide: (key: string) => void;
  onReset: () => void;
};

export default function ResultsView({
  data,
  user,
  isPremium,
  spotsLeft,
  onShowAuth,
  onOpenGuide,
  onReset,
}: Props) {
  const grouped: Record<string, Gain[]> = {};
  data.gains.forEach((g) => {
    if (!grouped[g.cat]) grouped[g.cat] = [];
    grouped[g.cat].push(g);
  });

  // Moyenne arrondie au centaine pour ancrage psychologique
  const gainMoyen = Math.round(((data.gainMin + data.gainMax) / 2) / 100) * 100;

  return (
    <div style={{ minHeight: "100vh", padding: "100px 20px 40px", background: T.bg }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
          <h2 style={{ fontSize: "30px", fontWeight: 600, marginBottom: "6px", letterSpacing: "-1.5px" }}>
            Votre analyse Econia
          </h2>
          <p style={{ color: T.textSoft, fontSize: "14px" }}>
            {data.gains.length} {data.gains.length > 1 ? "pistes" : "piste"} d&apos;économies {data.gains.length > 1 ? "identifiées" : "identifiée"}
          </p>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            borderRadius: "20px",
            padding: "28px",
            color: "#fff",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>Gain potentiel estimé</div>
          <div style={{ fontFamily: fonts.title, fontSize: "44px", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1 }}>
            ≈ {gainMoyen.toLocaleString()}€
            <span style={{ fontSize: "18px", fontWeight: 400 }}>/an</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "8px" }}>
            Fourchette : {data.gainMin.toLocaleString()}€ — {data.gainMax.toLocaleString()}€ · hors aides déjà perçues
          </div>
        </div>

        {/* CTA Premium TOP — visible avant la liste des gains (corrige bug B4) */}
        {!isPremium && (
          <div
            style={{
              background: T.bgCard,
              border: `2px solid ${T.blue}`,
              borderRadius: "16px",
              padding: "18px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              boxShadow: "0 8px 24px rgba(37,99,235,0.08)",
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: T.navy, marginBottom: "2px" }}>
                🔓 Débloque les guides d&apos;action
              </div>
              <div style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.4 }}>
                {spotsLeft > 0 ? `Premium Founders : 1er mois gratuit · 3,49€/mois pendant 6 mois` : `Premium 6,99€/mois · sans engagement`}
              </div>
            </div>
            <button
              onClick={onShowAuth}
              style={{
                padding: "12px 22px",
                background: T.blue,
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                minHeight: 44,
              }}
            >
              {user ? "Passer Premium" : "Créer mon compte"}
            </button>
          </div>
        )}

        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.blue }} />
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                {catLabels[cat] || cat}
              </h3>
            </div>
            {items.map((g, i) => {
              const gk = gainToGuide[g.title];
              const gd = gk ? guides[gk] : null;
              return (
                <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "16px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "18px" }}>{g.icon}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700 }}>{g.title}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{g.desc}</p>
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: catColors[g.cat] || T.blue,
                        background: (catColors[g.cat] || T.blue) + "15",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g.montant}
                    </div>
                  </div>
                  {gd && (
                    <div style={{ marginTop: "12px", borderTop: `1px solid ${T.borderLight}`, paddingTop: "12px" }}>
                      {isPremium ? (
                        <button
                          onClick={() => onOpenGuide(gk)}
                          style={{ width: "100%", padding: "10px", background: T.blueLight, color: T.blue, border: `1px solid ${T.blue}33`, borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                        >
                          📖 Voir le guide pas à pas ({gd.steps.length} étapes)
                        </button>
                      ) : (
                        <button
                          onClick={() => (user ? undefined : onShowAuth())}
                          style={{ width: "100%", padding: "10px", background: T.bg, color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "10px", fontSize: "12px", cursor: "pointer" }}
                        >
                          🔒 Guide pas à pas ({gd.steps.length} étapes) —{" "}
                          {user ? "Econia Premium" : "Créez un compte"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {data.infos.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase", marginBottom: "12px" }}>
              💡 Bon à savoir
            </h3>
            {data.infos.map((info, i) => (
              <div key={i} style={{ background: T.blueLight, border: `1px solid ${T.blue}22`, borderRadius: "14px", padding: "16px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "18px" }}>{info.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: T.blue }}>{info.title}</span>
                </div>
                <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "14px", padding: "22px", textAlign: "center", marginTop: "28px" }}>
            <p style={{ fontSize: "15px", color: T.green, fontWeight: 700, marginBottom: "8px" }}>
              Créez votre compte pour sauvegarder vos résultats
            </p>
            <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "16px" }}>
              {spotsLeft > 0
                ? `50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois. Plus que ${spotsLeft} places.`
                : "Inscrivez-vous pour être prévenu(e) des prochaines offres."}
            </p>
            <button
              onClick={onShowAuth}
              style={{ padding: "12px 30px", background: T.green, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
            >
              Créer mon compte gratuit
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button onClick={onReset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
            Refaire un scan
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>
          Estimations indicatives basées sur les barèmes 2026.
        </p>
      </div>
    </div>
  );
}
