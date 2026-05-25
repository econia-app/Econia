import type { Metadata } from "next";

const TITLE = "Loi Lemoine 2026 : combien tu peux économiser sur ton assurance emprunteur ?";
const DESC =
  "Depuis 2022, tu peux changer d'assurance emprunteur à tout moment. Économie moyenne : 3 000 à 15 000€ sur la durée de ton prêt. Mini-scan gratuit en 3 questions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/loi-lemoine" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/loi-lemoine",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function LemoineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
