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

import { aspaQuestions, estimerAspa, type AspaEstimation } from "@/lib/mini-scans/aspa";
import { ASPA_2026 } from "@/lib/baremes-2026";

export default function AspaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AspaEstimation | null>(null);

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
    if (nextIdx >= aspaQuestions.length) {
      setResult(estimerAspa(next));
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
            <span style={{ color: T.navy }}>Minimum vieillesse (ASPA)</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Minimum vieillesse<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  jusqu&apos;à 1 052€/mois
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                L&apos;Allocation de Solidarité aux Personnes Âgées (ASPA) garantit un revenu minimum aux retraités
                modestes. 3 questions pour estimer le complément mensuel possible.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  L&apos;ASPA est versée à partir de 65 ans (ou 60 ans en cas d&apos;inaptitude au travail) aux
                  personnes dont les ressources sont inférieures aux plafonds. Plafond mensuel en 2026 :
                  <strong> 1 052€/mois (seul)</strong> ou <strong>1 634€/mois (couple)</strong>. C&apos;est une
                  allocation différentielle qui complète tes autres revenus jusqu&apos;à ce plafond.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Calculer mon ASPA →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 15 secondes · barème avril 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan minimum vieillesse
              </h1>
              <MiniScanFlow questions={aspaQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "ASPA (minimum vieillesse)",
                  montantMensuel: result.montantMensuel,
                  uniteMontant: "mois",
                  montantAnnuel: result.montantAnnuel,
                  eligible: result.eligible,
                  nonEligibleTitle:
                    result.cas === "non_eligible_age" ? "Conditions d'âge non remplies" : "Ressources au-dessus du plafond",
                  nonEligibleDesc:
                    result.cas === "non_eligible_age"
                      ? "L'ASPA est ouverte à 65 ans (ou 60 ans en cas d'inaptitude). Avant, vérifiez vos droits à l'ASI ou AAH."
                      : "Vos ressources actuelles dépassent le plafond de l'ASPA. Pas de versement possible.",
                  notes: result.notes,
                  simulateurUrl: ASPA_2026.simulateurUrl,
                  simulateurLabel: "Vérifier sur l'Assurance Retraite →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Bien préparer ta demande d'ASPA",
                  upsellBullets: [
                    "Quelles ressources sont prises en compte (et celles qui ne le sont pas)",
                    "Comprendre le recours sur succession (et l'éviter si possible)",
                    "Cumul avec autres aides (logement, complémentaire santé)",
                    "Démarches simplifiées via l'Assurance Retraite ou la MSA",
                  ],
                  dateBareme: ASPA_2026.dateBareme,
                  baremeDisclaimer:
                    "ASPA récupérable sur succession au-delà de 39 000€. Important à considérer avant demande.",
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
