/**
 * Econia — Design tokens partagés
 *
 * Source de vérité unique pour les couleurs, typographies et constantes
 * utilisées dans toute l'application. Synchronisé avec globals.css.
 *
 * Usage : import { T, fonts } from "@/lib/theme";
 */

export const T = {
  // Couleurs marque
  blue: "#2563EB",
  blueDark: "#1D4ED8",
  blueLight: "#EFF4FF",
  purple: "#7C3AED",
  navy: "#0F172A",

  // Surfaces
  bg: "#FAFBFF",
  bgWarm: "#F5F3FF",
  bgCard: "#FFFFFF",

  // Texte (contraste vérifié WCAG AA sur fond bg)
  text: "#0F172A",
  textSoft: "#475569",
  textMuted: "#64748B",
  textLight: "#94A3B8",

  // Bordures
  border: "#E2E8F0",
  borderLight: "#F1F5F9",

  // Sémantique
  green: "#059669",
  greenLight: "#ECFDF5",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  red: "#DC2626",
} as const;

export const fonts = {
  title: "'Fraunces', serif",
  body: "'Inter', sans-serif",
  sub: "'Inter', sans-serif",
} as const;

// Constantes métier
export const MAX_WAITLIST = 50;

// FAQ
export const faqs = [
  {
    q: "Comment Econia détecte mon argent perdu ?",
    a: "Econia croise tes réponses avec les barèmes officiels 2026 : aides CAF, tarifs énergie, moyennes assurances. L'analyse est instantanée et basée sur des données vérifiées.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Oui. Hébergement européen, chiffrement des données, aucun partage avec des tiers. Suppression possible à tout moment.",
  },
  {
    q: "Econia est-il un courtier en assurance ?",
    a: "Non. Econia t'aide à comprendre tes contrats et t'oriente vers les comparateurs officiels. Aucune vente, aucune commission.",
  },
  {
    q: "Les 500€/an sont-ils garantis ?",
    a: "Non. C'est une estimation moyenne. Le montant réel dépend de ta situation. Certains récupèrent plus de 5 000€, d'autres moins de 200€.",
  },
  {
    q: "Je peux annuler quand je veux ?",
    a: "Oui. Sans engagement. Résiliation en un clic. Accès maintenu jusqu'à la fin de la période payée.",
  },
];

// Mapping affichage catégories
export const catLabels: Record<string, string> = {
  aide: "Aides & prestations",
  assurance: "Assurances",
  abonnement: "Abonnements & contrats",
  energie: "Énergie",
};

export const catColors: Record<string, string> = {
  aide: T.blue,
  assurance: T.purple,
  abonnement: T.amber,
  energie: T.red,
};
