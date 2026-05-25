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

import { cssQuestions, estimerCss, type CssEstimation } from "@/lib/mini-scans/css";
import { CSS_2026 } from "@/lib/baremes-2026";

export default function CssPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CssEstimation | null>(null);

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
    if (nextIdx >= cssQuestions.length) {
      setResult(estimerCss(next));
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
            <span style={{ color: T.navy }}>Complémentaire Santé Solidaire</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Mutuelle gratuite<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ou à moins d&apos;1€/jour
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                La Complémentaire Santé Solidaire (CSS) remplace ta mutuelle classique. Selon tes ressources, elle
                est gratuite ou avec une petite participation. 3 questions pour savoir si tu y as droit.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  La CSS prend en charge 100% de tes frais médicaux courants (consultations, médicaments, hôpital,
                  optique, dentaire). Si tu touches le RSA ou as des revenus inférieurs au plafond, c&apos;est
                  <strong> gratuit</strong>. Sinon, <strong>maximum 1€/jour/personne</strong>. Économie moyenne :
                  <strong> 600 à 1 200€/an par personne</strong> vs une mutuelle privée classique.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Vérifier mon éligibilité →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 20 secondes · barème avril 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Complémentaire Santé Solidaire
              </h1>
              <MiniScanFlow questions={cssQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "Complémentaire Santé Solidaire",
                  montantMensuel: result.economieAnnuelle,
                  uniteMontant: "an",
                  montantAnnuel: result.economieAnnuelle,
                  sousMontantText:
                    result.type === "gratuite"
                      ? "économie estimée · CSS 100% gratuite"
                      : result.type === "participation"
                      ? `économie nette · participation ~${result.participationMensuelle}€/mois`
                      : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle: "Vos revenus dépassent le plafond CSS",
                  nonEligibleDesc:
                    "Si votre situation a changé récemment (baisse de revenus, perte d'emploi), faites quand même la demande.",
                  notes: result.notes,
                  simulateurUrl: CSS_2026.simulateurUrl,
                  simulateurLabel: "Faire la simulation officielle →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Bascule sans perdre ta mutuelle actuelle",
                  upsellBullets: [
                    "Comment résilier ta mutuelle privée sans frais",
                    "Quels organismes choisir pour gérer ta CSS",
                    "Les soins remboursés à 100% (et ceux qui ne le sont pas)",
                    "Cumul possible avec ALD, AME et autres aides",
                  ],
                  dateBareme: CSS_2026.dateBareme,
                  baremeDisclaimer: "Économie estimée par rapport à une mutuelle privée moyenne de 50€/mois/personne.",
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
