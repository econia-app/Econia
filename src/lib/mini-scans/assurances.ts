/**
 * Mini-scan Assurances — diagnostic d'économie + plan d'action
 *
 * Contrairement aux mini-scans "aide" (calcul d'éligibilité CAF), il n'existe
 * pas de formule officielle ici : on DIAGNOSTIQUE ce que le foyer paie
 * probablement en trop (comparaison non faite + doublons), et on génère un
 * plan d'action concret (loi Hamon, résiliation assurance des moyens de
 * paiement, doublons carte bancaire).
 *
 * ⚠️ Estimations indicatives et PRUDENTES — chiffres sourcés dans ASSURANCES_2026.
 */
import { ASSURANCES_2026 } from "@/lib/baremes-2026";
import type { MiniScanQuestion } from "@/lib/mini-scans/prime-activite";

export type { MiniScanQuestion };

export const assurancesQuestions: MiniScanQuestion[] = [
  {
    id: "compare",
    q: "À quand remonte ta dernière comparaison d'assurances ?",
    sub: "Auto et/ou habitation. Les tarifs grimpent en moyenne chaque année.",
    options: [
      { value: "jamais", label: "Jamais, ou je ne sais plus" },
      { value: "vieux", label: "Il y a plus de 2 ans" },
      { value: "recent", label: "Il y a moins d'un an" },
    ],
  },
  {
    id: "contrats",
    q: "Quelles assurances paies-tu aujourd'hui ?",
    options: [
      { value: "auto_habit", label: "Auto + habitation (les deux)" },
      { value: "habit", label: "Habitation seule (pas de voiture)" },
      { value: "auto", label: "Auto seule" },
    ],
  },
  {
    id: "carte",
    q: "Quel type de carte bancaire as-tu ?",
    sub: "Les cartes haut de gamme incluent déjà des assurances (voyage, casse, annulation…).",
    options: [
      { value: "haut", label: "Haut de gamme (Visa Premier, Gold Mastercard, Platinum…)" },
      { value: "classique", label: "Classique (Visa / Mastercard standard)" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
  },
  {
    id: "moyensPaiement",
    q: "Payes-tu une « assurance des moyens de paiement » à ta banque ?",
    sub: "Ligne ~2 à 4€/mois sur ton relevé (assurance perte/vol de carte).",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "inconnu", label: "Je ne sais pas / à vérifier" },
    ],
  },
  {
    id: "affinitaires",
    q: "As-tu souscrit des assurances séparées pour…",
    sub: "Téléphone, voyage, annulation, casse/vol d'achats, extension de garantie.",
    options: [
      { value: "plusieurs", label: "Oui, plusieurs" },
      { value: "une", label: "Une ou deux" },
      { value: "non", label: "Non, aucune" },
    ],
  },
];

export type AssurancesDiagnostic = {
  /** Fourchette d'économie annuelle estimée (€/an) */
  economieMin: number;
  economieMax: number;
  /** Y a-t-il une économie significative à aller chercher ? */
  eligible: boolean;
  /** Nombre de pistes d'économie détectées */
  nbPistes: number;
  /** Plan d'action concret (affiché gratuitement) */
  actions: string[];
};

/** Arrondi à la dizaine pour des montants "propres". */
function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

export function diagnostiquerAssurances(a: Record<string, string>): AssurancesDiagnostic {
  const B = ASSURANCES_2026;
  let min = 0;
  let max = 0;
  let nbPistes = 0;
  const actions: string[] = [];

  // === Piste 1 : comparaison auto / habitation (loi Hamon) ===
  // Facteur selon l'ancienneté de la dernière comparaison.
  const facteurCompare = a.compare === "jamais" ? 1 : a.compare === "vieux" ? 0.6 : 0.15;
  let compMin = 0;
  let compMax = 0;
  if (a.contrats === "auto_habit" || a.contrats === "auto") {
    compMin += B.economieAuto[0];
    compMax += B.economieAuto[1];
  }
  if (a.contrats === "auto_habit" || a.contrats === "habit") {
    compMin += B.economieHabitation[0];
    compMax += B.economieHabitation[1];
  }
  compMin = compMin * facteurCompare;
  compMax = compMax * facteurCompare;
  if (compMax >= 20) {
    min += compMin;
    max += compMax;
    nbPistes += 1;
    if (a.compare === "recent") {
      actions.push(
        "🔄 Tu as comparé récemment, bien joué. Repense à le refaire chaque année à l'échéance : un écart de 40 à 60 % entre assureurs est courant pour un même profil."
      );
    } else {
      actions.push(
        "🔄 Compare ton assurance auto/habitation sur un comparateur gratuit. La loi Hamon te permet de résilier à tout moment après 1 an, sans frais ni justificatif — le nouvel assureur s'occupe de toutes les démarches à ta place."
      );
    }
  }

  // === Piste 2 : assurance des moyens de paiement (doublon quasi systématique) ===
  if (a.moyensPaiement === "oui") {
    min += B.coutAssuranceMoyensPaiement;
    max += B.coutAssuranceMoyensPaiement;
    nbPistes += 1;
    actions.push(
      `💳 Résilie l'« assurance des moyens de paiement » (~${B.coutAssuranceMoyensPaiement}€/an). ${B.acprAvis}`
    );
  } else if (a.moyensPaiement === "inconnu") {
    // Potentiel uniquement (on ne compte pas dans le minimum)
    max += B.coutAssuranceMoyensPaiement;
    nbPistes += 1;
    actions.push(
      `💳 Vérifie ton relevé bancaire : la ligne « assurance des moyens de paiement » (~${B.coutAssuranceMoyensPaiement}€/an) est souvent inutile. ${B.acprAvis}`
    );
  }

  // === Piste 3 : doublons d'assurances affinitaires ===
  if (a.affinitaires === "plusieurs" || a.affinitaires === "une") {
    const part = a.affinitaires === "plusieurs" ? 1 : 0.5;
    // Une carte haut de gamme rend le doublon plus probable (assurances déjà incluses)
    const boost = a.carte === "haut" ? 1.2 : a.carte === "classique" ? 0.7 : 0.9;
    min += B.economieDoublonsAffinitaires[0] * part * boost;
    max += B.economieDoublonsAffinitaires[1] * part * boost;
    nbPistes += 1;
    actions.push(
      "📑 Liste tes assurances « affinitaires » (téléphone, voyage, annulation, casse). Beaucoup font doublon avec ta carte bancaire ou ton assurance habitation — résilie celles qui se recoupent."
    );
  }
  if (a.carte === "haut") {
    actions.push(
      "✅ Ta carte haut de gamme inclut déjà des assurances (voyage, annulation, casse/vol, assistance). Avant de souscrire une assurance séparée, vérifie ce qu'elle couvre déjà."
    );
  }

  const economieMin = round10(min);
  const economieMax = round10(max);
  const eligible = economieMax >= B.seuilSignificatif;

  return { economieMin, economieMax, eligible, nbPistes, actions };
}
