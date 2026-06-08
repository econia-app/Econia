"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase, type Profile } from "@/lib/supabase";
import { analyzeProfile, type ScanResult } from "@/lib/analyze";
import { questions } from "@/lib/questions";
import { MAX_WAITLIST } from "@/lib/theme";

import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import GuideModal from "@/components/GuideModal";

import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import HowItWorks from "@/components/landing/HowItWorks";
import Levers from "@/components/landing/Levers";
import Pricing from "@/components/landing/Pricing";
import FaqSection from "@/components/landing/FaqSection";
import FinalCta from "@/components/landing/FinalCta";
import LandingFooter from "@/components/landing/LandingFooter";
import ResumeScanBanner from "@/components/landing/ResumeScanBanner";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schemas";

import ScanFlow from "@/components/scan/ScanFlow";
import ResultsView from "@/components/scan/ResultsView";

type Step = "hero" | "scan" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("hero");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [data, setData] = useState<ScanResult | null>(null);
  const [visNum, setVisNum] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (p) setProfile(p as Profile);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        fetchProfile(session.user.id);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  useEffect(() => {
    // Total réel des pré-inscriptions, identique pour tous les visiteurs.
    // Passe par la fonction Supabase get_waitlist_count() (SECURITY DEFINER)
    // pour contourner la règle RLS qui, sinon, ne compterait que la ligne
    // visible par la session courante (cf. bug "compteur différent par appareil").
    supabase
      .rpc("get_waitlist_count")
      .then(({ data }) => setWaitlistCount(data ?? 0));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("start") === "scan") {
      setStep("scan");
      setVisNum(1);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const isPremium = profile?.is_premium || profile?.is_founder || false;
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  const previousScanResult = profile?.scan_data ? analyzeProfile(profile.scan_data) : null;
  const previousGainAvg = previousScanResult
    ? Math.round(((previousScanResult.gainMin + previousScanResult.gainMax) / 2) / 100) * 100
    : 0;

  const handleAnswer = async (id: string, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    let ni = qIdx + 1;
    while (ni < questions.length) {
      const nq = questions[ni];
      if (nq.showIf && !nq.showIf(next)) {
        next[nq.id] = "na";
        ni++;
      } else {
        break;
      }
    }
    if (ni >= questions.length) {
      const result = analyzeProfile(next);
      setData(result);
      setStep("results");
      if (user) {
        try {
          const { error } = await supabase
            .from("profiles")
            .upsert(
              { id: user.id, email: user.email, scan_data: next },
              { onConflict: "id" }
            );
          if (error) {
            console.error("[Econia] Erreur enregistrement scan_data:", error.message, error);
            alert(
              "Ton scan a été calculé, mais on n'a pas pu l'enregistrer en base. " +
                "Reconnecte-toi et réessaie, ou contacte le support."
            );
          } else {
            fetchProfile(user.id);
          }
        } catch (e) {
          console.error("[Econia] Exception enregistrement scan_data:", e);
        }
      }
    } else {
      setQIdx(ni);
      setVisNum((p) => p + 1);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const reset = () => {
    setStep("hero");
    setQIdx(0);
    setAnswers({});
    setData(null);
    setVisNum(0);
    setOpenGuide(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startScan = () => {
    setStep("scan");
    setVisNum(1);
  };

  return (
    <>
      <Navbar
        user={user}
        profile={profile}
        onReset={reset}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
      />

      {step === "hero" && user && profile?.scan_data && (
        <ResumeScanBanner gainEstime={previousGainAvg} />
      )}

      {step === "hero" && (
        <>
          <JsonLd data={faqPageSchema} />
          <Hero spotsLeft={spotsLeft} onStartScan={startScan} />
          <TrustBar />
          <HowItWorks />
          <Levers />
          <Pricing onStartScan={startScan} onSignup={() => setShowAuth(true)} />
          <FaqSection />
          <FinalCta onStartScan={startScan} />
          <LandingFooter />
        </>
      )}

      {step === "scan" && <ScanFlow qIdx={qIdx} visNum={visNum} answers={answers} onAnswer={handleAnswer} />}

      {step === "results" && data && (
        <ResultsView
          data={data}
          user={user}
          isPremium={isPremium}
          spotsLeft={spotsLeft}
          onShowAuth={() => setShowAuth(true)}
          onOpenGuide={(key) => setOpenGuide(key)}
          onReset={reset}
        />
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      )}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}
