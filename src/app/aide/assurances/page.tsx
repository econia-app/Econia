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
  assurancesQuestions,
  diagnostiquerAssurances,
  type AssurancesDiagnostic,
} from "@/lib/mini-scans/assurances";
import { ASSURANCES_2026 } from "@/lib/baremes-2026";

export default function AssurancesPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssurancesDiagnostic | null>(null);

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
    if (nextIdx >= assurancesQuestions.length) {
      setResult(diagnostiquerAssurances(next));
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
            <span style={{ color: T.navy }}>Assurances</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Tes assurances te coûtent<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  sûrement trop cher
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Comparaison jamais faite, doublons avec ta carte bancaire, assurances inutiles…
                5 questions pour repérer ce que tu paies en trop — et comment le récupérer.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  La plupart des foyers <strong>ne comparent jamais</strong> leurs assurances : entre
                  deux assureurs, l&apos;écart atteint <strong>40 à 60 %</strong> pour le même profil.
                  À côté, beaucoup paient des <strong>doublons</strong> : l&apos;« assurance des moyens de
                  paiement » (~28€/an, jugée <em>« d&apos;intérêt marginal »</em> par le régulateur), ou des
                  assurances voyage/casse déjà incluses dans leur carte bancaire. Grâce à la
                  <strong> loi Hamon</strong>, tu peux résilier la plupart de tes contrats à tout moment
                  après 1 an, sans frais.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Diagnostiquer mes assurances →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 45 secondes · sans engagement
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Assurances
              </h1>
              <MiniScanFlow questions={assurancesQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton diagnostic
              </h1>
              <MiniScanResult
                config={{
                  leverName: "économie sur tes assurances",
                  montantMensuel: result.economieMax,
                  uniteMontant: "an",
                  montantAnnuel: result.economieMax,
                  sousMontantText: result.eligible
                    ? `entre ${result.economieMin.toLocaleString()}€ et ${result.economieMax.toLocaleString()}€/an récupérables · ${result.nbPistes} piste${result.nbPistes > 1 ? "s" : ""} détectée${result.nbPistes > 1 ? "s" : ""} · estimation prudente`
                    : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle: "Tes assurances semblent déjà bien optimisées",
                  nonEligibleDesc:
                    "Selon tes réponses, tu as comparé récemment et peu de doublons. Pense à recomparer chaque année à l'échéance : les tarifs grimpent en moyenne tous les ans.",
                  notes: result.actions,
                  simulateurUrl: ASSURANCES_2026.simulateurUrl,
                  simulateurLabel: "Comparer mes assurances (gratuit) →",
                  guideKey: "assurance_compare",
                  upsellTitle: "Le guide pour tout optimiser sans te faire avoir",
                  upsellBullets: [
                    "La méthode pour comparer auto + habitation en 15 min (et les pièges des comparateurs)",
                    "La lettre type de résiliation loi Hamon (prête à envoyer)",
                    "La checklist des doublons à traquer sur ton relevé bancaire",
                    "Quelles garanties de ta carte bancaire remplacent une assurance payante",
                  ],
                  dateBareme: ASSURANCES_2026.dateBareme,
                  baremeDisclaimer:
                    "Fourchette prudente basée sur les baromètres assurance 2026. Demande 2-3 devis pour le chiffre exact selon tes contrats.",
                }}
                isPremium={isPremium}
                hasAccount={!!user}
                onUpgrade={() => (user ? alert("Stripe arrive bientôt. Pour activer Premium manuellement, contacte le support.") : setShowAuth(true))}
                onRetry={handleRetry}
                onOpenGuide={() => setOpenGuide("assurance_compare")}
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
