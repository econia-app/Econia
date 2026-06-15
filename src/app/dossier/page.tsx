"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import { T, fonts } from "@/lib/theme";
import type { Dossier } from "@/lib/dossier";

import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import DossierManager from "@/components/dossier/DossierManager";

export default function DossierPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dossier, setDossier] = useState<Dossier>({});
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const isPremium = profile?.is_premium || profile?.is_founder || false;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        router.replace("/");
        return;
      }
      setUser({ id: session.user.id, email: session.user.email || "" });
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (p) {
        setProfile(p as Profile);
        setDossier(((p as Profile).dossier as Dossier) || {});
      }
      setLoading(false);
    });
  }, [router]);

  const handleSave = useCallback(
    async (next: Dossier) => {
      setDossier(next);
      if (!user) return;
      await supabase.from("profiles").update({ dossier: next }).eq("id", user.id);
      setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    },
    [user]
  );

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, color: T.textMuted }}>
        Chargement…
      </div>
    );
  }

  return (
    <>
      <Navbar
        user={user}
        profile={profile}
        onReset={() => router.push("/")}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
        onShowAuth={() => setShowAuth(true)}
      />

      <main style={{ minHeight: "100vh", padding: "120px 20px 60px", background: T.bg }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <nav style={{ fontSize: "12px", color: T.textMuted, marginBottom: "16px" }}>
            <a href="/mon-compte" style={{ color: T.textMuted, textDecoration: "none" }}>Mon espace</a> ›{" "}
            <span style={{ color: T.navy }}>Mon dossier</span>
          </nav>

          <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 600, letterSpacing: "-1.5px", marginBottom: "8px" }}>
            Mon dossier
          </h1>
          <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.6, marginBottom: "28px", maxWidth: "560px" }}>
            Renseigne ici tes contrats et infos. Tout est sauvegardé dans ton compte et te servira de base pour les parcours d&apos;action (et pour ne plus rien oublier).
          </p>

          {!isPremium ? (
            <div style={{ background: T.bgCard, border: `2px solid ${T.blue}`, borderRadius: "16px", padding: "28px", textAlign: "center", boxShadow: "0 8px 24px rgba(37,99,235,0.08)" }}>
              <div style={{ fontSize: "34px", marginBottom: "10px" }}>🔒</div>
              <h2 style={{ fontFamily: fonts.title, fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                Le dossier est réservé aux abonnés
              </h2>
              <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.6, marginBottom: "20px" }}>
                Centralise tes contrats, suis tes économies et avance pas à pas avec les parcours guidés.
              </p>
              <button
                onClick={() => router.push("/mon-compte")}
                style={{ padding: "13px 28px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: 44 }}
              >
                Devenir abonné
              </button>
            </div>
          ) : (
            <>
              <DossierManager initial={dossier} onSave={handleSave} />
              <p style={{ fontSize: "12px", color: T.textMuted, textAlign: "center", marginTop: "8px" }}>
                {savedAt ? `✓ Enregistré à ${savedAt}` : "Tes modifications sont enregistrées automatiquement."}
              </p>
            </>
          )}
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
    </>
  );
}
