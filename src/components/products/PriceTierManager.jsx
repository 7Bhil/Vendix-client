import { useEffect, useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

const TIER_OPTIONS = [
  { value: 'detail', label: 'Détail' },
  { value: 'demi_gros', label: 'Demi-gros' },
  { value: 'gros', label: 'Gros' },
];

export default function PriceTierManager({ value = [], onChange }) {
  const [tiers, setTiers] = useState(value);

  useEffect(() => {
    if (Array.isArray(value)) {
      setTiers(value);
    }
  }, [value]);

  const addTier = () => {
    const newTier = {
      id: `tier-${Date.now()}`,
      tier: 'demi_gros',
      minQuantity: 5,
      price: '',
    };

    const updated = [...tiers, newTier];
    setTiers(updated);
    onChange?.(updated);
  };

  const updateTier = (id, field, val) => {
    const updated = tiers.map((tier) =>
      tier.id === id ? { ...tier, [field]: val } : tier
    );
    setTiers(updated);
    onChange?.(updated);
  };

  const removeTier = (id) => {
    const updated = tiers.filter((tier) => tier.id !== id);
    setTiers(updated);
    onChange?.(updated);
  };

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-vendix-brand">
            <Layers size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Tarification par volume (Demi-gros & Gros)
            </h3>
            <p className="text-xs text-slate-500">
              Applique automatiquement un tarif dégressif selon la quantité commandée.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addTier}
          className="inline-flex items-center justify-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-vendix-brand shadow-2xs transition hover:bg-slate-50 hover:border-vendix-brand focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <Plus size={14} />
          <span>Ajouter un palier</span>
        </button>
      </div>

      {tiers.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
          <p className="text-xs text-slate-500">
            Aucun tarif dégressif configuré. Le prix unitaire standard s'appliquera par défaut.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Type de palier
                </label>
                <select
                  value={tier.tier || tier.type || 'demi_gros'}
                  onChange={(e) => updateTier(tier.id, 'tier', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                >
                  {TIER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-40">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Qté min.
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ex : 5"
                  value={tier.minQuantity ?? ''}
                  onChange={(e) => updateTier(tier.id, 'minQuantity', e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prix unitaire (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex : 17500"
                  value={tier.price ?? ''}
                  onChange={(e) => updateTier(tier.id, 'price', e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm font-bold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>

              <button
                type="button"
                onClick={() => removeTier(tier.id)}
                title="Supprimer ce palier"
                className="flex h-10 w-full sm:w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Supprimer ce palier de prix"
              >
                <Trash2 size={16} />
                <span className="sm:hidden text-xs font-bold ml-1.5">Supprimer ce palier</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
