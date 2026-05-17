"use client";
import { useRouter } from "next/navigation";
import { T, fonts } from "@/lib/theme";

/** Affiché si l'utilisateur n'a pas encore fait de scan */
export default function EmptyState() {
  const router = useRouter();
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "20px",
        padding: "48px 32px",
        textAlign: "center",
        marginBottom: "24px",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
      <h2 style={{ fontFamily: fonts.title, fontSize: "24px", fontWeight: 600, letterSpacing: "-1px", marginBottom: "8px" }}>
        Lance ton premier scan
      </h2>
      <p style={{ fontSize: "14px", color: T.textSoft, marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px", lineHeight: 1.6 }}>
        En 3 minutes, Econia analyse ta situation et identifie chaque euro que tu pourrais récupérer.
      </p>
      <button
        onClick={() => router.push("/?start=scan")}
        style={{
          padding: "14px 32px",
          background: T.blue,
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(37,99,235,0.15)",
        }}
      >
        Démarrer mon scan →
      </button>
    </div>
  );
}
