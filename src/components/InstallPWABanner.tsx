"use client";
import { useEffect, useState } from "react";
import { T } from "@/lib/theme";

/**
 * InstallPWABanner — bannière d'installation PWA intelligente
 *
 * Comportement :
 *  - Affichée seulement après 30s sur le site (pas dès l'arrivée, intrusif)
 *  - Détecte automatiquement si l'app peut être installée (event beforeinstallprompt)
 *  - Sur iOS Safari (qui ne fournit pas l'event), affiche un mode "instructions"
 *  - Dismissable, mémorisée 14 jours via localStorage
 *  - Cachée si l'app est déjà installée (display-mode: standalone)
 */

const DISMISS_KEY = "econia_pwa_dismissed_at";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 30_000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPWABanner() {
  const [visible, setVisible] = useState(false);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Si déjà installée → on n'affiche jamais
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari standalone
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Si dismissée récemment → on respecte
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed) {
        const ts = parseInt(dismissed, 10);
        if (!Number.isNaN(ts) && Date.now() - ts < DISMISS_DAYS * 86400_000) return;
      }
    } catch {
      // localStorage indispo (mode privé) → on continue, pas bloquant
    }

    // Détection iOS Safari (pas de beforeinstallprompt sur iOS)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
    const iosSafari = isIOS && isSafari;

    let cancelled = false;

    const handler = (e: Event) => {
      e.preventDefault();
      if (cancelled) return;
      setInstallEvt(e as BeforeInstallPromptEvent);
      setTimeout(() => !cancelled && setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // iOS : pas d'event natif → on force l'affichage après le délai
    if (iosSafari) {
      setIosMode(true);
      const t = setTimeout(() => !cancelled && setVisible(true), SHOW_DELAY_MS);
      return () => {
        cancelled = true;
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // pas grave si indispo
    }
    setVisible(false);
  };

  const install = async () => {
    if (!installEvt) return;
    try {
      await installEvt.prompt();
      const choice = await installEvt.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      } else {
        dismiss();
      }
    } catch {
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer Econia sur ton appareil"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 460,
        margin: "0 auto",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 12px 40px rgba(15,23,42,0.16)",
        zIndex: 95,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 13,
      }}
    >
      <div style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>
        📲
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: T.navy, marginBottom: 2, fontSize: 14 }}>
          Installe Econia sur ton téléphone
        </div>
        <div style={{ color: T.textSoft, lineHeight: 1.45, fontSize: 12 }}>
          {iosMode ? (
            <>
              Bouton <strong>Partager</strong> → <strong>Sur l&apos;écran d&apos;accueil</strong>
            </>
          ) : (
            <>Accès direct, sans navigateur · 0 espace · alertes possibles</>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        {!iosMode && (
          <button
            onClick={install}
            style={{
              padding: "8px 14px",
              background: T.blue,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Installer
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Fermer la bannière d'installation"
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: T.textMuted,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            fontSize: 11,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
