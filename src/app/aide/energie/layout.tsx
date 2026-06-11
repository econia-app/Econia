import type { Metadata } from "next";

const TITLE = "Facture d'électricité trop chère ? Mini-scan énergie gratuit 2026";
const DESC =
  "Fournisseur non comparé, mauvaise option tarifaire, puissance trop élevée… Diagnostic gratuit en 5 questions pour récupérer 100 à 300€/an sur ta facture d'énergie.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/energie" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/energie",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function EnergieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
