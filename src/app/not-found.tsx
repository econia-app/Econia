import Link from "next/link";

export const metadata = {
  title: "Page introuvable",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#FAFBFF",
        color: "#0F172A",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "72px",
          fontFamily: "'Fraunces', serif",
          fontWeight: 700,
          letterSpacing: "-3px",
          background: "linear-gradient(135deg, #2563EB, #7C3AED)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "-1px",
          marginTop: 0,
          marginBottom: "10px",
        }}
      >
        Page introuvable
      </h1>
      <p style={{ fontSize: "15px", color: "#475569", maxWidth: "400px", lineHeight: 1.6, marginBottom: "32px" }}>
        Cette page n&apos;existe pas ou a été déplacée. Pas grave, on a mieux à vous proposer.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "14px 28px",
            background: "#2563EB",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(37,99,235,0.15)",
          }}
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/scan"
          style={{
            padding: "14px 28px",
            background: "#FFFFFF",
            color: "#0F172A",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Lancer le scan
        </Link>
      </div>
    </div>
  );
}
