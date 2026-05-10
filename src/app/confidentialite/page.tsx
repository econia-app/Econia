import Link from 'next/link';

export const metadata = {
  title: 'Politique de confidentialité — Econia',
  description: 'Politique de confidentialité et protection des données personnelles d\'Econia',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-[#536179] hover:text-[#2563EB] mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-[#0F172A] mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Politique de confidentialité
        </h1>
        <p className="text-sm text-[#7A8599] mb-12">Dernière mise à jour : mai 2026</p>

        <div className="space-y-8 text-[#536179] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>1. Responsable du traitement</h2>
            <ul className="list-none space-y-1">
              <li><strong>Julien Guillard</strong> — Entrepreneur individuel</li>
              <li>89 rue Marie Noël, 89100 Soucy, France</li>
              <li>Contact RGPD : econia.app@gmail.com</li>
            </ul>
            <p className="mt-3">La désignation d'un Délégué à la Protection des Données (DPO) n'est pas obligatoire au regard de la taille et de la nature de l'activité. Le responsable du traitement est votre interlocuteur pour toute question relative à vos données personnelles.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>2. Données collectées</h2>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">2.1. Données du scan (sans compte)</h3>
            <p>Réponses au questionnaire (revenus, composition du foyer, logement, assurances, abonnements). Traitées pour générer vos résultats.</p>
            <p className="text-sm italic mt-1">Base légale : consentement (article 6.1.a du RGPD).</p>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">2.2. Données de compte (avec inscription)</h3>
            <p>Adresse email, mot de passe (hashé via bcrypt, jamais stocké en clair), données du scan, résultats, progression, préférences.</p>
            <p className="text-sm italic mt-1">Base légale : exécution du contrat (article 6.1.b du RGPD).</p>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">2.3. Données de paiement (futur abonnement Premium)</h3>
            <p>Le paiement sera géré par Stripe Inc. (certifié PCI-DSS niveau 1). Econia ne collecte, ne stocke et n'a jamais accès à vos coordonnées bancaires.</p>
            <p className="text-sm italic mt-1">Base légale : exécution du contrat (article 6.1.b du RGPD).</p>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">2.4. Documents uploadés (futur Premium)</h3>
            <p>Contrats, factures, avis d'imposition uploadés volontairement. Stockés en Union Européenne. Utilisés uniquement pour analyser votre situation.</p>
            <p className="text-sm italic mt-1">Base légale : consentement explicite au moment de l'upload.</p>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">2.5. Données techniques</h3>
            <p>Adresse IP, type de navigateur, système d'exploitation, pages consultées, date/heure. Collectées via les cookies de session techniques nécessaires au fonctionnement du Site.</p>
            <p className="text-sm italic mt-1">Base légale : intérêt légitime (article 6.1.f du RGPD).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Générer vos résultats personnalisés</li>
              <li>Créer et gérer votre compte</li>
              <li>Fournir les guides et recommandations personnalisées</li>
              <li>Gérer votre abonnement et le paiement (futur)</li>
              <li>Analyser vos documents (si uploadés volontairement)</li>
              <li>Envoyer des alertes (fin d'offre, nouvelles aides) si vous y avez consenti</li>
              <li>Améliorer le fonctionnement du Site</li>
              <li>Répondre à vos demandes</li>
            </ul>
            <p className="mt-3">Le traitement comprend du profilage (analyse de votre situation pour générer des recommandations personnalisées). Aucune décision entièrement automatisée produisant des effets juridiques ou vous affectant de manière significative n'est prise. Vous restez seul décisionnaire de vos actions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>4. Destinataires des données</h2>
            <p><strong>Vos données ne sont JAMAIS vendues, louées ou échangées à des fins commerciales.</strong></p>
            <p className="mt-3">Sous-traitants techniques :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li><strong>Supabase Inc.</strong> : hébergement de la base de données (UE, Irlande)</li>
              <li><strong>Vercel Inc.</strong> : hébergement du Site (USA)</li>
              <li><strong>Stripe Inc.</strong> : traitement des paiements (futur, certifié PCI-DSS)</li>
              <li><strong>Anthropic</strong> : traitement IA pour l'analyse de documents (futur)</li>
            </ul>
            <p className="mt-3">Ces sous-traitants traitent les données uniquement sur instruction d'Econia.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>5. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Données du scan sans compte : 12 mois après la dernière visite</li>
              <li>Données de compte actif : tant que le compte est actif</li>
              <li>Données après suppression du compte : supprimées sous 30 jours</li>
              <li>Documents uploadés : supprimés à votre demande ou à la suppression du compte</li>
              <li>Données de paiement : conservées par Stripe selon les obligations légales (6 ans)</li>
              <li>Données techniques (logs) : 12 mois maximum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>6. Vos droits</h2>
            <p>Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Droit d'accès (article 15)</li>
              <li>Droit de rectification (article 16)</li>
              <li>Droit à l'effacement (article 17)</li>
              <li>Droit à la limitation du traitement (article 18)</li>
              <li>Droit à la portabilité (article 20)</li>
              <li>Droit d'opposition (article 21)</li>
              <li>Droit de retirer votre consentement à tout moment (article 7.3)</li>
              <li>Droit de ne pas faire l'objet d'une décision automatisée (article 22)</li>
            </ul>
            <p className="mt-4">Pour exercer vos droits, vous pouvez :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Supprimer votre compte directement depuis votre espace client (bouton "Supprimer mon compte")</li>
              <li>Envoyer un email à econia.app@gmail.com avec l'objet "Exercice de droits RGPD"</li>
            </ul>
            <p className="mt-3">Réponse sous 30 jours maximum.</p>
            <p className="mt-4">En cas de violation de données, vous serez informé conformément aux articles 33 et 34 du RGPD.</p>
            <p className="mt-4"><strong>Réclamation auprès de la CNIL :</strong></p>
            <ul className="list-none space-y-1 mt-1">
              <li>Commission Nationale de l'Informatique et des Libertés</li>
              <li>3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
              <li><a href="https://www.cnil.fr" className="text-[#2563EB] hover:underline">www.cnil.fr</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>7. Cookies</h2>
            <h3 className="font-semibold text-[#0F172A] mt-2 mb-2">7.1. Cookies strictement nécessaires (exemptés de consentement)</h3>
            <p>Econia utilise des cookies de session pour l'authentification (Supabase Auth) et la sécurité. Ces cookies sont indispensables au fonctionnement du Site et exemptés de consentement conformément à l'article 82 de la loi Informatique et Libertés.</p>

            <h3 className="font-semibold text-[#0F172A] mt-4 mb-2">7.2. Cookies analytiques et publicitaires</h3>
            <p>Econia n'utilise actuellement aucun cookie de suivi, de publicité ou d'analyse comportementale. Si cela venait à changer, un bandeau de consentement conforme aux recommandations de la CNIL serait mis en place préalablement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>8. Sécurité</h2>
            <p>Mesures mises en œuvre : chiffrement des communications (HTTPS/TLS), hashage des mots de passe (bcrypt), hébergement en Union Européenne, accès restreint aux données, authentification sécurisée.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>9. Transferts hors UE</h2>
            <p>Certains sous-traitants (Vercel, Stripe, Anthropic) sont basés aux États-Unis. Les transferts sont encadrés par les clauses contractuelles types approuvées par la Commission européenne et/ou le cadre de protection des données UE-États-Unis (EU-US Data Privacy Framework). La validité de ces mécanismes peut évoluer en fonction de la jurisprudence européenne. Econia s'engage à adapter ses pratiques en conséquence.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>10. Mineurs</h2>
            <p>Le Site n'est pas destiné aux personnes de moins de 16 ans. Si vous avez moins de 16 ans, vous devez obtenir le consentement d'un parent ou tuteur légal avant de créer un compte ou fournir des données personnelles.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>11. Modifications</h2>
            <p>Cette politique peut être mise à jour. La date de dernière mise à jour est indiquée en haut du document. Les utilisateurs inscrits seront informés par email en cas de modification substantielle.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#E2E8F0] flex flex-wrap gap-4 text-sm">
          <Link href="/mentions-legales" className="text-[#2563EB] hover:underline">Mentions légales</Link>
          <Link href="/cgu" className="text-[#2563EB] hover:underline">Conditions d'utilisation</Link>
          <Link href="/" className="text-[#536179] hover:text-[#2563EB]">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
