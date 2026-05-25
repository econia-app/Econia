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

import { chequeEnergieQuestions, estimerChequeEnergie, type ChequeEnergieEstimation } from "@/lib/mini-scans/cheque-energie";
import { CHEQUE_ENERGIE_2026 } from "@/lib/baremes-2026";

export default function ChequeEnergiePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ChequeEnergieEstimation | null>(null);

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
    if (nextIdx >= chequeEnergieQuestions.length) {
      setResult(estimerChequeEnergie(next));
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
            <span style={{ color: T.navy }}>Chèque énergie</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Chèque énergie 2026<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  jusqu&apos;à 277€/an
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Versé automatiquement en avril pour aider à payer ta facture d&apos;énergie. 3 questions pour vérifier
                si tu es éligible et estimer ton montant.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  Le chèque énergie est versé chaque année aux foyers modestes pour les aider à payer électricité,
                  gaz, fioul ou travaux d&apos;isolation. Montant entre <strong>48€ et 277€/an</strong> selon revenus
                  et composition du foyer. Versement automatique entre avril et juin — pas besoin de demande.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Vérifier mon éligibilité →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 15 secondes · barème 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Chèque énergie
              </h1>
              <MiniScanFlow questions={chequeEnergieQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "Chèque énergie",
                  montantMensuel: result.montant,
                  uniteMontant: "an",
                  montantAnnuel: result.montant,
                  sousMontantText: result.eligible
                    ? `Versement automatique avril 2026 · RFR/UC ≈ ${result.rfrParUc.toLocaleString()}€`
                    : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle: "Revenus au-dessus du plafond chèque énergie",
                  nonEligibleDesc:
                    "Si tu es en difficulté ponctuelle, demande une aide auprès du FSL (Fonds de Solidarité Logement) de ton département.",
                  notes: result.notes,
                  simulateurUrl: CHEQUE_ENERGIE_2026.simulateurUrl,
                  simulateurLabel: "Vérifier sur chequeenergie.gouv.fr →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Utilise ton chèque énergie au mieux",
                  upsellBullets: [
                    "Comment l'utiliser pour des travaux d'isolation",
                    "Les fournisseurs qui acceptent le chèque",
                    "Cumul avec MaPrimeRénov' et CEE",
                    "Que faire si tu ne l'as pas reçu",
                  ],
                  dateBareme: CHEQUE_ENERGIE_2026.dateBareme,
                  baremeDisclaimer: "Calcul basé sur RFR/UC (1er adulte = 1 UC, 2e = 0,5, enfants = 0,3 chacun).",
                }}
                isPremium={isPremium}
                hasAccount={!!user}
                onUpgrade={() => (user ? alert("Stripe arrive bientôt. Pour activer Premium manuellement, contacte le support.") : setShowAuth(true))}
                onRetry={handleRetry}
                onOpenGuide={() => setOpenGuide("aides_sociales")}
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
