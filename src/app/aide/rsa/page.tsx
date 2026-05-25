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

import { rsaQuestions, estimerRsa, type RsaEstimation } from "@/lib/mini-scans/rsa";
import { RSA_2026 } from "@/lib/baremes-2026";

export default function RsaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RsaEstimation | null>(null);

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
    if (nextIdx >= rsaQuestions.length) {
      setResult(estimerRsa(next));
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
            <span style={{ color: T.navy }}>RSA</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Calcule ton RSA<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  en 30 secondes
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Le RSA garantit un revenu minimum aux personnes sans ressources ou avec des revenus très faibles.
                5 questions pour estimer ton montant mensuel et lancer la démarche CAF.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  Le Revenu de Solidarité Active (RSA) est versé par la CAF aux personnes de 25 ans et plus (ou
                  parents/jeunes actifs sous conditions) ayant peu ou pas de ressources. Le montant pour une personne
                  seule sans enfant peut atteindre <strong>651,69€/mois</strong> en 2026, et augmente selon la
                  composition du foyer.
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
                Anonyme · 30 secondes · barème CAF avril 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan RSA
              </h1>
              <MiniScanFlow questions={rsaQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "RSA",
                  montantMensuel: result.montantMensuel,
                  montantAnnuel: result.montantAnnuel,
                  eligible: result.eligible,
                  nonEligibleTitle:
                    result.cas === "non_eligible_age" ? "Conditions d'âge non remplies" : "Vos ressources dépassent le seuil",
                  nonEligibleDesc:
                    result.cas === "non_eligible_age"
                      ? "Le RSA est ouvert à partir de 25 ans (sauf jeunes actifs/parents). Vérifiez les alternatives sur mes-aides.gouv.fr."
                      : "Selon vos réponses, vos ressources dépassent le forfait du RSA. Vérifiez si vous avez droit à la Prime d'activité.",
                  notes: result.notes,
                  simulateurUrl: RSA_2026.simulateurUrl,
                  simulateurLabel: "Faire la simulation officielle CAF →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Maximise et sécurise ton RSA",
                  upsellBullets: [
                    "Les pièces à préparer pour ne pas se faire refuser",
                    "Comment déclarer correctement chaque trimestre",
                    "Que faire si tu cumules avec un petit boulot",
                    "Comment réagir en cas de suspension ou contrôle",
                  ],
                  dateBareme: RSA_2026.dateBareme,
                  baremeDisclaimer: "Le calcul officiel intègre les ressources des 3 derniers mois.",
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
