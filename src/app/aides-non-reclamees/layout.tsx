import type { Metadata } from "next";

const TITLE = "Aides non réclamées en France : 10 milliards d'euros oubliés chaque année";
const DESC =
  "Chaque année, 10 milliards d'euros d'aides sociales ne sont jamais réclamés en France. Découvre lesquelles te concernent, leur montant, et comment les toucher en 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aides-non-reclamees" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aides-non-reclamees",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function AidesNonReclameesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
