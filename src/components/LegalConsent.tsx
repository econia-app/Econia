'use client';

import Link from 'next/link';

interface LegalConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export default function LegalConsent({ checked, onChange, required = true }: LegalConsentProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer text-sm text-[#536179] leading-relaxed">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-1 w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] focus:ring-2 cursor-pointer flex-shrink-0"
      />
      <span>
        J'ai lu et j'accepte les{' '}
        <Link href="/cgu" target="_blank" className="text-[#2563EB] hover:underline font-medium">
          Conditions d'utilisation
        </Link>
        {' '}et la{' '}
        <Link href="/confidentialite" target="_blank" className="text-[#2563EB] hover:underline font-medium">
          Politique de confidentialité
        </Link>
        {' '}d'Econia.
      </span>
    </label>
  );
}
