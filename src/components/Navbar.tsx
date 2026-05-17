"use client";
import { useState, useEffect } from "react";
import { T, fonts } from "@/lib/theme";
import type { Profile } from "@/lib/supabase";

type Props = {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  onReset: () => void;
  onLogout: () => void;
  onShowAuth: () => void;
};

export default function Navbar({ user, profile, onReset, onLogout, onShowAuth }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fermer le menu quand on passe en desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const Logo = (
    <button
      onClick={() => {
        setMenuOpen(false);
        onReset();
      }}
      aria-label="Retour accueil Econia"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        fontFamily: fonts.title,
        fontSize: "24px",
        fontWeight: 700,
        letterSpacing: "-0.8px",
        color: T.navy,
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      ec
      <span
        style={{
          background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        o
      </span>
      nia
    </button>
  );

  // ─── Mobile : connecté → burger ; non connecté → bouton Connexion compact
  if (isMobile) {
    return (
      <>
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "12px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: `1px solid rgba(226,232,240,0.6)`,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
            }}
          >
            {Logo}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: menuOpen ? T.navy : "transparent",
                border: `1px solid ${menuOpen ? T.navy : T.border}`,
                color: menuOpen ? "#fff" : T.navy,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
            >
              {/* Icône burger / croix */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Drawer mobile : ancres de navigation + compte (si connecté) */}
        {menuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15,23,42,0.5)",
              zIndex: 99,
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 76,
                left: 16,
                right: 16,
                background: T.bgCard,
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
                border: `1px solid ${T.border}`,
              }}
            >
              {/* Ancres navigation (toujours visibles) */}
              <div style={{ fontSize: "11px", color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                Navigation
              </div>
              {[
                { label: "Fonctionnement", id: "how" },
                { label: "Économies", id: "detect" },
                { label: "Tarifs", id: "prix" },
                { label: "FAQ", id: "faq" },
              ].map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  style={{
                    display: "block",
                    padding: "12px 0",
                    fontSize: "15px",
                    color: T.navy,
                    fontWeight: 500,
                    textDecoration: "none",
                    borderBottom: `1px solid ${T.borderLight}`,
                  }}
                >
                  {it.label}
                </a>
              ))}

              {/* Section compte (seulement si connecté) */}
              {user && (
                <>
                  <a
                    href="/mon-compte"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 14px",
                      marginTop: "16px",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: T.blue,
                      background: T.blueLight,
                      border: `1px solid ${T.blue}22`,
                      borderRadius: "12px",
                      textDecoration: "none",
                      textAlign: "center" as const,
                    }}
                  >
                    📊 Mon espace
                  </a>
                  <div style={{ fontSize: "11px", color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginTop: "20px", marginBottom: "6px" }}>
                    Compte
                  </div>
                  <div style={{ fontSize: "14px", color: T.navy, fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                  {profile?.is_founder && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        background: T.amberLight,
                        color: T.amber,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontWeight: 700,
                        marginBottom: "16px",
                      }}
                    >
                      FONDATEUR
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: profile?.is_founder ? 0 : 16,
                      background: "transparent",
                      color: T.textSoft,
                      border: `1px solid ${T.border}`,
                      borderRadius: "12px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: 500,
                      minHeight: 44,
                    }}
                  >
                    Déconnexion
                  </button>
                </>
              )}

              {/* CTA inscription si pas connecté */}
              {!user && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onShowAuth();
                  }}
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    padding: "14px",
                    background: T.blue,
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    minHeight: 44,
                  }}
                >
                  Créer mon compte
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── Desktop : barre complète comme avant
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 24px" }}>
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px 10px 20px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid rgba(226,232,240,0.6)`,
          borderRadius: "18px",
          boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
        }}
      >
        {Logo}

        {/* Ancres de navigation desktop — corrige bug audit B7 */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { label: "Fonctionnement", id: "how" },
            { label: "Économies", id: "detect" },
            { label: "Tarifs", id: "prix" },
            { label: "FAQ", id: "faq" },
          ].map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                color: T.textSoft,
                fontWeight: 500,
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              {it.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user ? (
            <>
              <a
                href="/mon-compte"
                style={{
                  padding: "8px 14px",
                  fontSize: "13px",
                  color: T.navy,
                  fontWeight: 600,
                  borderRadius: "10px",
                  textDecoration: "none",
                  background: T.blueLight,
                  border: `1px solid ${T.blue}22`,
                }}
              >
                Mon espace
              </a>
              <span
                style={{
                  fontSize: "12px",
                  color: T.textMuted,
                  maxWidth: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </span>
              {profile?.is_founder && (
                <span
                  style={{
                    fontSize: "10px",
                    background: T.amberLight,
                    color: T.amber,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontWeight: 700,
                  }}
                >
                  FONDATEUR
                </span>
              )}
              <button
                onClick={onLogout}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  color: T.textSoft,
                  border: `1px solid ${T.border}`,
                  borderRadius: "10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              style={{
                padding: "10px 22px",
                background: T.navy,
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Connexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
