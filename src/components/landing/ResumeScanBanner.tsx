"use client";
import { useRouter } from "next/navigation";
import { T, fonts } from "@/lib/theme";

type Props = {
  gainEstime?: number;
};

/**
 * Bandeau affiché en haut de la home pour les utilisateurs connectés
 * qui ont déjà rempli leur scan. Évite qu'ils refassent le scan inutilement.
 */
export default function ResumeScanBanner({ gainEstime }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        position: "fixed",
        top: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 90,
        maxWidth: "calc(100% - 32px)",
        width: "auto",
        background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
        borderRadius: "14px",
        padding: "12px 18px",
        boxShadow: "0 8px 32px rgba(37,99,235,0.22)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        color: "#fff",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: "20px" }}>🎯</div>
      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>
          Tu as déjà un scan {gainEstime ? `· ≈ ${gainEstime.toLocaleString()}€/an` : ""}
        </div>
        <div style={{ fontSize: "11px", opacity: 0.85, lineHeight: 1.3 }}>
          Retrouve tes pistes et tes guides d&apos;action
        </div>
      </div>
      <button
        onClick={() => router.push("/mon-compte")}
        style={{
          padding: "8px 16px",
          background: "#fff",
          color: T.navy,
          border: "none",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: fonts.body,
          whiteSpace: "nowrap",
          minHeight: 36,
        }}
      >
        Mon espace →
      </button>
    </div>
  );
}
