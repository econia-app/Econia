import type { Metadata } from "next";

const TITLE = "Prime d'activité 2026 : qui peut la toucher et combien ?";
const DESC =
  "Tout savoir sur la prime d'activité 2026 : montants, conditions, démarches CAF. Jusqu'à 600€/mois selon ta situation. Estimation gratuite en 3 questions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/guide/prime-activite-2026" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/guide/prime-activite-2026",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function GuidePrimeActiviteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
