"use client";
import { useState } from "react";
import { T } from "@/lib/theme";

type Props = {
  gainPotentiel: number;
  gainRecupere: number;
  nbPistes: number;
};

/**
 * ShareEconomies — bouton pour partager ses économies trouvées avec Econia.
 *
 * Construit l'URL /partage?total=...&pistes=... à partir des stats de l'utilisateur.
 * Utilise navigator.share si dispo (mobile), sinon copie l'URL dans le presse-papier.
 *
 * Privilégie le gain RÉCUPÉRÉ si > 0 (plus crédible), sinon affiche le potentiel.
 */
export default function ShareEconomies({ gainPotentiel, gainRecupere, nbPistes }: Props) {
  const [copied, setCopied] = useState(false);

  const total = gainRecupere > 0 ? gainRecupere : gainPotentiel;
  const url = `https://econia.fr/partage?total=${total}&pistes=${nbPistes}`;
  const text =
    gainRecupere > 0
      ? `J'ai déjà récupéré ${total.toLocaleString()}€ avec Econia. Toi aussi tu peux voir combien tu peux récupérer :`
      : `J'ai trouvé ≈ ${total.toLocaleString()}€/an d'argent perdu avec Econia. Découvre combien tu peux récupérer :`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Econia", text, url });
        return;
      } catch {
        // l'utilisateur a annulé ou la share API a échoué — fallback copie
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // pas de clipboard → fallback : alerte avec l'URL à copier manuellement
      alert(`Copie ce lien :\n${url}`);
    }
  };

  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px dashed ${T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 2 }}>
          📣 Partager mes économies
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>
          Aide tes proches à découvrir leur argent perdu. Sans pression.
        </div>
      </div>
      <button
        onClick={handleShare}
        style={{
          padding: "10px 18px",
          background: copied ? T.green : T.navy,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
          minHeight: 40,
          transition: "background 0.2s",
        }}
      >
        {copied ? "✓ Lien copié" : "Partager"}
      </button>
    </div>
  );
}
