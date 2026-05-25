import type { Metadata } from "next";

const TITLE = "Minimum vieillesse (ASPA) 2026 : combien tu peux toucher ?";
const DESC =
  "Jusqu'à 1 052€/mois (seul) ou 1 634€/mois (couple) en 2026. Mini-scan gratuit en 3 questions pour estimer ton complément ASPA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/aspa" },
  openGraph: { title: TITLE, description: DESC, url: "/aide/aspa", type: "article", locale: "fr_FR", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function AspaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
