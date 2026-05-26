/**
 * Schemas Schema.org centralisés pour Econia
 *
 * Source de vérité unique pour le structured data SEO.
 * À importer dans les layouts/pages via <JsonLd data={...} />.
 *
 * Référence : https://schema.org / https://developers.google.com/search/docs/appearance/structured-data
 */

import { faqs } from "@/lib/theme";

const SITE_URL = "https://econia.fr";
const SITE_NAME = "Econia";

// ──────────────────────────────────────────────────────────────────
// Organization — identité de la marque
// ──────────────────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/android-chrome-512.png`,
  description:
    "L'agent IA qui détecte l'argent que tu perds sans le savoir et t'accompagne pour le récupérer.",
  email: "econia.app@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
    addressLocality: "Soucy",
    postalCode: "89100",
  },
  areaServed: { "@type": "Country", name: "France" },
};

// ──────────────────────────────────────────────────────────────────
// WebSite — site avec search action (active la sitelinks searchbox Google)
// ──────────────────────────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "fr-FR",
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

// ──────────────────────────────────────────────────────────────────
// FAQPage — la FAQ de la home
// ──────────────────────────────────────────────────────────────────
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ──────────────────────────────────────────────────────────────────
// BreadcrumbList — fil d'ariane indexable
// ──────────────────────────────────────────────────────────────────
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

// ──────────────────────────────────────────────────────────────────
// HowTo — pour les guides d'action (étapes)
// ──────────────────────────────────────────────────────────────────
export function howToSchema(params: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
  totalTime?: string; // ISO 8601 duration, ex: "PT30M"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    url: params.url.startsWith("http") ? params.url : `${SITE_URL}${params.url}`,
    inLanguage: "fr-FR",
    ...(params.totalTime ? { totalTime: params.totalTime } : {}),
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// ──────────────────────────────────────────────────────────────────
// Article — pour la page pilier et les guides SEO
// ──────────────────────────────────────────────────────────────────
export function articleSchema(params: {
  headline: string;
  description: string;
  url: string;
  datePublished: string; // ISO 8601
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url.startsWith("http") ? params.url : `${SITE_URL}${params.url}`,
    inLanguage: "fr-FR",
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/android-chrome-512.png` },
    },
    image: params.image || `${SITE_URL}/og-image.png`,
  };
}
