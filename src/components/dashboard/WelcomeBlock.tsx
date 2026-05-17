"use client";
import { T, fonts } from "@/lib/theme";

type Props = {
  email: string;
  isFounder: boolean;
  isPremium: boolean;
};

/** Bloc de bienvenue : prénom (parse email) + badge fondateur/premium */
export default function WelcomeBlock({ email, isFounder, isPremium }: Props) {
  // Extrait un prénom du email : "julien.guillard@..." → "julien"
  const firstName = email.split("@")[0].split(/[._]/)[0] || "toi";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
        <h1 style={{ fontFamily: fonts.title, fontSize: "clamp(28px, 4.5vw, 36px)", fontWeight: 600, letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
          Bonjour {displayName}
        </h1>
        {isFounder && (
          <span
            style={{
              fontSize: "11px",
              background: T.amberLight,
              color: T.amber,
              padding: "4px 10px",
              borderRadius: "8px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            FONDATEUR
          </span>
        )}
        {isPremium && !isFounder && (
          <span
            style={{
              fontSize: "11px",
              background: T.blueLight,
              color: T.blue,
              padding: "4px 10px",
              borderRadius: "8px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            PREMIUM
          </span>
        )}
      </div>
      <p style={{ fontSize: "14px", color: T.textSoft, margin: 0 }}>
        Ton espace Econia — suis tes pistes d&apos;économies et déclare tes gains au fur et à mesure.
      </p>
    </div>
  );
}
