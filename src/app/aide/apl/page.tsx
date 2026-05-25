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

import { aplQuestions, estimerApl, type AplEstimation } from "@/lib/mini-scans/apl";
import { APL_2026 } from "@/lib/baremes-2026";

export default function AplPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AplEstimation | null>(null);

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
    if (nextIdx >= aplQuestions.length) {
      setResult(estimerApl(next));
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
            <span style={{ color: T.navy }}>APL</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Calcule ton APL<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  en 30 secondes
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Locataire ? L&apos;Aide Personnalisée au Logement réduit ton loyer chaque mois. 5 questions pour
                estimer ton montant et lancer la démarche CAF.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  L&apos;APL est versée par la CAF aux locataires pour réduire le loyer. Le montant dépend de la zone
                  géographique (Paris &gt; grandes villes &gt; campagne), du loyer, de la composition du foyer et des
                  ressources. Versement automatique au bailleur (parc social) ou direct (parc privé).
                </p>
              </div>

              <button
                onClick={() => setStep("scan")}
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  padding: "16px",
                  background: T.blue,
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.15)",
                  marginBottom: "12px",
                }}
              >
                Calculer mon montant →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 30 secondes · barème CAF janvier 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan APL
              </h1>
              <MiniScanFlow questions={aplQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "APL",
                  montantMensuel: result.montantMensuel,
                  montantAnnuel: result.montantAnnuel,
                  eligible: result.eligible,
                  nonEligibleTitle:
                    result.cas === "non_eligible_statut" ? "Vous n'êtes pas locataire" : "Vos ressources dépassent le seuil",
                  nonEligibleDesc:
                    result.cas === "non_eligible_statut"
                      ? "L'APL concerne les locataires. Si vous êtes propriétaire, regardez l'APL accession ou les aides à la rénovation."
                      : "Selon vos ressources et votre zone, vous n'avez probablement pas droit à l'APL. Vérifiez sur caf.fr.",
                  notes: result.notes,
                  simulateurUrl: APL_2026.simulateurUrl,
                  simulateurLabel: "Faire la simulation officielle CAF →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Maximise ton APL",
                  upsellBullets: [
                    "Comment optimiser ta déclaration de loyer",
                    "Le timing parfait pour faire ta demande",
                    "Cas spécifiques : alternance, intermittents, indépendants",
                    "Recours en cas de réduction ou suspension",
                  ],
                  dateBareme: APL_2026.dateBareme,
                  baremeDisclaimer:
                    "Calcul officiel basé sur revenus 12 derniers mois + patrimoine > 30k€ + loyer plafonné par zone.",
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
