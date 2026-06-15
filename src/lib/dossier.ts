/**
 * Econia — Configuration du "Mon dossier"
 *
 * Coffre personnel où l'abonné renseigne ses contrats / infos, par section
 * (Assurances, Énergie, Abonnements, Aides). Les données sont stockées dans
 * profiles.dossier (jsonb) sous la forme :
 *   { [sectionKey]: DossierEntry[] }
 *
 * Cette config décrit les champs de chaque section ; l'UI est générique.
 */
import { T } from "@/lib/theme";

export type DossierFieldType = "text" | "number" | "date" | "select" | "textarea";

export type DossierField = {
  key: string;
  label: string;
  type: DossierFieldType;
  options?: string[];
  placeholder?: string;
  /** Suffixe affiché (ex. "€/an") */
  suffix?: string;
  /** Champ utilisé comme titre de la fiche dans la liste */
  asTitle?: boolean;
};

export type DossierSectionConfig = {
  key: string;
  label: string;
  icon: string;
  color: string;
  /** Libellé d'une entrée au singulier (ex. "contrat", "abonnement") */
  itemLabel: string;
  fields: DossierField[];
};

/** Une entrée du dossier : un id + des valeurs de champs. */
export type DossierEntry = { id: string } & Record<string, string | number>;

/** Tout le dossier d'un utilisateur. */
export type Dossier = Record<string, DossierEntry[]>;

export const DOSSIER_SECTIONS: DossierSectionConfig[] = [
  {
    key: "assurances",
    label: "Assurances",
    icon: "🛡️",
    color: T.purple,
    itemLabel: "contrat",
    fields: [
      { key: "type", label: "Type", type: "select", options: ["Auto", "Habitation", "Mutuelle santé", "Emprunteur", "Téléphone", "Autre"], asTitle: true },
      { key: "assureur", label: "Assureur", type: "text", placeholder: "Ex. MAIF, AXA…" },
      { key: "montant", label: "Cotisation", type: "number", suffix: "€/an" },
      { key: "echeance", label: "Date d'échéance", type: "date" },
      { key: "numero", label: "N° de contrat", type: "text", placeholder: "Facultatif" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Garanties, franchise, à renégocier…" },
    ],
  },
  {
    key: "energie",
    label: "Énergie",
    icon: "⚡",
    color: T.red,
    itemLabel: "contrat",
    fields: [
      { key: "type", label: "Énergie", type: "select", options: ["Électricité", "Gaz", "Électricité + Gaz"], asTitle: true },
      { key: "fournisseur", label: "Fournisseur", type: "text", placeholder: "Ex. EDF, TotalEnergies…" },
      { key: "offre", label: "Offre", type: "text", placeholder: "Ex. Tarif Bleu, offre fixe…" },
      { key: "montant", label: "Montant", type: "number", suffix: "€/an" },
      { key: "puissance", label: "Puissance", type: "text", placeholder: "Ex. 6 kVA, 9 kVA…" },
      { key: "option", label: "Option", type: "select", options: ["Base", "Heures Creuses", "Je ne sais pas"] },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Échéance, conso annuelle…" },
    ],
  },
  {
    key: "abonnements",
    label: "Abonnements",
    icon: "📱",
    color: T.amber,
    itemLabel: "abonnement",
    fields: [
      { key: "nom", label: "Nom", type: "text", placeholder: "Ex. Netflix, salle de sport…", asTitle: true },
      { key: "montant", label: "Montant", type: "number", suffix: "€" },
      { key: "frequence", label: "Fréquence", type: "select", options: ["Par mois", "Par an"] },
      { key: "usage", label: "Utilisation", type: "select", options: ["Souvent", "Parfois", "Rarement", "Jamais"] },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "À résilier ? Fin d'engagement ?" },
    ],
  },
  {
    key: "aides",
    label: "Aides",
    icon: "🏛️",
    color: T.blue,
    itemLabel: "aide",
    fields: [
      { key: "nom", label: "Aide", type: "text", placeholder: "Ex. APL, prime d'activité…", asTitle: true },
      { key: "organisme", label: "Organisme", type: "text", placeholder: "Ex. CAF, France Travail…" },
      { key: "statut", label: "Statut", type: "select", options: ["À vérifier", "À demander", "Demandée", "Reçue"] },
      { key: "montant", label: "Montant estimé", type: "number", suffix: "€/an" },
      { key: "notes", label: "Notes", type: "textarea", placeholder: "Date de demande, n° dossier…" },
    ],
  },
];

/** Renvoie la valeur d'affichage du "titre" d'une entrée. */
export function entryTitle(section: DossierSectionConfig, entry: DossierEntry): string {
  const titleField = section.fields.find((f) => f.asTitle) || section.fields[0];
  const v = entry[titleField.key];
  return v ? String(v) : `${section.itemLabel} sans nom`;
}
