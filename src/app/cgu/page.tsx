import Link from 'next/link';

export const metadata = {
  title: 'Conditions générales d\'utilisation — Econia',
  description: 'Conditions générales d\'utilisation du service Econia',
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-[#536179] hover:text-[#2563EB] mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-[#0F172A] mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Conditions générales d'utilisation
        </h1>
        <p className="text-sm text-[#7A8599] mb-12">Dernière mise à jour : mai 2026</p>

        <div className="space-y-8 text-[#536179] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 1 — Objet</h2>
            <p>Les présentes CGU régissent l'accès et l'utilisation du site econia.fr et de ses services, édités par Julien Guillard, entrepreneur individuel (SIRET 881 266 266 00025).</p>
            <p className="mt-3">En accédant au Site ou en utilisant ses services, vous acceptez les présentes CGU.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 2 — Description du service</h2>
            <p>Econia est un service en ligne qui aide les particuliers résidant en France à identifier les économies et aides auxquelles ils pourraient avoir droit. Le service comprend un scan gratuit et, à terme, un accès Premium payant régi par des Conditions Générales de Vente distinctes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 3 — Avertissement important — Nature du service</h2>
            <p>Econia fournit des informations et estimations à titre <strong>indicatif</strong>. Econia n'est pas courtier en assurance, conseiller fiscal, expert-comptable, avocat ni organisme social. Les montants sont des estimations basées sur les barèmes officiels et les informations que vous fournissez. Seuls les organismes compétents peuvent confirmer vos droits réels.</p>
            <p className="mt-3">Econia utilise des algorithmes et de l'intelligence artificielle. Les résultats ne sont pas infaillibles et ne constituent pas un avis professionnel. L'utilisateur reste seul décisionnaire de ses actions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 4 — Accès au service</h2>
            <p>4.1. Le scan gratuit est accessible sans création de compte.</p>
            <p>4.2. Les fonctionnalités Premium nécessitent un compte et un abonnement payant (voir CGV à venir).</p>
            <p>4.3. Vous êtes responsable de la confidentialité de vos identifiants. Toute utilisation de votre compte est réputée faite par vous.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 5 — Conditions d'utilisation</h2>
            <p>Le Site est destiné aux personnes physiques résidant en France, âgées de 16 ans ou plus. Les mineurs de moins de 16 ans doivent obtenir le consentement d'un parent ou tuteur.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 6 — Obligations de l'utilisateur</h2>
            <p>Vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Fournir des informations exactes et à jour</li>
              <li>Ne pas utiliser le Service à des fins illégales</li>
              <li>Ne pas tenter d'accéder aux données d'autres utilisateurs</li>
              <li>Ne pas reproduire, vendre ou exploiter commercialement le contenu</li>
              <li>Ne pas utiliser de robots ou systèmes automatisés</li>
              <li>Respecter la règle : un email = un profil = un abonnement</li>
            </ul>
            <p className="mt-3 text-sm italic">Cette dernière limitation vise à éviter les abus du dispositif promotionnel founders et garantir l'équité entre utilisateurs.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 7 — Propriété intellectuelle</h2>
            <p>L'ensemble du contenu du Site (textes, guides, scripts, algorithmes, graphismes, logo) est protégé par le droit d'auteur. Les contenus Premium sont destinés à un usage strictement personnel. Toute reproduction ou diffusion est interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 8 — Documents uploadés</h2>
            <p>8.1. Vous garantissez qu'il s'agit de vos propres documents.</p>
            <p>8.2. Ils sont traités uniquement pour analyser votre situation.</p>
            <p>8.3. Ils ne sont jamais partagés avec des tiers.</p>
            <p>8.4. Un consentement explicite vous est demandé avant chaque upload.</p>
            <p>8.5. Vous pouvez les supprimer à tout moment depuis votre espace « Mes Documents ».</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 9 — Disponibilité du service</h2>
            <p>Econia s'efforce de maintenir le Site accessible en permanence mais ne garantit pas une disponibilité ininterrompue. Le Site peut être temporairement indisponible pour maintenance, mise à jour ou raisons techniques. Econia n'est pas responsable des dommages résultant d'une interruption temporaire du service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 10 — Suspension et suppression de compte</h2>
            <p>En cas de violation des présentes CGU, d'utilisation frauduleuse ou de comportement abusif, Econia se réserve le droit de suspendre ou supprimer un compte après notification préalable à l'utilisateur par email, sauf urgence (fraude avérée). L'utilisateur disposera d'un délai de 30 jours pour récupérer ses données avant la suppression définitive.</p>
            <p className="mt-3">L'utilisateur peut également supprimer son compte à tout moment depuis son espace personnel.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 11 — Responsabilité</h2>
            <p>Conformément aux dispositions du Code de la consommation, Econia est responsable de la bonne exécution du Service. Toutefois, sa responsabilité ne saurait être engagée pour les dommages résultant :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>D'informations inexactes fournies par l'utilisateur</li>
              <li>De l'évolution des barèmes ou réglementations</li>
              <li>De décisions prises par des organismes tiers (CAF, assureurs, fournisseurs d'énergie...)</li>
              <li>D'événements de force majeure au sens de l'article 1218 du Code civil</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 12 — Cession du contrat</h2>
            <p>Econia peut céder le présent contrat à un tiers, notamment en cas de transformation juridique de l'activité (création d'une société). L'utilisateur en sera informé par email et pourra résilier sans frais s'il refuse.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 13 — Nullité partielle</h2>
            <p>Si l'une des stipulations des présentes CGU était déclarée nulle, les autres stipulations resteraient pleinement applicables.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 14 — Données personnelles</h2>
            <p>Le traitement des données personnelles est décrit dans la <Link href="/confidentialite" className="text-[#2563EB] hover:underline">Politique de Confidentialité</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 15 — Modification des CGU</h2>
            <p>Econia peut modifier les présentes CGU. Les utilisateurs inscrits seront informés par email. La poursuite de l'utilisation vaut acceptation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Article 16 — Droit applicable et litiges</h2>
            <p>Les présentes CGU sont soumises au droit français.</p>
            <p className="mt-3">En cas de litige :</p>
            <ol className="list-decimal list-inside space-y-1 mt-2 ml-2">
              <li>Contactez Econia à econia.app@gmail.com pour une résolution amiable</li>
              <li>Si non résolu, vous pouvez recourir gratuitement à un médiateur de la consommation</li>
              <li>Plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" className="text-[#2563EB] hover:underline">https://ec.europa.eu/consumers/odr</a></li>
              <li>Le consommateur peut saisir, à son choix, soit l'une des juridictions territorialement compétentes en vertu du Code de procédure civile, soit la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la survenance du fait dommageable</li>
            </ol>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#E2E8F0] flex flex-wrap gap-4 text-sm">
          <Link href="/mentions-legales" className="text-[#2563EB] hover:underline">Mentions légales</Link>
          <Link href="/confidentialite" className="text-[#2563EB] hover:underline">Politique de confidentialité</Link>
          <Link href="/" className="text-[#536179] hover:text-[#2563EB]">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
