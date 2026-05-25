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

import { arsQuestions, estimerArs, type ArsEstimation } from "@/lib/mini-scans/ars";
import { ARS_2025 } from "@/lib/baremes-2026";

export default function ArsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ArsEstimation | null>(null);

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
    if (nextIdx >= arsQuestions.length) {
      setResult(estimerArs(next));
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
            <span style={{ color: T.navy }}>Allocation rentrée scolaire</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Allocation rentrée scolaire<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  combien pour toi ?
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Jusqu&apos;à 454€ par enfant scolarisé, versés mi-août. 4 questions pour savoir si ton foyer y a droit
                et combien tu vas toucher.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  L&apos;ARS aide les familles modestes à financer la rentrée scolaire. Montant variable selon l&apos;âge
                  de l&apos;enfant : <strong>416€</strong> (6-10 ans), <strong>439€</strong> (11-14 ans),
                  <strong> 454€</strong> (15-18 ans). Versement automatique entre le 20 août et début septembre
                  pour les allocataires CAF déjà connus.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Calculer mon montant →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 20 secondes · barème rentrée 2025-2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Allocation rentrée scolaire
              </h1>
              <MiniScanFlow questions={arsQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "Allocation rentrée scolaire",
                  montantMensuel: result.montantUnique,
                  uniteMontant: "unique",
                  montantAnnuel: result.montantUnique,
                  sousMontantText: result.eligible
                    ? "Versement automatique mi-août · pour la rentrée 2025-2026"
                    : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle:
                    result.cas === "non_eligible_enfants" ? "Pas d'enfant 6-18 ans" : "Vos revenus dépassent le plafond",
                  nonEligibleDesc:
                    result.cas === "non_eligible_enfants"
                      ? "L'ARS concerne uniquement les enfants scolarisés de 6 à 18 ans."
                      : "Si votre situation a changé en 2024-2025 (baisse de revenus), faites une réclamation auprès de la CAF.",
                  notes: result.notes,
                  simulateurUrl: ARS_2025.simulateurUrl,
                  simulateurLabel: "Vérifier sur le simulateur CAF →",
                  guideKey: "aides_sociales",
                  upsellTitle: "Sécurise et complète ton ARS",
                  upsellBullets: [
                    "Les autres aides cumulables (cantine, fournitures, transport)",
                    "Que faire si l'ARS n'est pas versée automatiquement",
                    "Faire une réclamation en cas de baisse de revenus récente",
                    "Optimiser tes déclarations annuelles",
                  ],
                  dateBareme: ARS_2025.dateBareme,
                  baremeDisclaimer:
                    "Plafond basé sur RFR 2023 pour la rentrée 2025. Revalorisation attendue août 2026.",
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
