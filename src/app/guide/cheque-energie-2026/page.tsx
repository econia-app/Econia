import Link from "next/link";
import { T } from "@/lib/theme";
import GuideLayout, { H2, P, StepCard } from "@/components/seo/GuideLayout";

export default function GuideChequeEnergie() {
  return (
    <GuideLayout
      slug="cheque-energie-2026"
      h1Main="Chèque énergie 2026"
      h1Accent="qui y a droit et combien ?"
      intro="Le chèque énergie aide les foyers modestes à payer leurs factures d'énergie (électricité, gaz, fioul, bois) ou des travaux de rénovation énergétique. En 2026, son montant va de 48 à 277€ selon les revenus et la composition du foyer. L'envoi est automatique pour les foyers identifiés par la DGFiP — mais des centaines de milliers d'éligibles passent au travers chaque année."
      miniScanUrl="/aide/cheque-energie"
      miniScanLabel="🎯 Vérifier mon éligibilité en 3 questions"
      miniScanSub="Sans inscription, anonyme, basé sur les barèmes DGFiP 2026."
      datePublished="2026-05-26"
      sources="DGFiP, Service-Public.fr (fiche F32094), chequeenergie.gouv.fr, barèmes 2026"
      totalTime="PT20M"
      howToSteps={[
        {
          name: "Vérifier ton éligibilité",
          text: "Sur chequeenergie.gouv.fr → 'Suis-je éligible ?' tu peux vérifier ton statut avec ton numéro fiscal et ton revenu fiscal de référence. Ou utilise notre mini-scan en 3 questions.",
        },
        {
          name: "Recevoir le chèque par courrier",
          text: "Si tu es éligible, l'envoi est automatique entre avril et mai. Tu reçois le chèque papier à ton adresse fiscale, sans démarche à faire.",
        },
        {
          name: "Utiliser le chèque",
          text: "Soit en l'envoyant à ton fournisseur (EDF, Engie, etc.) qui déduit le montant de ta prochaine facture, soit en ligne sur chequeenergie.gouv.fr en l'attribuant directement à ton contrat.",
        },
        {
          name: "Demander la pré-affectation automatique",
          text: "Sur chequeenergie.gouv.fr, tu peux activer la pré-affectation : les années suivantes, ton chèque est directement déduit de ta facture sans manipulation. Confort total.",
        },
      ]}
    >
      <H2>Qu&apos;est-ce que le chèque énergie ?</H2>
      <P>
        Créé en 2018 pour remplacer les tarifs sociaux EDF et GDF, le chèque énergie est une aide directe versée chaque
        printemps par l&apos;État. Il peut payer :
      </P>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Factures d&apos;énergie</strong> : électricité, gaz naturel, fioul domestique, bois, GPL, granulés, chaleur
          urbaine.
        </li>
        <li>
          <strong>Charges de chauffage</strong> dans les logements collectifs (HLM, copropriétés avec chauffage collectif).
        </li>
        <li>
          <strong>Travaux de rénovation énergétique</strong> éligibles à MaPrimeRénov&apos; (isolation, fenêtres, chaudière à
          haute performance, etc.).
        </li>
      </ul>

      <H2>Qui peut le recevoir en 2026 ?</H2>
      <P>L&apos;éligibilité repose sur deux critères combinés :</P>
      <ol style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "22px" }}>
        <li>
          <strong>Revenu fiscal de référence (RFR)</strong> du foyer divisé par les <strong>unités de consommation (UC)</strong>{" "}
          : 1 UC pour le 1er adulte, 0,5 pour le 2nd, 0,3 par enfant ou autre personne. Le seuil 2026 est{" "}
          <strong>≤ 11 000€ par UC</strong> environ.
        </li>
        <li>
          <strong>Avoir un logement déclaré aux impôts</strong> (taxe d&apos;habitation pour résidences secondaires, ou
          attestation d&apos;hébergement).
        </li>
      </ol>
      <P>
        L&apos;avantage : <strong>aucune démarche n&apos;est nécessaire</strong> pour le recevoir. La DGFiP croise
        automatiquement tes revenus avec ta déclaration d&apos;impôts. Tu reçois le chèque par courrier au printemps si tu es
        éligible.
      </P>

      <H2>Combien tu peux toucher ?</H2>
      <P>Le montant 2026 va de <strong>48€ à 277€/an</strong>. Quelques repères :</P>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          Personne seule, RFR/UC très bas : <strong>≈ 194 à 277€</strong>
        </li>
        <li>
          Couple sans enfant : <strong>≈ 126 à 240€</strong>
        </li>
        <li>
          Couple avec 2 enfants : <strong>≈ 76 à 202€</strong>
        </li>
        <li>
          Tranche supérieure (proche du plafond) : <strong>48€ à 76€</strong>
        </li>
      </ul>
      <P>
        Notre{" "}
        <Link href="/aide/cheque-energie" style={{ color: T.blue }}>
          mini-scan gratuit
        </Link>{" "}
        te donne ton montant exact en 3 questions.
      </P>

      <H2>Les 4 étapes pour en bénéficier</H2>
      <StepCard num={1} title="Vérifier ton éligibilité">
        Sur chequeenergie.gouv.fr → &quot;Suis-je éligible ?&quot; avec ton numéro fiscal (sur ta dernière déclaration). Ou
        utilise notre mini-scan pour estimation rapide.
      </StepCard>
      <StepCard num={2} title="Recevoir le chèque (automatique)">
        Si tu es éligible, le chèque arrive par courrier entre <strong>avril et mai</strong>. Tu n&apos;as rien à demander.
      </StepCard>
      <StepCard num={3} title="L'utiliser auprès de ton fournisseur">
        Envoyer le chèque papier à ton fournisseur d&apos;énergie (adresse au dos du chèque), ou l&apos;affecter en ligne sur
        chequeenergie.gouv.fr à ton contrat (plus rapide).
      </StepCard>
      <StepCard num={4} title="Activer la pré-affectation pour les années suivantes" locked>
        Configurer la pré-affectation auto, suivi des chèques perdus/volés, articulation avec MaPrimeRénov&apos;, recours en
        cas de non-réception. Détaillé dans le guide Premium Econia.
      </StepCard>

      <H2>Que faire si je n&apos;ai pas reçu mon chèque ?</H2>
      <P>
        Si tu penses être éligible mais que tu n&apos;as rien reçu avant fin juin, plusieurs raisons possibles :
        déménagement non signalé aux impôts, déclaration de revenus tardive, foyer qui a basculé d&apos;une catégorie à
        l&apos;autre. La marche à suivre : appeler le numéro vert <strong>0 805 204 805</strong> (gratuit) ou se rendre sur
        chequeenergie.gouv.fr → &quot;Réclamation chèque énergie&quot;.
      </P>

      <H2>Cumul avec d&apos;autres aides</H2>
      <P>
        Le chèque énergie est <strong>cumulable</strong> avec : MaPrimeRénov&apos;, Eco-PTZ, aides locales (région,
        département, ANAH), tarifs sociaux énergie (s&apos;ils existent encore). Il est <strong>non cumulable</strong> avec
        certaines aides ponctuelles ciblées comme l&apos;ancien chèque fioul exceptionnel.
      </P>
    </GuideLayout>
  );
}
