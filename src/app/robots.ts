import type { MetadataRoute } from "next";

/**
 * Robots.txt dynamique Econia
 *
 * Autorise tous les crawlers à indexer le site, sauf les routes privées
 * (dashboard utilisateur, API delete-account). Pointe vers le sitemap.
 */

const BASE_URL = "https://econia.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/mon-compte", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
