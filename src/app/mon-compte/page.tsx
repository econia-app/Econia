"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile, type ActionStatus, type ActionState } from "@/lib/supabase";
import { analyzeProfile, type ScanResult, type Gain } from "@/lib/analyze";
import { T, catLabels, catColors } from "@/lib/theme";

import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import GuideModal from "@/components/GuideModal";

import WelcomeBlock from "@/components/dashboard/WelcomeBlock";
import GainSummary from "@/components/dashboard/GainSummary";
import LeverCard from "@/components/dashboard/LeverCard";
import DeclareAmountModal from "@/components/dashboard/DeclareAmountModal";
import AccountSection from "@/components/dashboard/AccountSection";
import EmptyState from "@/components/dashboard/EmptyState";
import ShareEconomies from "@/components/dashboard/ShareEconomies";

export default function MonComptePage() {
  const router = useRouter();

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [actionsState, setActionsState] = useState<Record<string, ActionState>>({});
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [declareFor, setDeclareFor] = useState<Gain | null>(null);

  const isPremium = profile?.is_premium || profile?.is_founder || false;

  const loadProfile = useCallback(async (userId: string) => {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!p) return;
    const prof = p as Profile;
    setProfile(prof);
    setActionsState((prof.actions_state as Record<string, ActionState>) || {});
    if (prof.scan_data) {
      setScanResult(analyzeProfile(prof.scan_data));
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        router.replace("/");
        return;
      }
      setUser({ id: session.user.id, email: session.user.email || "" });
      await loadProfile(session.user.id);
      setLoading(false);
    });
  }, [router, loadProfile]);

  const gainRecupere = Object.values(actionsState).reduce((acc, st) => {
    return acc + (st.status === "done" && st.montant ? st.montant : 0);
  }, 0);

  const saveActions = useCallback(
    async (next: Record<string, ActionState>) => {
      setActionsState(next);
      const total = Object.values(next).reduce(
        (acc, st) => acc + (st.status === "done" && st.montant ? st.montant : 0),
        0
      );
      if (user) {
        await supabase
          .from("profiles")
          .update({ actions_state: next, gains_total: total })
          .eq("id", user.id);
      }
    },
    [user]
  );

  const handleStatusChange = (gainTitle: string, status: ActionStatus) => {
    const prev = actionsState[gainTitle] || { status: "todo" };
    const next: Record<string, ActionState> = {
      ...actionsState,
      [gainTitle]: {
        ...prev,
        status,
        date: status === "done" ? new Date().toISOString() : prev.date,
      },
    };
    saveActions(next);
  };

  const handleDeclareAmount = (gainTitle: string, montant: number) => {
    const next: Record<string, ActionState> = {
      ...actionsState,
      [gainTitle]: {
        status: "done",
        montant,
        date: new Date().toISOString(),
      },
    };
    saveActions(next);
    setDeclareFor(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async () => {
    if (!user) return;
    const ok = window.confirm(
      "Supprimer ton compte est définitif. Toutes tes données seront effacées. Confirmer ?"
    );
    if (!ok) return;
    try {
      await fetch("/api/delete-account", { method: "POST" });
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression. Réessaie ou contacte le support.");
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, color: T.textMuted }}>
        Chargement…
      </div>
    );
  }

  const grouped: Record<string, Gain[]> = {};
  if (scanResult) {
    scanResult.gains.forEach((g) => {
      if (!grouped[g.cat]) grouped[g.cat] = [];
      grouped[g.cat].push(g);
    });
  }

  return (
    <>
      <Navbar
        user={user}
        profile={profile}
        onReset={() => router.push("/")}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
      />

      <main style={{ minHeight: "100vh", padding: "120px 20px 60px", background: T.bg }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <WelcomeBlock email={user.email} isFounder={!!profile?.is_founder} isPremium={isPremium} />

          {!scanResult ? (
            <EmptyState />
          ) : (
            <>
              <GainSummary
                gainPotentielMin={scanResult.gainMin}
                gainPotentielMax={scanResult.gainMax}
                gainRecupere={gainRecupere}
                nbPistes={scanResult.gains.length}
              />

              <ShareEconomies
                gainPotentiel={Math.round(((scanResult.gainMin + scanResult.gainMax) / 2) / 100) * 100}
                gainRecupere={gainRecupere}
                nbPistes={scanResult.gains.length}
              />

              {!isPremium && (
                <div
                  style={{
                    background: T.bgCard,
                    border: `2px solid ${T.blue}`,
                    borderRadius: "16px",
                    padding: "18px 22px",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.08)",
                  }}
                >
                  <div style={{ flex: "1 1 220px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: T.navy, marginBottom: "2px" }}>
                      🔓 Débloque les guides d&apos;action pas à pas
                    </div>
                    <div style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.4 }}>
                      Tu passes à l&apos;action plus vite avec les scripts de négociation et les démarches détaillées.
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Stripe arrive bientôt — contacte Julien pour activer Premium manuellement.")}
                    style={{
                      padding: "12px 22px",
                      background: T.blue,
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      minHeight: 44,
                    }}
                  >
                    Passer Premium
                  </button>
                </div>
              )}

              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "4px", height: "20px", borderRadius: "2px", background: catColors[cat] || T.blue }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                      {catLabels[cat] || cat} <span style={{ color: T.textMuted, fontWeight: 500 }}>· {items.length}</span>
                    </h3>
                  </div>
                  {items.map((g) => (
                    <LeverCard
                      key={g.title}
                      gain={g}
                      state={actionsState[g.title]}
                      isPremium={isPremium}
                      user={user}
                      onStatusChange={(status) => handleStatusChange(g.title, status)}
                      onDeclareAmount={() => setDeclareFor(g)}
                      onOpenGuide={(key) => setOpenGuide(key)}
                      onShowAuth={() => setShowAuth(true)}
                    />
                  ))}
                </div>
              ))}

              {scanResult.infos.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase", marginBottom: "12px" }}>
                    💡 Bon à savoir
                  </h3>
                  {scanResult.infos.map((info, i) => (
                    <div key={i} style={{ background: T.blueLight, border: `1px solid ${T.blue}22`, borderRadius: "14px", padding: "16px", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "18px" }}>{info.icon}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: T.blue }}>{info.title}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <AccountSection
            email={user.email}
            onRescan={() => router.push("/?start=scan")}
            onLogout={handleLogout}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
      {declareFor && (
        <DeclareAmountModal
          gainTitle={declareFor.title}
          currentAmount={actionsState[declareFor.title]?.montant}
          onClose={() => setDeclareFor(null)}
          onSave={(montant) => handleDeclareAmount(declareFor.title, montant)}
        />
      )}
    </>
  );
}
