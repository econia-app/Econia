"use client";
/**
 * Route /scan — entrée directe au scan (deep-link).
 *
 * Cette page redirige côté client vers `/?start=scan` afin de réutiliser
 * l'orchestrateur de `src/app/page.tsx` qui gère tout le state global
 * (auth, profil, étapes scan/results). Cela permet de partager des liens
 * `econia.fr/scan` qui amènent directement au questionnaire.
 *
 * Avantage vs route Next dédiée : pas de duplication de logique state.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { T } from "@/lib/theme";

export default function ScanEntryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?start=scan");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.bg,
        color: T.textMuted,
        fontSize: 14,
      }}
    >
      Chargement du scan…
    </div>
  );
}
