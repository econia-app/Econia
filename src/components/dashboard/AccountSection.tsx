"use client";
import { T } from "@/lib/theme";

type Props = {
  email: string;
  onRescan: () => void;
  onLogout: () => void;
  onDelete: () => void;
};

/** Section paramètres compte : refaire scan, déconnexion, suppression */
export default function AccountSection({ email, onRescan, onLogout, onDelete }: Props) {
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "16px",
        padding: "20px 24px",
        marginTop: "32px",
      }}
    >
      <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>
        Paramètres du compte
      </h3>
      <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "16px" }}>
        Connecté en tant que <strong style={{ color: T.navy }}>{email}</strong>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <button
          onClick={onRescan}
          style={{
            padding: "10px 16px",
            background: T.blueLight,
            color: T.blue,
            border: `1px solid ${T.blue}33`,
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            minHeight: 40,
          }}
        >
          🔄 Refaire le scan
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: "10px 16px",
            background: "transparent",
            color: T.textSoft,
            border: `1px solid ${T.border}`,
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            minHeight: 40,
          }}
        >
          Déconnexion
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: "10px 16px",
            background: "transparent",
            color: T.red,
            border: `1px solid ${T.red}33`,
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: "auto",
            minHeight: 40,
          }}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
