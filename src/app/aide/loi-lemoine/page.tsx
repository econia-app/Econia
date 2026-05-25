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

import { lemoineQuestions, estimerLemoine, type LemoineEstimation } from "@/lib/mini-scans/lemoine";
import { LEMOINE_2026 } from "@/lib/baremes-2026";

export default function LemoinePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LemoineEstimation | null>(null);

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
    if (nextIdx >= lemoineQuestions.length) {
      setResult(estimerLemoine(next));
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
            <span style={{ color: T.navy }}>Loi Lemoine</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Loi Lemoine 2026<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  jusqu&apos;à 15 000€ d&apos;économie
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Si tu as un crédit immobilier, tu paies probablement trop cher en assurance emprunteur.
                3 questions pour estimer ce que tu peux récupérer en changeant d&apos;assureur.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  La <strong>loi Lemoine</strong> (28 février 2022) te permet de <strong>changer d&apos;assurance
                  emprunteur à tout moment</strong>, sans frais ni pénalité. Pas besoin d&apos;attendre la date
                  anniversaire. Ta banque ne peut pas refuser si les garanties sont équivalentes.
                  En délégation, un contrat coûte en moyenne <strong>2 à 4 fois moins cher</strong> qu&apos;un
                  contrat groupe bancaire. Sur 15-20 ans, l&apos;économie typique tourne entre
                  <strong> 3 000€ et 15 000€</strong>.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Estimer mon économie →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 30 secondes · barème 2026
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Loi Lemoine
              </h1>
              <MiniScanFlow questions={lemoineQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton résultat
              </h1>
              <MiniScanResult
                config={{
                  leverName: "économie loi Lemoine",
                  montantMensuel: result.gainTotal,
                  uniteMontant: "unique",
                  montantAnnuel: result.gainAnnuel,
                  sousMontantText: result.eligible
                    ? `≈ ${result.gainAnnuel.toLocaleString()}€/an pendant ${result.dureeRetenue} ans · estimation indicative`
                    : `Ton taux actuel (~${result.tauxActuel.toFixed(2)} %) est déjà au niveau du marché`,
                  eligible: result.eligible,
                  nonEligibleTitle: "Pas d'économie significative à attendre",
                  nonEligibleDesc:
                    "Selon tes réponses, ton assurance actuelle est déjà compétitive. Reviens dans 1-2 ans, les tarifs évoluent.",
                  notes: result.notes,
                  simulateurUrl: LEMOINE_2026.simulateurUrl,
                  simulateurLabel: "Comparer les contrats délégués →",
                  guideKey: "assurance_emprunteur",
                  upsellTitle: "Le guide pour changer en 30 jours",
                  upsellBullets: [
                    "Les 4 étapes pour passer à un contrat délégué (lettre type + checklist)",
                    "La grille des 18 critères d'équivalence (refus banque impossible)",
                    "Comparatif des assureurs alternatifs les plus compétitifs en 2026",
                    "Le piège à éviter sur la résiliation du contrat groupe",
                  ],
                  dateBareme: LEMOINE_2026.dateBareme,
                  baremeDisclaimer: `Calcul : (taux actuel − ${LEMOINE_2026.tauxDelegationCible.toFixed(2)} %) × capital restant × durée restante. Marge ±20 %, demande 2-3 devis pour le chiffre exact.`,
                }}
                isPremium={isPremium}
                hasAccount={!!user}
                onUpgrade={() => (user ? alert("Stripe arrive bientôt. Pour activer Premium manuellement, contacte le support.") : setShowAuth(true))}
                onRetry={handleRetry}
                onOpenGuide={() => setOpenGuide("assurance_emprunteur")}
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
