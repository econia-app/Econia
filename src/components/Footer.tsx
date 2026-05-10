import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white/40 px-8 py-14">
      <div className="max-w-[1080px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="text-[22px] font-extrabold tracking-tight mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            <span className="text-white">ec</span>
            <span style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>o</span>
            <span className="text-white">nia</span>
          </div>
          <p className="text-sm leading-relaxed max-w-[260px]">
            L'agent IA qui détecte l'argent que vous perdez sans le savoir et vous accompagne pour le récupérer.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Produit
          </h4>
          <Link href="/" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Scan gratuit</Link>
          <Link href="/#how" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Fonctionnement</Link>
          <Link href="/#prix" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Tarifs</Link>
          <Link href="/#faq" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">FAQ</Link>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Légal
          </h4>
          <Link href="/mentions-legales" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Mentions légales</Link>
          <Link href="/confidentialite" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Politique de confidentialité</Link>
          <Link href="/cgu" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Conditions d'utilisation</Link>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Suivez-nous
          </h4>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Instagram</a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">TikTok</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Facebook</a>
          <a href="mailto:econia.app@gmail.com" className="block text-sm text-white/35 hover:text-[#2563EB] py-1 transition">Contact</a>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto pt-5 border-t border-white/[0.06] flex flex-col md:flex-row justify-between gap-1 text-xs text-white/25 text-center md:text-left">
        <span>© 2026 Econia — Estimations indicatives basées sur les barèmes officiels</span>
        <span>Fait en France 🇫🇷</span>
      </div>
    </footer>
  );
}
