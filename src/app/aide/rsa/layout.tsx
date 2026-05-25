import type { Metadata } from "next";

const TITLE = "RSA 2026 : calcule ton montant en 30 secondes";
const DESC =
  "Le RSA peut atteindre 651€/mois en 2026 pour une personne seule. Mini-scan gratuit en 5 questions pour estimer ton montant et lancer la démarche CAF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/rsa" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/rsa",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function RsaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
