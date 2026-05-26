import type { Metadata } from "next";

const TITLE = "Loi Lemoine 2026 : changer d'assurance emprunteur et économiser jusqu'à 15 000€";
const DESC =
  "Depuis 2022, la loi Lemoine permet de changer d'assurance emprunteur à tout moment. Économie typique : 3 000 à 15 000€ sur la durée du prêt. Guide complet 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/guide/loi-lemoine-assurance-emprunteur" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/guide/loi-lemoine-assurance-emprunteur",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function GuideLemoineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
