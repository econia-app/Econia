"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, catColors } from "@/lib/theme";
import { guides, gainToGuide, gainToMiniScan } from "@/lib/guides";
import type { Gain } from "@/lib/analyze";
import type { ActionState, ActionStatus } from "@/lib/supabase";

type Props = {
  gain: Gain;
  state: ActionState | undefined;
  isPremium: boolean;
  onStatusChange: (status: ActionStatus) => void;
  onDeclareAmount: () => void;
  onOpenGuide: (key: string) => void;
  onShowAuth: () => void;
  user: { id: string; email: string } | null;
};

const STATUS_LABELS: Record<ActionStatus, { label: string; bg: string; color: string }> = {
  todo: { label: "À faire", bg: "transparent", color: "#64748B" },
  doing: { label: "En cours", bg: "#FEF3C7", color: "#D97706" },
  done: { label: "Terminé", bg: "#ECFDF5", color: "#059669" },
};

/** Card d'un levier avec statut interactif + accès au guide */
export default function LeverCard({
  gain,
  state,
  isPremium,
  onStatusChange,
  onDeclareAmount,
  onOpenGuide,
  onShowAuth,
  user,
}: Props) {
  const router = useRouter();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const status: ActionStatus = state?.status ?? "todo";
  const statusUI = STATUS_LABELS[status];

  const guideKey = gainToGuide[gain.title];
  const guide = guideKey ? guides[guideKey] : null;
  const miniScanUrl = gainToMiniScan[gain.title]; // ex: "/aide/prime-activite"

  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px", marginBottom: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "22px" }}>{gain.icon}</span>
            <span style={{ fontSize: "15px", fontWeight: 700, color: T.navy }}>{gain.title}</span>
          </div>
          <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: "0 0 6px 32px" }}>
            {gain.desc}
          </p>
          <div
            style={{
              display: "inline-block",
              marginLeft: "32px",
              padding: "3px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: catColors[gain.cat] || T.blue,
              background: (catColors[gain.cat] || T.blue) + "15",
            }}
          >
            {gain.montant}
          </div>
        </div>

        {/* Sélecteur de statut */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setShowStatusMenu((o) => !o)}
            aria-haspopup="true"
            aria-expanded={showStatusMenu}
            style={{
              padding: "6px 12px",
              background: statusUI.bg,
              border: `1.5px solid ${status === "todo" ? T.border : statusUI.color + "55"}`,
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              color: statusUI.color,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              minHeight: 32,
              whiteSpace: "nowrap",
            }}
          >
            {statusUI.label}
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </button>
          {showStatusMenu && (
            <>
              <div
                onClick={() => setShowStatusMenu(false)}
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "4px",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
                  padding: "4px",
                  zIndex: 20,
                  minWidth: 120,
                }}
              >
                {(Object.keys(STATUS_LABELS) as ActionStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setShowStatusMenu(false);
                      onStatusChange(s);
                      // Si passage en done, on déclenche la saisie du montant
                      if (s === "done" && status !== "done") {
                        onDeclareAmount();
                      }
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      background: status === s ? T.bg : "transparent",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: STATUS_LABELS[s].color,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {STATUS_LABELS[s].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions disponibles */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "12px", borderTop: `1px solid ${T.borderLight}` }}>
        {/* Bouton mini-scan dédié si disponible pour ce levier */}
        {miniScanUrl && (
          <button
            onClick={() => router.push(miniScanUrl)}
            style={{
              padding: "10px 14px",
              background: T.greenLight,
              color: T.green,
              border: `1px solid ${T.green}33`,
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            🎯 Calculer mon montant exact
          </button>
        )}
        {guide && (
          <button
            onClick={() => {
              if (isPremium) onOpenGuide(guideKey);
              else if (!user) onShowAuth();
            }}
            disabled={!isPremium && !!user}
            style={{
              flex: 1,
              minWidth: 200,
              padding: "10px 14px",
              background: isPremium ? T.blueLight : T.bg,
              color: isPremium ? T.blue : T.textMuted,
              border: isPremium ? `1px solid ${T.blue}33` : `1px dashed ${T.border}`,
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: isPremium ? "pointer" : (user ? "default" : "pointer"),
              textAlign: "left",
            }}
          >
            {isPremium
              ? `📖 Voir le guide (${guide.steps.length} étapes)`
              : `🔒 Guide Premium (${guide.steps.length} étapes) — ${user ? "Passer Premium" : "Créer un compte"}`}
          </button>
        )}
        {status === "done" && (
          <button
            onClick={onDeclareAmount}
            style={{
              padding: "10px 14px",
              background: T.greenLight,
              color: T.green,
              border: `1px solid ${T.green}33`,
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            💰 {state?.montant ? `${state.montant.toLocaleString()}€ récupéré · modifier` : "Déclarer le montant"}
          </button>
        )}
      </div>
    </div>
  );
}
