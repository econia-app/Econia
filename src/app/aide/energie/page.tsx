"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import { T, fonts } from "@/lib/theme";

import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import GuideModal from "@/components/GuideModal";
import MiniScanFlow from "@/components/mini-scan/MiniScanFlow";
import MiniScanResult from "@/components/mini-scan/MiniScanResult";

import {
  energieQuestions,
  diagnostiquerEnergie,
  type EnergieDiagnostic,
} from "@/lib/mini-scans/energie";
import { ENERGIE_2026 } from "@/lib/baremes-2026";

export default function EnergiePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EnergieDiagnostic | null>(null);

  const isPremium = profile?.is_premium || profile?.is_founder || false;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (p) setProfile(p as Profile);
      }
    });
  }, []);

  const handleAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    const nextIdx = qIdx + 1;
    if (nextIdx >= energieQuestions.length) {
      setResult(diagnostiquerEnergie(next));
      setStep("result");
    } else {
      setQIdx(nextIdx);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setQIdx(0);
    setStep("scan");
  };

  return (
    <>
      <Navbar
        user={user}
        profile={profile}
        onReset={() => router.push("/")}
        onLogout={async () => {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
        }}
        onShowAuth={() => setShowAuth(true)}
      />

      <main style={{ minHeight: "100vh", padding: "120px 20px 60px", background: T.bg }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <nav style={{ fontSize: "12px", color: T.textMuted, marginBottom: "16px" }}>
            <a href="/" style={{ color: T.textMuted, textDecoration: "none" }}>Accueil</a> ›{" "}
            <span style={{ color: T.navy }}>Énergie</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Ta facture d&apos;électricité<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  peut baisser sans effort
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Fournisseur jamais comparé, mauvaise option tarifaire, puissance trop élevée…
                5 questions pour repérer ce que tu paies en trop — et comment le récupérer, gratuitement.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  Au <strong>Tarif Bleu réglementé</strong>, tu paies souvent plus cher que nécessaire :
                  la majorité des offres de marché sont <strong>moins chères à consommation égale</strong>
                  (~100 à 170€/an d&apos;économie). À côté, une <strong>mauvaise option tarifaire</strong>
                  (Base au lieu d&apos;Heures Creuses) ou une <strong>puissance surdimensionnée</strong>
                  (~45€/an par palier en trop) gonflent la facture. Bonne nouvelle : changer de fournisseur,
                  d&apos;option ou de puissance est <strong>gratuit, sans coupure et réversible</strong> avec Linky.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Diagnostiquer ma facture →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 45 secondes · sans engagement
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Énergie
              </h1>
              <MiniScanFlow questions={energieQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton diagnostic
              </h1>
              <MiniScanResult
                config={{
                  leverName: "économie sur ta facture d'énergie",
                  montantMensuel: result.economieMax,
                  uniteMontant: "an",
                  montantAnnuel: result.economieMax,
                  sousMontantText: result.eligible
                    ? `entre ${result.economieMin.toLocaleString()}€ et ${result.economieMax.toLocaleString()}€/an récupérables · ${result.nbPistes} piste${result.nbPistes > 1 ? "s" : ""} détectée${result.nbPistes > 1 ? "s" : ""} · estimation prudente`
                    : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle: "Ta facture semble déjà bien optimisée",
                  nonEligibleDesc:
                    "Selon tes réponses, tu as déjà une offre de marché récente et la bonne option. Pense à recomparer chaque année : les prix de l'énergie bougent beaucoup.",
                  notes: result.actions,
                  simulateurUrl: ENERGIE_2026.simulateurUrl,
                  simulateurLabel: "Comparer les fournisseurs (comparateur officiel) →",
                  guideKey: "energie",
                  upsellTitle: "Le guide pour baisser ta facture sans te tromper",
                  upsellBullets: [
                    "Comment lire ta facture et repérer la bonne offre en 10 min",
                    "Le calcul pour savoir si les Heures Creuses sont rentables CHEZ TOI",
                    "Comment baisser ta puissance sans risquer de disjoncter",
                    "Les pièges des offres « à prix cassé » la première année",
                  ],
                  dateBareme: ENERGIE_2026.dateBareme,
                  baremeDisclaimer:
                    "Fourchette prudente basée sur les tarifs énergie 2026. Le chiffre exact dépend de ta consommation réelle (relevé Linky).",
                }}
                isPremium={isPremium}
                hasAccount={!!user}
                onUpgrade={() => (user ? alert("Stripe arrive bientôt. Pour activer Premium manuellement, contacte le support.") : setShowAuth(true))}
                onRetry={handleRetry}
                onOpenGuide={() => setOpenGuide("energie")}
              />
            </>
          )}
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}
