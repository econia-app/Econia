import type { Metadata } from "next";

const TITLE = "APL 2026 : calcule ton aide au logement en 30 secondes";
const DESC =
  "Locataire ? L'APL peut atteindre 300€/mois selon ta zone et tes ressources. Mini-scan gratuit en 5 questions pour estimer ton montant et lancer la démarche CAF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/apl" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/apl",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function AplLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
