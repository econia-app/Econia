import type { Metadata } from "next";

const TITLE = "Allocation rentrée scolaire 2025-2026 : calcule ton montant";
const DESC =
  "Jusqu'à 454€ par enfant scolarisé, versés mi-août. 4 questions pour savoir si tu y as droit et combien tu vas toucher.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/aide/ars" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/aide/ars",
    type: "article",
    locale: "fr_FR",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.png"] },
};

export default function ArsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
