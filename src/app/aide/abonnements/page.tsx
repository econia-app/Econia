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
  abonnementsQuestions,
  diagnostiquerAbonnements,
  type AbonnementsDiagnostic,
} from "@/lib/mini-scans/abonnements";
import { ABONNEMENTS_2026 } from "@/lib/baremes-2026";

export default function AbonnementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "scan" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AbonnementsDiagnostic | null>(null);

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
    if (nextIdx >= abonnementsQuestions.length) {
      setResult(diagnostiquerAbonnements(next));
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
            <span style={{ color: T.navy }}>Abonnements</span>
          </nav>

          {step === "intro" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, letterSpacing: "-1.8px", lineHeight: 1.1, marginBottom: "12px" }}>
                Tes abonnements fantômes<br />
                <span style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  te coûtent en silence
                </span>
              </h1>
              <p style={{ fontSize: "16px", color: T.textSoft, lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px" }}>
                Streaming oublié, appli jamais ouverte, essai gratuit devenu payant…
                5 questions pour estimer ce que tu paies pour rien — et comment l&apos;arrêter en 3 clics.
              </p>

              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: fonts.title, fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>
                  En clair, c&apos;est quoi ?
                </h2>
                <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, margin: 0 }}>
                  <strong>1 Français sur 3</strong> paie au moins un abonnement qu&apos;il n&apos;utilise plus,
                  et environ <strong>15 % des abonnements</strong> payés ne servent jamais. Le piège : ce sont
                  de petits montants prélevés <strong>automatiquement</strong>, qui passent inaperçus mois
                  après mois. Bonne nouvelle : depuis 2023, tout ce que tu as souscrit en ligne se résilie
                  <strong> « en 3 clics »</strong>, c&apos;est la loi.
                </p>
              </div>

              <button onClick={() => setStep("scan")} style={{ width: "100%", maxWidth: "420px", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", marginBottom: "12px" }}>
                Traquer mes abonnements →
              </button>
              <p style={{ fontSize: "12px", color: T.textMuted, lineHeight: 1.5 }}>
                Anonyme · 45 secondes · sans engagement
              </p>
            </>
          )}

          {step === "scan" && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px" }}>
                Mini-scan Abonnements
              </h1>
              <MiniScanFlow questions={abonnementsQuestions} qIdx={qIdx} onAnswer={handleAnswer} />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, marginBottom: "24px", letterSpacing: "-1px", textAlign: "center" }}>
                Ton diagnostic
              </h1>
              <MiniScanResult
                config={{
                  leverName: "économie sur tes abonnements",
                  montantMensuel: result.economieMax,
                  uniteMontant: "an",
                  montantAnnuel: result.economieMax,
                  sousMontantText: result.eligible
                    ? `entre ${result.economieMin.toLocaleString()}€ et ${result.economieMax.toLocaleString()}€/an récupérables · ${result.nbPistes} piste${result.nbPistes > 1 ? "s" : ""} détectée${result.nbPistes > 1 ? "s" : ""} · estimation prudente`
                    : "estimation indicative",
                  eligible: result.eligible,
                  nonEligibleTitle: "Tes abonnements semblent bien maîtrisés",
                  nonEligibleDesc:
                    "Selon tes réponses, tu suis tes prélèvements et n'as pas de fantômes évidents. Refais ce check tous les 6 mois : les abonnements s'accumulent vite.",
                  notes: result.actions,
                  simulateurUrl: ABONNEMENTS_2026.simulateurUrl,
                  simulateurLabel: "Voir la résiliation « en 3 clics » (officiel) →",
                  guideKey: "abonnements",
                  upsellTitle: "Le guide pour faire le ménage (et que ça reste propre)",
                  upsellBullets: [
                    "La méthode pour débusquer TOUS tes prélèvements cachés en 15 min",
                    "Les phrases exactes pour résilier sans te faire retenir",
                    "Comment bloquer les essais gratuits qui basculent en payant",
                    "L'astuce pour ne plus jamais re-cumuler d'abonnements fantômes",
                  ],
                  dateBareme: ABONNEMENTS_2026.dateBareme,
                  baremeDisclaimer:
                    "Estimation prudente et plafonnée. Le montant réel dépend de tes abonnements : la seule façon de le connaître est de lister tes prélèvements.",
                }}
                isPremium={isPremium}
                hasAccount={!!user}
                onUpgrade={() => (user ? alert("Stripe arrive bientôt. Pour activer Premium manuellement, contacte le support.") : setShowAuth(true))}
                onRetry={handleRetry}
                onOpenGuide={() => setOpenGuide("abonnements")}
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
