import type { Metadata } from "next";

const TITLE = "Complémentaire Santé Solidaire 2026 : suis-je éligible ?";
const DESC =
  "Mutuelle gratuite ou à moins d'1€/jour selon tes ressources. Mini-scan gratuit en 3 questions pour vérifier ton éligibilité CSS et estimer ton économie annuelle.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/complementaire-sante" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/complementaire-sante",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function CssLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
