"use client";
/**
 * Page publique Prime d'activité — mini-scan + résultat + démarche officielle.
 *
 * - Accessible sans compte (SEO + partage social)
 * - Si utilisateur connecté Premium → ouvre le guide complet en modal
 * - Si visiteur ou user non-Premium → upsell Premium pour le guide d'action
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import { T, fonts } from "@/lib/theme";

import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import GuideModal from "@/components/GuideModal";
import MiniScanFlow from "@/components/mini-scan/MiniScanFlow";
import PrimeActiviteResult from "@/components/mini-scan/PrimeActiviteResult";

import {
  primeActiviteQuestions,
  estimerPrimeActivite,
  type PrimeActiviteEstimation,
} from "@/lib/mini-scans/prime-activite";

export default function PrimeActivitePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PrimeActiviteEstimation | null>(null);

  const isPremium = profile?.is_premium || profile?.is_founder || false;

  // === Auth ===
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (p) setProfile(p as Profile);
      }
    });
  }, []);

  // === Handlers ===
  const handleAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    const nextIdx = qIdx + 1;
    if (nextIdx >= primeActiviteQuestions.length) {
      const est = estimerPrimeActivite(next);
      setResult(est);
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
          {/* Breadcrumb */}
          <nav style={{ fontSize: "12px", color: T.textMuted, marginBottom: "16px" }}>
            <a href="/" style={{ color: T.textMuted, textDecoration: "none" }}>
              Accueil
            </a>{" "}
            ›{" "}
            <a href="/aide" style={{ color: T.textMuted, textDecoration: "none" }}>
              Aides
            </a>{" "}
            › <span style={{ color: T.navy }}>Prime d&apos;activité</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Calcule ta Prime d&apos;activité<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  en 30 secondes
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                1 actif sur 3 ne touche pas la Prime d&apos;activité à laquelle il a droit. 5 questions
                ciblées pour savoir si tu en fais partie — et combien tu pourrais récupérer chaque mois.
              </p>

              {/* Encart contexte */}
              <div
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: "16px",
                  padding: "20px 24px",
                  marginBottom: "28px",
                }}
              >
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  La Prime d&apos;activité est un complément de revenu versé par la CAF aux travailleurs aux
                  revenus modestes. Elle peut atteindre <strong>350€/mois</strong> selon ta situation
                  familiale et tes ressources. Versement chaque mois, démarche en ligne sur caf.fr,
                  réponse sous 2 semaines.
                </p>
              </div>

              {/* CTA */}
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
                Anonyme · 30 secondes · estimation indicative basée sur le barème CAF avril 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Prime d&apos;activité
              </h1>
              <MiniScanFlow questions={primeActiviteQuestions} qIdx={qIdx} onAnswer={handleAnswer} accentColor={T.blue} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <PrimeActiviteResult
                estimation={result}
                isPremium={isPremium}
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
