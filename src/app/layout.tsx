import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/seo/JsonLd";
import InstallPWABanner from "@/components/InstallPWABanner";
import { organizationSchema, websiteSchema } from "@/lib/schemas";
import "./globals.css";

const SITE_URL = "https://econia.fr";
const SITE_NAME = "Econia";
const SITE_TITLE = "Econia — Récupère l'argent que tu perds chaque mois";
const SITE_DESCRIPTION =
  "Scan gratuit en 3 minutes : aides non réclamées, assurances, abonnements, énergie. En moyenne 500€/an récupérés.";

// ─────────────────────────────────────────────────────────────────
// CODES DE VÉRIFICATION SEARCH ENGINES
// À remplir avec les codes fournis par Search Console / Bing Webmaster.
// Procédure dans docs/seo-search-console.md
// ─────────────────────────────────────────────────────────────────
const GOOGLE_SITE_VERIFICATION = ""; // ex: "abc123..."
const BING_SITE_VERIFICATION = ""; // ex: "ABC123..."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Econia",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Econia" }],
  generator: "Next.js",
  keywords: [
    "aides non réclamées",
    "RSA",
    "prime d'activité",
    "APL",
    "économies",
    "assurance",
    "abonnements",
    "énergie",
    "budget",
    "France",
    "argent perdu",
    "loi Lemoine",
    "chèque énergie",
    "ASPA",
    "ARS",
    "CSS",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Econia",
  publisher: "Econia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Econia — Récupère l'argent que tu perds chaque mois",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    ...(BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {children}
        <InstallPWABanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
