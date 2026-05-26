import type { Metadata } from "next";

const TITLE = "Chèque énergie 2026 : qui y a droit et combien ?";
const DESC =
  "Le chèque énergie 2026 : montants (48 à 277€), conditions, automatisme. Guide complet et estimation gratuite en 3 questions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/guide/cheque-energie-2026" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/guide/cheque-energie-2026",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function GuideChequeEnergieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
