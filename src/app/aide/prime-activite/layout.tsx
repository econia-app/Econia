/**
 * Metadata SEO pour la page /aide/prime-activite
 * (séparée car page.tsx est "use client" et ne peut pas exporter metadata)
 */
import type { Metadata } from "next";

const TITLE = "Prime d'activité 2026 : calcule ton montant en 30 secondes";
const DESC =
  "1 actif sur 3 ne réclame pas sa Prime d'activité. Mini-scan gratuit en 5 questions pour estimer ton montant mensuel et lancer la démarche CAF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/prime-activite" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/prime-activite",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-image.png"],
  },
};

export default function PrimeActiviteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
