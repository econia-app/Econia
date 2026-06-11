// ============================================================
// ECONIA — GUIDES DÉFINITIFS (mai 2026)
// 8 guides Premium vérifiés et à jour
// ============================================================

export type GuideStep = {
  title: string;
  content: string;
};

export type Guide = {
  title: string;
  time: string;
  difficulty: string;
  steps: GuideStep[];
};

export const guides: Record<string, Guide> = {

  // ─────────────────────────────────────────────────────────
  // 1. ASSURANCES — Comparer et renégocier
  // ─────────────────────────────────────────────────────────
  assurance_compare: {
    title: "Comparer et renégocier vos assurances",
    time: "45 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Listez tous vos contrats",
        content: "Pour chaque assurance (auto, habitation, mutuelle, scolaire, animaux, téléphone) : notez l'assureur, le numéro de contrat, le montant annuel exact, la date d'échéance, la franchise et les garanties principales. Photographiez chaque contrat dans 'Mes Documents' — Econia extrait automatiquement les données."
      },
      {
        title: "Vérifiez l'adéquation aux besoins réels",
        content: "Auto : véhicule de plus de 8 ans valant moins de 5 000€ ? Le tous risques est inutile, passez en tiers+ (économie 200-300€/an). Franchise à 150€ ? La passer à 300€ réduit la prime de 10-15%. Habitation : capital mobilier surévalué ? Ajustez. Mutuelle : optique élevé sans porter de lunettes ? Réduisez le niveau. Téléphone : déjà couvert par votre CB Gold/Premier."
      },
      {
        title: "Comparez en ligne (5 sites recommandés)",
        content: "Auto et habitation : lelynx.fr, lesfurets.com, lecomparateurassurance.com. Mutuelle : lelynx.fr/mutuelle, malakoffhumanis.com/comparateur. Documents nécessaires : pour l'auto (immatriculation, date du permis, bonus/malus, km/an, sinistres 3 ans), pour l'habitation (surface, pièces, étage, capital mobilier)."
      },
      {
        title: "Script de négociation avec votre assureur",
        content: "Appelez votre assureur (demandez le service fidélisation, PAS le standard). Script : 'Bonjour, je suis client depuis [X années]. J'ai reçu un devis chez [concurrent] à [montant]€/an pour les mêmes garanties que vous me facturez [votre prix]€. Pouvez-vous vous aligner ? Je regroupe auto + habitation chez vous si vous faites un geste commercial.' Restez ferme. Si refus, demandez à parler au manager."
      },
      {
        title: "Loi Hamon — Changement libre après 1 an",
        content: "Auto et habitation : depuis la loi Hamon (2014), vous pouvez résilier à tout moment après 1 an d'ancienneté, sans frais ni motif. Le nouvel assureur s'occupe de la résiliation auprès de l'ancien. Mutuelle : résiliation infra-annuelle (à tout moment après 1 an) depuis décembre 2020."
      },
      {
        title: "Regroupement multi-contrats",
        content: "Regrouper auto + habitation + mutuelle chez un même assureur génère 10 à 20% de remise globale. AXA, MAAF, MAIF, GMF, Matmut proposent tous ce type de remise. Demandez explicitement : 'Quelle remise multi-contrats pour 3 contrats ?'"
      },
      {
        title: "Programmez l'alerte annuelle",
        content: "Les assurances augmentent de 5 à 8% chaque année automatiquement, parfois plus. Econia programme une alerte 2 mois avant chaque échéance pour refaire la comparaison. La concurrence est rude : 30 minutes de comparaison = 200 à 500€/an économisés."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 2. DOUBLONS CARTE BANCAIRE
  // ─────────────────────────────────────────────────────────
  doublons_cb: {
    title: "Détecter les doublons avec votre carte bancaire",
    time: "20 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Récupérez vos conditions CB",
        content: "Ouvrez votre application bancaire → 'Ma carte' ou 'Conditions générales'. Téléchargez le document. Ou photographiez-le pour le stocker dans 'Mes Documents'. Vous y trouverez la liste exacte des assurances incluses."
      },
      {
        title: "Identifiez les assurances incluses (carte Premier/Gold)",
        content: "Une carte Visa Premier ou Mastercard Gold inclut : annulation/interruption voyage, bagages perdus, location de véhicule (CDW), responsabilité civile à l'étranger, garantie achats (téléphone, électroménager < 6 mois), assistance médicale à l'étranger, assurance neige et montagne (parfois)."
      },
      {
        title: "Carte Platinum / Infinite",
        content: "Tout ce qui est inclus dans Gold/Premier PLUS : plafonds plus élevés, conciergerie 24/7, assurance ski illimitée, location automobile avec franchise réduite ou nulle, lounge access aéroports."
      },
      {
        title: "Liste des doublons fréquents à supprimer",
        content: "Assurance téléphone à 9-12€/mois (économie 110-150€/an) : la garantie achats CB couvre jusqu'à 800€ pendant 6 mois. Assurance voyage à 25-40€/voyage : déjà incluse si vous payez le billet avec votre CB Gold. Extension de garantie magasin (3 ans) : votre CB rallonge déjà la garantie constructeur. Location de voiture avec franchise rachetée à 15€/jour : incluse dans la plupart des CB Gold."
      },
      {
        title: "Conditions précises à vérifier",
        content: "L'assurance téléphone CB exige : achat avec la carte, durée maximum (souvent 90 jours), franchise (souvent 50-100€), plafond (800€ à 3 000€ selon la CB). L'assurance voyage CB nécessite que le billet d'avion ou de train soit payé avec la carte. Certaines garanties ne couvrent QUE le titulaire de la carte, pas la famille."
      },
      {
        title: "Comment résilier les doublons",
        content: "Pour les assurances téléphone Free Mobile/Orange : appel au service client + résiliation par lettre recommandée. Pour les extensions de garantie : courrier recommandé à l'enseigne (Darty, Boulanger, FNAC). Conservez les attestations de résiliation."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 3. ASSURANCE EMPRUNTEUR (Loi Lemoine)
  // ─────────────────────────────────────────────────────────
  assurance_emprunteur: {
    title: "Changer d'assurance emprunteur (loi Lemoine)",
    time: "1h",
    difficulty: "Moyen",
    steps: [
      {
        title: "Rassemblez vos informations",
        content: "Montant emprunté, capital restant dû (sur votre dernier relevé), durée restante du prêt, taux du prêt, taux d'assurance actuel (en %), montant mensuel d'assurance (ligne distincte sur le tableau d'amortissement), fiche standardisée d'information (FSI) avec les garanties exigées par votre banque."
      },
      {
        title: "Calculez ce que vous payez réellement",
        content: "Exemple concret : prêt de 200 000€, taux d'assurance banque 0,34% = 680€/an soit 56,67€/mois. Sur 20 ans = 13 600€ d'assurance totale. Tarif moyen banque : 0,30 à 0,40%. Tarif délégation externe : 0,08 à 0,20%. Économie potentielle : 50 à 70%."
      },
      {
        title: "Comparez en ligne (3 sites recommandés)",
        content: "magnolia.fr (le plus utilisé), reassurez-moi.fr (excellents tarifs), empruntis.com (banque/courtage). Profil < 45 ans non-fumeur : taux moyen 0,08-0,12%. Profil 45-55 ans : 0,15-0,25%. Profil > 55 ans : 0,30-0,45%. Demandez 3 devis pour comparer."
      },
      {
        title: "Vérifiez l'équivalence des garanties",
        content: "Le nouveau contrat doit couvrir au minimum les garanties exigées par votre banque (sur la FSI) : décès, PTIA (Perte Totale et Irréversible d'Autonomie), ITT (Incapacité Temporaire Totale), IPP/IPT (Invalidité Permanente Partielle/Totale). Les comparateurs vérifient automatiquement l'équivalence."
      },
      {
        title: "Souscrivez le nouveau contrat",
        content: "Signature 100% en ligne. Loi Lemoine (28 février 2022) : pas de questionnaire médical si prêt < 200 000€ remboursé avant 60 ans. Au-delà : questionnaire médical simplifié. Conservez l'attestation d'adhésion + l'attestation d'équivalence des garanties."
      },
      {
        title: "Envoyez la demande de substitution à votre banque",
        content: "Envoi par lettre recommandée avec accusé de réception OU via messagerie sécurisée de votre espace client. Documents à joindre : nouveau contrat signé, attestation d'équivalence des garanties, lettre type mentionnant la loi du 28 février 2022 (loi Lemoine). La banque a 10 jours ouvrés pour répondre."
      },
      {
        title: "Suivi et confirmation",
        content: "Acceptation : la banque met à jour votre tableau d'amortissement, l'économie s'applique dès la prochaine échéance. Refus : la banque doit motiver par écrit (motif valable : non-équivalence des garanties). Corrigez et renvoyez. En cas de refus abusif : médiation bancaire gratuite."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 4. ABONNEMENTS FANTÔMES
  // ─────────────────────────────────────────────────────────
  abonnements: {
    title: "Détecter et résilier vos abonnements fantômes",
    time: "30 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Identifiez TOUS vos prélèvements récurrents",
        content: "Banque en ligne : exportez les 3 derniers mois en CSV ou consultez visuellement. Listez TOUS les prélèvements récurrents : streaming, téléphone, internet, salles de sport, applications mobiles, cloud, presse, livraisons, dons. iPhone : Réglages → [votre nom] → Abonnements (en haut). Android : Play Store → photo de profil → Paiements et abonnements → Abonnements."
      },
      {
        title: "Classez en 3 colonnes",
        content: "GARDER : services utilisés régulièrement, prix correct. RÉDUIRE : services utilisés mais trop chers (Netflix Premium 17,99€ → Standard 13,49€ = économie 54€/an, forfait mobile 19,99€ → 5,99€ chez Free 5Go = économie 168€/an, abonnement presse papier vs numérique). RÉSILIER : services non utilisés depuis 30 jours minimum."
      },
      {
        title: "Comment résilier (par service)",
        content: "Netflix : netflix.com/cancelplan (3 clics). Disney+ : disneyplus.com → compte → Annuler. Spotify : support.spotify.com/fr/cancel-premium. Amazon Prime : amazon.fr → Compte → Adhésion Prime → Mettre fin. Salle de sport : courrier recommandé selon les conditions. ATTENTION : supprimer une application NE résilie PAS l'abonnement via Apple/Google Play."
      },
      {
        title: "Abonnements oubliés les plus courants",
        content: "iCloud 0,99€ ou 2,99€/mois (40% des iPhones), Google One 1,99€ ou 9,99€/mois, abonnement Adobe Creative Cloud après période d'essai, applications de méditation (Calm, Petit Bambou) à 70€/an, abonnements antivirus renouvelés automatiquement (Norton, McAfee : 60-100€/an), Dropbox/OneDrive."
      },
      {
        title: "Loi résiliation en 3 clics (effective depuis juin 2023)",
        content: "Pour TOUT abonnement souscrit en ligne, le professionnel doit proposer la résiliation en 3 clics maximum depuis son espace client. Si ce n'est pas le cas, vous pouvez signaler à la DGCCRF (signal.conso.gouv.fr). C'est une infraction passible d'une amende de 15 000€ pour le pro."
      },
      {
        title: "Programmez l'alerte mensuelle Econia",
        content: "Chaque mois, Econia vérifie vos prélèvements et vous alerte si un nouvel abonnement apparaît (parfois via essai gratuit oublié). Chaque abonnement conservé est suivi avec sa date de fin d'offre promotionnelle. Économie moyenne validée par les utilisateurs : 250-400€/an."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 5. ALERTES FIN D'OFFRE
  // ─────────────────────────────────────────────────────────
  alertes_offre: {
    title: "Anticiper la fin des offres promotionnelles",
    time: "15 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Recensez vos offres promotionnelles actuelles",
        content: "Pour chaque contrat avec une promo : nom du fournisseur, prix actuel (promo), prix après promo (souvent +50 à +100%), date de fin de promo. Exemples : Free Mobile 9,99€/mois pendant 1 an puis 19,99€, Bouygues box 14,99€/mois pendant 1 an puis 29,99€, Netflix Standard 8,99€ en offre étudiant pendant 6 mois."
      },
      {
        title: "Econia enregistre vos dates de fin d'offre",
        content: "Dans votre profil 'Mes Contrats', chaque offre promotionnelle est enregistrée. Econia programme automatiquement une alerte 1 mois AVANT que le prix augmente. Vous recevrez par email/notification : 'Votre offre Free Mobile à 9,99€/mois se termine dans 30 jours. Voici vos 3 options : renégocier, changer, ou garder.'"
      },
      {
        title: "Script de négociation — Téléphone mobile",
        content: "Free Mobile (3244) : 'Bonjour, je suis client depuis [X mois], mon offre à 9,99€ se termine le [date]. J'ai un devis chez Bouygues à 11,99€/mois pour 200 Go. Quelle offre fidélisation pouvez-vous me proposer ?' Orange/Sosh : appelez le 3900 puis demandez le service résiliation (ils ont les meilleures offres cachées). SFR/Red : 1023, service rétention."
      },
      {
        title: "Script de négociation — Box internet",
        content: "Appelez votre opérateur : 'Mon offre box à [X]€ se termine, le prix passe à [Y]€. J'ai vu chez Free une offre à 29,99€/mois pour la fibre 1 Gbps. Pouvez-vous vous aligner ou je résilie.' En cas de refus : changer est gratuit, le nouvel opérateur gère le portage du numéro et de la ligne sans coupure (loi Châtel)."
      },
      {
        title: "Script de négociation — Mutuelle",
        content: "Si votre mutuelle a augmenté de plus de 5% à l'année : 'Bonjour, j'ai reçu votre nouveau tarif en hausse de [X]%. J'ai un devis chez [concurrent] à [Y]€/mois pour les mêmes garanties. Pouvez-vous m'aligner sur ce tarif ou j'utiliserai la résiliation infra-annuelle.' Depuis 2020, vous pouvez résilier votre mutuelle à tout moment après 1 an."
      },
      {
        title: "Calendrier annuel des renégociations",
        content: "Janvier : assurances habitation (échéance souvent en janvier). Avril : box internet (la plupart des promos durent 1 an). Septembre : mutuelles (renouvellement annuel courant). Décembre : assurance auto. Econia génère votre calendrier personnalisé en fonction de vos contrats."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 6. ÉNERGIE (Électricité / Gaz)
  // ─────────────────────────────────────────────────────────
  energie: {
    title: "Optimiser vos factures d'énergie",
    time: "30 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Identifiez votre situation actuelle",
        content: "Sur votre dernière facture : fournisseur actuel, type d'offre (tarif réglementé EDF/Engie ou offre de marché), option tarifaire (Base ou Heures Pleines/Heures Creuses), puissance souscrite du compteur (6, 9 ou 12 kVA), consommation annuelle en kWh (Conso totale sur 12 mois). Photographiez la facture, Econia extrait les données."
      },
      {
        title: "Vérifiez l'option tarifaire",
        content: "Option Base : même prix kWh jour et nuit. Option Heures Pleines/Heures Creuses : kWh moins cher la nuit (22h-6h ou similaire). Si vous avez HP/HC mais que vous n'utilisez pas d'appareils la nuit (lave-linge, ballon d'eau chaude, voiture électrique) → passez en Base. Économie 50 à 100€/an. Changement gratuit auprès de votre fournisseur."
      },
      {
        title: "Vérifiez la puissance du compteur",
        content: "6 kVA : appartement sans chauffage électrique. 9 kVA : maison avec chauffage électrique modéré. 12 kVA : maison avec chauffage électrique + voiture électrique. Si vous n'avez JAMAIS disjoncté → votre puissance est probablement surdimensionnée. Passage de 9 kVA à 6 kVA = environ 30€/an d'économie sur l'abonnement. Demande au fournisseur, intervention Enedis sous 10 jours."
      },
      {
        title: "Comparez les fournisseurs (site officiel)",
        content: "Utilisez UNIQUEMENT le comparateur officiel du Médiateur de l'énergie : energie-info.fr/comparateur/. Les comparateurs commerciaux (Selectra, Choisir.com) peuvent biaiser les résultats avec leurs partenariats. Critères de comparaison : prix du kWh, prix de l'abonnement, durée d'engagement (privilégier 'sans engagement'), origine de l'électricité (verte ou non)."
      },
      {
        title: "Changez de fournisseur (gratuit et sans coupure)",
        content: "Le changement est totalement gratuit, sans coupure d'électricité, sans changement de compteur. Le nouveau fournisseur s'occupe de tout. Délai : environ 21 jours. Pas d'engagement ni de pénalité si vous voulez encore changer. Économie moyenne : 100 à 300€/an par rapport au tarif réglementé."
      },
      {
        title: "Option Tempo EDF (pour gros consommateurs)",
        content: "Si votre consommation > 8 000 kWh/an (maison chauffage électrique) : l'option Tempo EDF peut faire économiser 200-400€/an. 22 jours rouges/an (très chers), 43 jours blancs (chers), 300 jours bleus (très bas). Idéal si vous pouvez décaler vos usages (lave-linge, voiture électrique). Application Tempo gratuite pour anticiper les jours rouges."
      },
      {
        title: "Radar Econia",
        content: "Econia surveille en continu : les hausses de votre fournisseur, les nouvelles offres concurrentes, les changements de tarif réglementé (2 fois par an). Vous êtes alerté dès qu'une économie de plus de 50€/an est détectée par rapport à votre offre actuelle."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 7. AIDES SOCIALES
  // ─────────────────────────────────────────────────────────
  aides_sociales: {
    title: "Obtenir toutes vos aides sociales",
    time: "30 min par aide",
    difficulty: "Facile",
    steps: [
      {
        title: "Simulez vos droits sur les sites officiels",
        content: "RSA, prime d'activité, APL : caf.fr → 'Mes services' → 'Faire une simulation'. CSS (mutuelle gratuite) : ameli.fr → 'Mes démarches'. ASPA (minimum vieillesse) : lassuranceretraite.fr. AAH (handicap) : MDPH de votre département. Ces simulateurs sont officiels et donnent une estimation fiable."
      },
      {
        title: "Documents à préparer",
        content: "Pièce d'identité valide (CNI, passeport, titre de séjour), justificatif de domicile de moins de 3 mois, RIB à votre nom, avis d'imposition 2025 (revenus 2024), justificatifs de ressources des 3 derniers mois (bulletins de paie ou attestation France Travail), bail si locataire, attestations CAF en cours."
      },
      {
        title: "Montants 2026 (vérifiés)",
        content: "RSA personne seule : 651,69€/mois max (avril 2026). Prime d'activité : 100 à 350€/mois selon revenus + 50€ exceptionnels en 2026. APL : 50 à 400€/mois selon revenus/loyer/zone. AAH : 1 041,59€/mois max. ASPA personne seule : 1 043,59€/mois max. ASF (soutien familial) : 195,85€/mois par enfant. Chèque énergie : 48 à 277€/an (automatique)."
      },
      {
        title: "Pièges à éviter",
        content: "Prime d'activité : N'EST PAS automatique, il faut la demander. Plus de 50% des éligibles ne la demandent pas. RSA : depuis 2025, obligation de 15h d'activité/semaine. Déclaration trimestrielle OBLIGATOIRE (sinon versement stoppé). Concubinage : les revenus du conjoint comptent même sans PACS. Micro-entreprise : déclarer le CA brut, la CAF applique l'abattement."
      },
      {
        title: "Comment faire la demande",
        content: "1. Connectez-vous à caf.fr (créez votre compte si premier contact). 2. 'Mes services' → 'Faire une demande de prestation'. 3. Sélectionnez l'aide visée. 4. Remplissez avec précision (utilisez le NET, pas le brut). 5. Joignez les documents en PDF/photo. 6. Validez. Réponse sous 1 à 2 mois. Versement le 5 du mois suivant la validation."
      },
      {
        title: "Cumul possible des aides",
        content: "Cumulables : RSA + APL + CSS + allocations familiales + ARS + chèque énergie + ASF. NON cumulables : RSA et prime d'activité (l'un OU l'autre selon vos revenus d'activité). AAH cumulable avec : MVA (+104,77€/mois si logement indépendant), APL, CSS. Exemple total : famille monoparentale 2 enfants peut cumuler 1 800 à 2 500€/mois d'aides."
      },
      {
        title: "Suivi et rappels",
        content: "Econia programme automatiquement les rappels de déclaration trimestrielle (RSA, prime activité). Notification 1 semaine avant chaque échéance. Suivi des dossiers en cours. Alerte si nouvelle aide débloquée correspondant à votre profil (le 'Radar Econia')."
      }
    ]
  },

  // ─────────────────────────────────────────────────────────
  // 8. LEASING SOCIAL (Véhicule électrique)
  // ─────────────────────────────────────────────────────────
  leasing_social: {
    title: "Leasing social — Voiture électrique à 100€/mois",
    time: "20 min",
    difficulty: "Facile",
    steps: [
      {
        title: "Vérifiez votre éligibilité (critères 2025/2026)",
        content: "RFR par part fiscale ≤ 16 300€ (à confirmer pour 2026, le décret est attendu en juin 2026). Distance domicile-travail supérieure à 15 km OU kilométrage professionnel supérieur à 8 000 km/an. Ouvert aux professions essentielles (infirmiers, aides à domicile, artisans). Résider en France."
      },
      {
        title: "Calculez votre RFR par part",
        content: "RFR (Revenu Fiscal de Référence) sur votre avis d'imposition page 1, en haut à droite. Nombre de parts : 1 célibataire, 2 marié/pacsé, +0,5 par enfant (1 part à partir du 3ème). Exemple : RFR 45 000€, marié + 2 enfants = 3 parts → 15 000€/part → éligible. Calculateur officiel : impots.gouv.fr."
      },
      {
        title: "Calculez votre gain potentiel",
        content: "Coût annuel diesel moyen (15 000 km/an) : carburant 2 100€ + entretien 800€ + assurance 600€ = 3 500€. Coût annuel leasing social VE : loyer 1 200€/an + électricité 450€ + entretien 300€ + assurance 550€ = 2 500€. Économie : 1 000 à 1 500€/an. Plus si vous payez plus cher actuellement (essence, plus de km)."
      },
      {
        title: "Grille des aides 2026 (annoncée)",
        content: "Aide modulée selon l'origine européenne du véhicule : 6 500€ (base avec éco-score validé), 7 000€ (moteur produit en Europe), 9 000€ (batterie assemblée en Europe), 9 500€ (moteur ET batterie européens). Loyer cible : moins de 200€/mois sans apport, 1er loyer à 0€."
      },
      {
        title: "Modèles pressentis (liste officielle à venir)",
        content: "Citadines (loyer estimé ~100€/mois) : Renault Twingo E-Tech, Citroën ë-C3, Fiat Grande Panda. Compactes (~150-200€/mois) : Renault 5 E-Tech, Renault 4 E-Tech, Peugeot e-208. Plus grandes (~200€/mois) : Renault Megane E-Tech. Les Renault 5 et Twingo sont les plus avantageuses (batterie européenne = aide maximale)."
      },
      {
        title: "Préparez votre dossier en avance",
        content: "Documents à rassembler : avis d'imposition (revenus 2024 ou 2025), justificatif de domicile de moins de 3 mois, pièce d'identité, permis de conduire, RIB, attestation employeur ou justificatif de distance domicile-travail OU justificatif de kilométrage professionnel (contrôle technique, attestation employeur). Stockés dans 'Mes Documents' Econia."
      },
      {
        title: "Alerte ouverture (juillet 2026)",
        content: "Le dispositif ouvre en juillet 2026 avec 50 000 véhicules pour les ménages + 50 000 pour les professionnels. ATTENTION : en 2024, les 50 000 dossiers ont été pris en 6 semaines. Econia vous alertera dès le jour J avec le lien direct, la liste officielle des modèles et leur loyer. Préparez tout AVANT pour réagir vite."
      },
      {
        title: "Le jour J — Comment souscrire",
        content: "Rendez-vous chez un concessionnaire participant (Renault, Citroën, Peugeot, Fiat, Hyundai) ou sur leur site. Le pro vérifie votre éligibilité en quelques minutes. Choisissez votre modèle. Signez le contrat de LLD (3 ou 4 ans). 1er loyer à 0€. Vous avez 14 jours de rétractation. Résiliation sans frais en cas de décès, invalidité, perte d'emploi."
      }
    ]
  }

};

// ─────────────────────────────────────────────────────────
// Mapping gains détectés → guide correspondant
// ─────────────────────────────────────────────────────────
/**
 * Mapping gain → URL du mini-scan dédié (estimation détaillée d'un levier).
 * Source de vérité unique, utilisée par l'écran résultat (ResultsView) ET le
 * tableau de bord (LeverCard). À étendre quand on crée un nouveau mini-scan.
 */
export const gainToMiniScan: Record<string, string> = {
  "Prime d'activité": "/aide/prime-activite",
  RSA: "/aide/rsa",
  APL: "/aide/apl",
  "Allocation rentrée scolaire": "/aide/ars",
  "Complémentaire Santé Solidaire": "/aide/complementaire-sante",
  "Chèque énergie": "/aide/cheque-energie",
  "ASPA (minimum vieillesse)": "/aide/aspa",
  "Assurance emprunteur (loi Lemoine)": "/aide/loi-lemoine",
  "Assurances non comparées": "/aide/assurances",
  "Doublons carte bancaire": "/aide/assurances",
};

export const gainToGuide: Record<string, string> = {
  "Assurances non comparées": "assurance_compare",
  "Doublons carte bancaire": "doublons_cb",
  "Assurance emprunteur (loi Lemoine)": "assurance_emprunteur",
  "Abonnements fantômes": "abonnements",
  "Alertes fin d'offre": "alertes_offre",
  "Optimisation énergie": "energie",
  "RSA": "aides_sociales",
  "Prime d'activité": "aides_sociales",
  "APL": "aides_sociales",
  "ASPA (minimum vieillesse)": "aides_sociales",
  "Complémentaire Santé Solidaire": "aides_sociales",
  "Chèque énergie": "aides_sociales",
  "AAH / PCH": "aides_sociales",
  "Aides jeunes / étudiants": "aides_sociales",
  "Allocation rentrée scolaire": "aides_sociales",
  "MaPrimeRénov' + CEE": "aides_sociales",
  "Leasing social": "leasing_social",
};
