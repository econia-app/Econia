import type { Metadata } from "next";

const TITLE = "Assurances : combien tu paies en trop ? Mini-scan gratuit 2026";
const DESC =
  "Comparaison jamais faite, doublons carte bancaire, assurance des moyens de paiement inutile… Diagnostic gratuit en 5 questions pour récupérer 100 à 400€/an sur tes assurances.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/assurances" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/assurances",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function AssurancesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
