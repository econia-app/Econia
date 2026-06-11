import type { MetadataRoute } from "next";

/**
 * Sitemap dynamique Econia
 *
 * Indexable par Google + Bing à l'URL /sitemap.xml
 * Inclut toutes les pages publiques : home, mini-scans /aide/*, guides publics
 * SEO /guide/*, page pilier, mentions légales.
 *
 * À tenir à jour quand on ajoute un nouveau mini-scan ou guide public.
 */

const BASE_URL = "https://econia.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages principales — priorité max, fréquence weekly
  const main: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${BASE_URL}/aides-non-reclamees`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Mini-scans /aide/* — outils interactifs, priorité élevée
  const miniScans = [
    "prime-activite",
    "rsa",
    "apl",
    "ars",
    "complementaire-sante",
    "cheque-energie",
    "aspa",
    "loi-lemoine",
    "assurances",
    "energie",
    "abonnements",
  ].map((slug) => ({
    url: `${BASE_URL}/aide/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Guides publics /guide/* — contenu SEO, priorité élevée
  const publicGuides = [
    "prime-activite-2026",
    "loi-lemoine-assurance-emprunteur",
    "cheque-energie-2026",
  ].map((slug) => ({
    url: `${BASE_URL}/guide/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Pages légales — priorité basse mais indexables
  const legal: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cgu`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...main, ...miniScans, ...publicGuides, ...legal];
}
