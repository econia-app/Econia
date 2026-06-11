/**
 * Mini-scan Énergie — diagnostic d'économie + plan d'action
 *
 * Pas de formule officielle : on DIAGNOSTIQUE le surcoût probable (fournisseur
 * non comparé, mauvaise option tarifaire, puissance surdimensionnée) et on
 * génère un plan d'action concret (comparateur officiel, option Heures Creuses,
 * baisse de puissance — tout est gratuit et réversible avec Linky).
 *
 * ⚠️ Estimations indicatives et PRUDENTES — chiffres sourcés dans ENERGIE_2026.
 */
import { ENERGIE_2026 } from "@/lib/baremes-2026";
import type { MiniScanQuestion } from "@/lib/mini-scans/prime-activite";

export type { MiniScanQuestion };

export const energieQuestions: MiniScanQuestion[] = [
  {
    id: "chauffage",
    q: "Comment te chauffes-tu principalement ?",
    sub: "Le chauffage électrique pèse lourd dans la facture — et ouvre le plus d'économies.",
    options: [
      { value: "elec", label: "Électricité (radiateurs, clim réversible, pompe à chaleur)" },
      { value: "autre", label: "Gaz, fioul, bois ou réseau de chaleur" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
  },
  {
    id: "fournisseur",
    q: "Ton contrat d'électricité, c'est…",
    options: [
      { value: "trv", label: "Le Tarif Bleu / réglementé EDF (fournisseur historique)" },
      { value: "marche", label: "Une offre de marché (Engie, TotalEnergies, alternatif…)" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
  },
  {
    id: "compare",
    q: "As-tu déjà comparé les fournisseurs d'électricité ?",
    options: [
      { value: "jamais", label: "Jamais" },
      { value: "vieux", label: "Il y a plus de 2 ans" },
      { value: "recent", label: "Récemment (moins d'un an)" },
    ],
  },
  {
    id: "option",
    q: "Tu es en option tarifaire…",
    sub: "Visible sur ta facture, près de la puissance (en kVA).",
    options: [
      { value: "base", label: "Base (un seul prix toute la journée)" },
      { value: "hc", label: "Heures Pleines / Heures Creuses" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
  },
  {
    id: "decalable",
    q: "Peux-tu décaler des consos vers la nuit ?",
    sub: "Chauffe-eau, lave-linge, lave-vaisselle, recharge de voiture électrique…",
    options: [
      { value: "oui", label: "Oui, plusieurs (dont chauffe-eau ou voiture)" },
      { value: "peu", label: "Un peu (lave-linge, lave-vaisselle)" },
      { value: "non", label: "Non, pas vraiment" },
    ],
  },
];

export type EnergieDiagnostic = {
  /** Fourchette d'économie annuelle estimée (€/an) */
  economieMin: number;
  economieMax: number;
  /** Y a-t-il une économie significative à aller chercher ? */
  eligible: boolean;
  /** Nombre de pistes d'économie détectées */
  nbPistes: number;
  /** Plan d'action concret (affiché aux abonnés ; verrouillé pour les autres) */
  actions: string[];
};

/** Arrondi à la dizaine. */
function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

export function diagnostiquerEnergie(a: Record<string, string>): EnergieDiagnostic {
  const B = ENERGIE_2026;
  let min = 0;
  let max = 0;
  let nbPistes = 0;
  const actions: string[] = [];

  // === Piste 1 : comparaison / changement de fournisseur ===
  // Facteur selon l'ancienneté de la comparaison, rehaussé si encore au tarif réglementé.
  let facteurFourn =
    a.compare === "jamais" ? 1 : a.compare === "vieux" ? 0.6 : a.compare === "recent" ? 0.2 : 0.7;
  if (a.fournisseur === "trv") facteurFourn = Math.max(facteurFourn, 0.9);
  const fournMin = B.economieFournisseur[0] * facteurFourn;
  const fournMax = B.economieFournisseur[1] * facteurFourn;
  if (fournMax >= 20) {
    min += fournMin;
    max += fournMax;
    nbPistes += 1;
    if (a.fournisseur === "trv") {
      actions.push(
        "🔌 Tu es au Tarif Bleu réglementé : la majorité des offres de marché sont moins chères à consommation égale (~100 à 170€/an d'économie). Compare sur le comparateur officiel et indépendant du Médiateur national de l'énergie."
      );
    } else {
      actions.push(
        "🔌 Compare les fournisseurs sur le comparateur officiel du Médiateur de l'énergie (gratuit et indépendant). Changer est sans coupure, sans frais et réversible — le nouveau fournisseur s'occupe de toutes les démarches."
      );
    }
  }

  // === Piste 2 : option Heures Creuses (si conso décalable et pas déjà en HC) ===
  if (a.option !== "hc" && (a.decalable === "oui" || a.decalable === "peu")) {
    const partDecalable = a.decalable === "oui" ? 1 : 0.5;
    const boostChauffage = a.chauffage === "elec" ? 1 : 0.6;
    min += B.economieHeuresCreuses[0] * partDecalable * boostChauffage;
    max += B.economieHeuresCreuses[1] * partDecalable * boostChauffage;
    nbPistes += 1;
    actions.push(
      "🌙 Passe en option Heures Creuses et décale tes gros postes la nuit (chauffe-eau, lave-linge, lave-vaisselle, recharge voiture). Le changement d'option est gratuit et réalisé à distance sous 24h avec un compteur Linky."
    );
  } else if (a.option === "hc") {
    actions.push(
      "🌙 Tu es déjà en Heures Creuses : vérifie que tu décales bien au moins 26 % de ta consommation la nuit, sinon l'option Base peut être plus avantageuse."
    );
  }

  // === Piste 3 : puissance souscrite (action, non chiffrée car dépend du foyer) ===
  actions.push(
    `⚡ Vérifie ta puissance souscrite (en kVA, sur ta facture) : si elle est surdimensionnée, chaque palier en trop coûte ~${B.coutParPalierPuissance}€/an d'abonnement pour rien. La baisser est gratuit avec Linky.`
  );

  const economieMin = round10(min);
  const economieMax = round10(max);
  const eligible = economieMax >= B.seuilSignificatif;

  return { economieMin, economieMax, eligible, nbPistes, actions };
}
