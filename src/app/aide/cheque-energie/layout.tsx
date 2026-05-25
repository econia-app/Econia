import type { Metadata } from "next";

const TITLE = "Chèque énergie 2026 : jusqu'à 277€/an, suis-je éligible ?";
const DESC =
  "Le chèque énergie aide à payer électricité, gaz, fioul ou travaux d'isolation. Mini-scan gratuit en 3 questions pour vérifier ton éligibilité et estimer ton montant.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/cheque-energie" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/cheque-energie",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function ChequeEnergieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
