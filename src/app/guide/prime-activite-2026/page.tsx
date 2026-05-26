import Link from "next/link";
import { T } from "@/lib/theme";
import GuideLayout, { H2, P, StepCard } from "@/components/seo/GuideLayout";

export default function GuidePrimeActivite() {
  return (
    <GuideLayout
      slug="prime-activite-2026"
      h1Main="Prime d'activité 2026"
      h1Accent="qui y a droit et combien ?"
      intro="La prime d'activité est versée chaque mois par la CAF aux travailleurs aux revenus modestes (salariés, indépendants, étudiants salariés). En 2026, son montant peut atteindre 600€/mois pour les foyers les plus modestes. Pourtant, près d'un tiers des bénéficiaires potentiels ne la réclament pas — souvent par méconnaissance."
      miniScanUrl="/aide/prime-activite"
      miniScanLabel="🎯 Calculer mon montant en 3 questions"
      miniScanSub="Estimation immédiate, anonyme, basée sur le barème CAF 2026."
      datePublished="2026-05-26"
      sources="CAF, Service-Public.fr (fiche F2882), Légifrance, barèmes 2026"
      totalTime="PT30M"
      howToSteps={[
        {
          name: "Vérifier ton éligibilité avec un simulateur",
          text: "Utilise le simulateur CAF officiel (caf.fr/aides-et-demarches/mes-services-en-ligne/estimer-vos-droits) ou notre mini-scan en 3 questions pour estimer ton montant.",
        },
        {
          name: "Créer ou se connecter à ton espace CAF",
          text: "Sur caf.fr, crée un compte avec ton numéro de sécurité sociale, ou connecte-toi via FranceConnect. Si tu n'es pas encore allocataire, tu peux demander un numéro CAF en ligne.",
        },
        {
          name: "Faire la demande en ligne",
          text: "Dans ton espace, rubrique Mes démarches → Demander une prestation → Prime d'activité. La demande prend 10-15 minutes. Aucun justificatif à envoyer initialement, sauf si demandé après.",
        },
        {
          name: "Déclarer tes revenus chaque trimestre",
          text: "La prime est révisée tous les 3 mois selon tes revenus déclarés. Tu reçois un mail/SMS de la CAF pour faire la déclaration en quelques minutes. C'est cette déclaration qui maintient le versement.",
        },
      ]}
    >
      <H2>Qu&apos;est-ce que la prime d&apos;activité ?</H2>
      <P>
        La prime d&apos;activité est une prestation sociale versée par la CAF (ou la MSA pour les agriculteurs) destinée à
        compléter les revenus des actifs aux revenus modestes. Elle a remplacé en 2016 le RSA activité et la prime pour
        l&apos;emploi. C&apos;est une <strong>aide non imposable</strong>, sans frais, versée chaque mois.
      </P>

      <H2>Qui peut en bénéficier en 2026 ?</H2>
      <P>Tu peux toucher la prime d&apos;activité si tu remplis ces conditions cumulatives :</P>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Avoir au moins 18 ans</strong> (les étudiants salariés sont éligibles sous conditions de revenus).
        </li>
        <li>
          <strong>Résider en France</strong> de manière stable et effective (plus de 9 mois par an).
        </li>
        <li>
          <strong>Exercer une activité professionnelle</strong> — salarié, indépendant, fonctionnaire, étudiant salarié,
          apprenti, stagiaire rémunéré.
        </li>
        <li>
          <strong>Avoir des revenus mensuels inférieurs à un plafond</strong> qui varie selon ta composition familiale.
        </li>
      </ul>

      <H2>Combien peux-tu toucher ?</H2>
      <P>
        Le montant dépend de tes revenus d&apos;activité, de la composition de ton foyer, et d&apos;éventuelles autres prestations
        (APL, ASF…). Quelques repères 2026 indicatifs :
      </P>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          Célibataire au SMIC à temps plein : ≈ <strong>180 à 240€/mois</strong>
        </li>
        <li>
          Couple avec 1 enfant, un seul salaire au SMIC : ≈ <strong>250 à 320€/mois</strong>
        </li>
        <li>
          Parent isolé avec 1 enfant à mi-temps SMIC : ≈ <strong>400 à 550€/mois</strong>
        </li>
        <li>
          Étudiant salarié à mi-temps SMIC : ≈ <strong>0 à 220€/mois</strong> (seulement si revenus ≥ 78 % du SMIC sur 3 mois)
        </li>
      </ul>
      <P>
        Le montant exact dépend de ton profil. Notre{" "}
        <Link href="/aide/prime-activite" style={{ color: T.blue }}>
          mini-scan gratuit en 3 questions
        </Link>{" "}
        te donne une estimation immédiate.
      </P>

      <H2>Les 4 étapes pour la toucher</H2>
      <StepCard num={1} title="Vérifier ton éligibilité">
        Utilise un simulateur officiel (CAF.fr) ou notre mini-scan pour estimer ton montant en quelques minutes. Inutile de
        faire la demande si tu n&apos;es clairement pas éligible.
      </StepCard>
      <StepCard num={2} title="Créer ton espace CAF (ou s'y connecter)">
        Sur <strong>caf.fr</strong>, espace personnel via FranceConnect ou numéro CAF. Si tu n&apos;es pas allocataire, tu peux
        demander un numéro en ligne en quelques minutes.
      </StepCard>
      <StepCard num={3} title="Faire la demande en ligne">
        Mes démarches → Demander une prestation → Prime d&apos;activité. 10-15 minutes. Aucun justificatif à envoyer
        initialement, sauf si la CAF en demande après instruction.
      </StepCard>
      <StepCard num={4} title="Déclarer tes revenus tous les 3 mois" locked>
        Mécanique précise, calendrier officiel, erreurs courantes à éviter, optimisation en cas de revenus variables. Détaillé
        dans le guide Premium Econia.
      </StepCard>

      <H2>Erreurs fréquentes à éviter</H2>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Penser que c&apos;est «&nbsp;pour les chômeurs&nbsp;»</strong> : la prime d&apos;activité est faite pour ceux
          qui <em>travaillent</em>. Salariés, indépendants, étudiants salariés.
        </li>
        <li>
          <strong>Oublier la déclaration trimestrielle</strong> : pas de déclaration = suspension du versement. Mets une
          alerte récurrente dans ton calendrier.
        </li>
        <li>
          <strong>Ne pas inclure les revenus du conjoint</strong> : le calcul est foyer, pas individuel.
        </li>
        <li>
          <strong>Renoncer en cas de revenus variables</strong> : la prime est révisée tous les 3 mois — un mois à faible
          revenu peut déclencher un versement le trimestre suivant.
        </li>
      </ul>

      <H2>Cumul avec d&apos;autres aides</H2>
      <P>
        La prime d&apos;activité est <strong>cumulable</strong> avec : APL, allocations familiales, allocation rentrée scolaire,
        chèque énergie, complémentaire santé solidaire. Elle est <strong>non cumulable</strong> avec le RSA pour la même
        période — la CAF arbitre automatiquement vers le dispositif le plus favorable selon ta situation.
      </P>
    </GuideLayout>
  );
}
