import type { Metadata } from "next";

const TITLE = "Abonnements fantômes : combien tu paies pour rien ? Mini-scan 2026";
const DESC =
  "1 Français sur 3 paie un abonnement qu'il n'utilise plus. Diagnostic gratuit en 5 questions pour repérer tes abonnements fantômes et les résilier en 3 clics. Jusqu'à 500€/an.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/abonnements" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/abonnements",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function AbonnementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
