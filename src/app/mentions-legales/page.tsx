import Link from 'next/link';

export const metadata = {
  title: 'Mentions légales — Econia',
  description: 'Mentions légales du site econia.fr',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-[#536179] hover:text-[#2563EB] mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-[#0F172A] mb-2 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Mentions légales
        </h1>
        <p className="text-sm text-[#7A8599] mb-12">Dernière mise à jour : mai 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-[#536179] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>1. Éditeur du site</h2>
            <p>Le site econia.fr (ci-après « le Site ») est édité par :</p>
            <ul className="list-none space-y-1 mt-3">
              <li><strong>Julien Guillard</strong></li>
              <li>Entrepreneur individuel</li>
              <li>Adresse : 89 rue Marie Noël, 89100 Soucy, France</li>
              <li>SIRET : 881 266 266 00025</li>
              <li>Numéro d'immatriculation INSEE (SIRENE)</li>
              <li>TVA non applicable, article 293 B du Code général des impôts</li>
              <li>Email : econia.app@gmail.com</li>
            </ul>
            <p className="mt-3"><strong>Directeur de la publication :</strong> Julien Guillard</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>2. Hébergement</h2>
            <p><strong>Hébergeur du Site :</strong></p>
            <ul className="list-none space-y-1 mt-2">
              <li>Vercel Inc.</li>
              <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li>Site web : <a href="https://vercel.com" className="text-[#2563EB] hover:underline">vercel.com</a></li>
              <li>Email : privacy@vercel.com</li>
            </ul>
            <p className="mt-4"><strong>Hébergement des données utilisateurs :</strong></p>
            <ul className="list-none space-y-1 mt-2">
              <li>Supabase Inc.</li>
              <li>Hébergement en Union Européenne (AWS, région eu-west-1, Irlande)</li>
              <li>Site web : <a href="https://supabase.com" className="text-[#2563EB] hover:underline">supabase.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>3. Propriété intellectuelle</h2>
            <p>L'ensemble du contenu du Site (textes, guides, scripts, algorithmes, graphismes, logo, structure, bases de données) est la propriété exclusive de Julien Guillard / Econia, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, est interdite sans autorisation écrite préalable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>4. Nature du service et limitation de responsabilité</h2>
            <p>Econia est un service d'information et d'aide à la décision. Il fournit des estimations et recommandations à titre <strong>indicatif</strong>.</p>
            <p className="mt-3">Econia n'est pas :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Un courtier ou intermédiaire en assurance (non inscrit à l'ORIAS)</li>
              <li>Un conseiller fiscal, expert-comptable ou commissaire aux comptes</li>
              <li>Un conseiller juridique ou avocat</li>
              <li>Un organisme de prestations sociales (CAF, CPAM, MDPH)</li>
              <li>Un conseiller en investissements financiers (non inscrit à l'AMF)</li>
            </ul>
            <p className="mt-3">Les montants affichés sont des estimations basées sur les barèmes officiels en vigueur et sur les informations fournies par l'utilisateur. Seuls les organismes compétents peuvent confirmer les droits et montants réels. Econia ne saurait être tenu responsable des décisions prises sur la base des informations fournies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>5. Utilisation de l'intelligence artificielle</h2>
            <p>Econia utilise des algorithmes et, dans certaines fonctionnalités, de l'intelligence artificielle pour analyser les données fournies par l'utilisateur et générer des recommandations personnalisées.</p>
            <p className="mt-3">Conformément au règlement européen sur l'intelligence artificielle (AI Act) :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Les résultats produits par ces systèmes sont indicatifs et ne constituent pas un avis professionnel</li>
              <li>Aucune décision automatisée au sens de l'article 22 du RGPD n'est prise : l'utilisateur reste entièrement décisionnaire de ses actions</li>
              <li>L'utilisateur est informé qu'il interagit avec un système d'intelligence artificielle lorsque c'est le cas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>6. Liens hypertextes</h2>
            <p>Le Site peut contenir des liens vers des sites tiers. Econia n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>7. Droit applicable</h2>
            <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#E2E8F0] flex flex-wrap gap-4 text-sm">
          <Link href="/confidentialite" className="text-[#2563EB] hover:underline">Politique de confidentialité</Link>
          <Link href="/cgu" className="text-[#2563EB] hover:underline">Conditions d'utilisation</Link>
          <Link href="/" className="text-[#536179] hover:text-[#2563EB]">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
