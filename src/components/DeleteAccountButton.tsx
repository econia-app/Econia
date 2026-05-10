'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'SUPPRIMER') return;

    setLoading(true);
    setError(null);

    try {
      // Appel à l'API route pour supprimer le compte côté serveur
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      // Déconnexion locale
      await supabase.auth.signOut();

      // Redirection avec message
      router.push('/?deleted=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-5 py-3 bg-white text-[#EF4444] border border-[#EF4444] rounded-xl text-sm font-semibold hover:bg-[#EF4444] hover:text-white transition"
      >
        Supprimer mon compte
      </button>
    );
  }

  return (
    <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-6 max-w-lg">
      <h3 className="font-bold text-[#991B1B] mb-2">⚠️ Supprimer définitivement mon compte</h3>
      <p className="text-sm text-[#7F1D1D] leading-relaxed mb-4">
        Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées définitivement :
        scan, résultats, progression, documents uploadés, abonnement.
      </p>
      <p className="text-sm text-[#7F1D1D] mb-4">
        Conformément au RGPD (article 17), vos données seront effacées de nos serveurs sous 30 jours maximum.
      </p>

      <label className="block mb-4">
        <span className="text-sm text-[#7F1D1D] font-medium block mb-2">
          Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
        </span>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full px-3 py-2 border border-[#FECACA] rounded-lg text-sm focus:outline-none focus:border-[#EF4444]"
          placeholder="SUPPRIMER"
        />
      </label>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={() => { setShowConfirm(false); setConfirmText(''); setError(null); }}
          className="px-5 py-2 bg-white text-[#536179] border border-[#E2E8F0] rounded-xl text-sm font-medium hover:border-[#536179] transition"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          onClick={handleDelete}
          disabled={confirmText !== 'SUPPRIMER' || loading}
          className="px-5 py-2 bg-[#EF4444] text-white rounded-xl text-sm font-semibold hover:bg-[#DC2626] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Suppression...' : 'Supprimer définitivement'}
        </button>
      </div>
    </div>
  );
}
