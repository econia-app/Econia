"use client";
import { useId } from "react";
import { T } from "@/lib/theme";

/**
 * Logo "Mon dossier" — chemise avec un document qui dépasse, aux couleurs Econia
 * (dégradé bleu → violet). Taille réglable. Décoratif (aria-hidden).
 */
export default function DossierIcon({ size = 40 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="6" y1="9" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={T.blue} />
          <stop offset="1" stopColor={T.purple} />
        </linearGradient>
      </defs>
      {/* Dos de la chemise */}
      <path
        d="M5 13.5A3.5 3.5 0 0 1 8.5 10h7.6a3 3 0 0 1 2.32 1.1L20.2 13H39.5A3.5 3.5 0 0 1 43 16.5V21H5v-7.5z"
        fill={`url(#${id})`}
        opacity="0.5"
      />
      {/* Document qui dépasse */}
      <rect x="13.5" y="13.5" width="21" height="15" rx="2.5" fill="#fff" />
      <rect x="17" y="17.5" width="14" height="1.9" rx="0.95" fill="#C7D2E4" />
      <rect x="17" y="21.2" width="9.5" height="1.9" rx="0.95" fill="#C7D2E4" />
      {/* Devant de la chemise */}
      <path
        d="M5 18.5h38v16A3.5 3.5 0 0 1 39.5 38H8.5A3.5 3.5 0 0 1 5 34.5v-16z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}
