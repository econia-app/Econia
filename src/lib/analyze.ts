/**
 * Econia — Analyse du profil et calcul des gains potentiels
 *
 * Croise les réponses du scan avec les barèmes 2026 pour identifier
 * les pistes d'économies (aides, assurances, abonnements, énergie).
 */

export type Gain = {
  cat: string;
  icon: string;
  title: string;
  desc: string;
  montant: string;
  annuel: number[];
};

export type Info = {
  icon: string;
  title: string;
  desc: string;
};

export type ScanResult = {
  gains: Gain[];
  infos: Info[];
  gainMin: number;
  gainMax: number;
};

export function analyzeProfile(a: Record<string, string>): ScanResult {
  const gains: Gain[] = [];
  const infos: Info[] = [];
  const isModeste = a.revenus === "moins1500" || a.revenus === "1500-2500";
  const hasKids = a.enfants && a.enfants !== "0";
  const youngKids = a.ageEnfant === "moins3" || a.ageEnfant === "3-5";

  if (a.revenus === "moins1500" && a.statut !== "retraite")
    gains.push({ cat: "aide", icon: "🏛️", title: "RSA", desc: "Revenu minimum garanti.", montant: "jusqu'à 651€/mois", annuel: [3500, 7820] });
  if (isModeste && !["retraite", "etudiant", "chomage"].includes(a.statut))
    gains.push({ cat: "aide", icon: "💰", title: "Prime d'activité", desc: "Complément pour travailleurs modestes.", montant: "100 à 350€/mois", annuel: [1200, 4200] });
  if (a.logement === "locataire" && isModeste)
    gains.push({ cat: "aide", icon: "🏠", title: "APL", desc: "Aide pour réduire votre loyer.", montant: "50 à 400€/mois", annuel: [600, 4800] });
  if (hasKids && ["6-10", "11-17"].includes(a.ageEnfant) && isModeste)
    gains.push({ cat: "aide", icon: "🎒", title: "Allocation rentrée scolaire", desc: "Versée en août.", montant: "429 à 468€/enfant", annuel: [429, 936] });
  if (a.statut === "retraite" && isModeste)
    gains.push({ cat: "aide", icon: "🧓", title: "ASPA (minimum vieillesse)", desc: "Complément pour petites retraites.", montant: "jusqu'à 1 044€/mois", annuel: [2000, 12516] });
  if (isModeste)
    gains.push({ cat: "aide", icon: "🏥", title: "Complémentaire Santé Solidaire", desc: "Mutuelle gratuite ou à moins de 1€/jour.", montant: "30 à 100€/mois", annuel: [360, 1200] });
  if (isModeste)
    gains.push({ cat: "aide", icon: "🔥", title: "Chèque énergie", desc: "Aide au paiement des factures.", montant: "48 à 277€/an", annuel: [48, 277] });
  if (a.handicap === "oui")
    gains.push({ cat: "aide", icon: "♿", title: "AAH / PCH", desc: "Allocations liées au handicap.", montant: "jusqu'à 1 042€/mois", annuel: [3000, 12504] });
  if (a.age === "18-25" || a.statut === "etudiant")
    gains.push({ cat: "aide", icon: "🎓", title: "Aides jeunes / étudiants", desc: "Bourse, Visale, aide au permis.", montant: "variable", annuel: [500, 5000] });
  if (a.assurances !== "oui_tout") {
    gains.push({ cat: "assurance", icon: "🛡️", title: "Assurances non comparées", desc: "Hausse 5-8%/an.", montant: "150 à 400€/an", annuel: [150, 400] });
    gains.push({ cat: "assurance", icon: "💳", title: "Doublons carte bancaire", desc: "Votre CB inclut des assurances.", montant: "80 à 200€/an", annuel: [80, 200] });
  }
  if (["oui_5", "oui_15", "oui_15plus"].includes(a.credit))
    gains.push({ cat: "assurance", icon: "🏦", title: "Assurance emprunteur (loi Lemoine)", desc: "Changez à tout moment.", montant: "400 à 1 200€/an", annuel: [400, 1200] });
  if (a.abonnements !== "oui_precis")
    gains.push({ cat: "abonnement", icon: "📱", title: "Abonnements fantômes", desc: "1 Français sur 3 paie un abonnement oublié.", montant: "200 à 500€/an", annuel: [200, 500] });
  gains.push({ cat: "abonnement", icon: "⏰", title: "Alertes fin d'offre", desc: "Econia vous prévient avant que vos promos expirent.", montant: "100 à 400€/an", annuel: [100, 400] });
  if (a.logement !== "heberge")
    gains.push({ cat: "energie", icon: "⚡", title: "Optimisation énergie", desc: "Comparaison fournisseurs et option tarifaire.", montant: "100 à 300€/an", annuel: [100, 300] });
  if (["proprio_credit", "proprio_sans"].includes(a.logement) && a.logementAge === "oui")
    gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation cumulables.", montant: "1 000 à 10 000€", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste)
    gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });
  if (hasKids && youngKids)
    infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Jusqu'à 997€/mois. Simulation sur urssaf.fr." });
  if (a.sap === "oui_sans_cesu")
    infos.push({ icon: "📋", title: "CESU", desc: "Services sans CESU = pas de crédit d'impôt. cesu.urssaf.fr." });

  let gainMin = 0;
  let gainMax = 0;
  gains.forEach((g) => {
    gainMin += g.annuel[0];
    gainMax += g.annuel[1];
  });

  return {
    gains,
    infos,
    gainMin: Math.min(gainMin, 12000),
    gainMax: Math.min(gainMax, 20000),
  };
}
