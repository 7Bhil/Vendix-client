
import { useState } from 'react';

export default function PriceTierManager({ onChange }) {
  const [tiers, setTiers] = useState([]);

  const addTier = () => {
    const newTier = {
      id: Date.now(),
      type: 'Détail',
      minQuantity: '',
      price: ''
    };

    const updatedTiers = [...tiers, newTier];
    setTiers(updatedTiers);
    onChange?.(updatedTiers);
  };

  const updateTier = (id, field, value) => {
    const updatedTiers = tiers.map((tier) =>
      tier.id === id ? { ...tier, [field]: value } : tier
    );

    setTiers(updatedTiers);
    onChange?.(updatedTiers);
  };

  const removeTier = (id) => {
    const updatedTiers = tiers.filter((tier) => tier.id !== id);

    setTiers(updatedTiers);
    onChange?.(updatedTiers);
  };

  return (
    <div className="mt-5 rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-vendix-ink">
        Tarifs selon la quantité
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Définissez différents prix selon la quantité achetée par vos clients.
      </p>

      {tiers.map((tier) => (
        <div
          key={tier.id}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Type de tarif
            </label>
            <select
              value={tier.type}
              onChange={(event) =>
                updateTier(tier.id, 'type', event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="Détail">Détail</option>
              <option value="Demi-gros">Demi-gros</option>
              <option value="Gros">Gros</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Quantité minimale
            </label>
            <input
              type="number"
              min="1"
              value={tier.minQuantity}
              onChange={(event) =>
                updateTier(tier.id, 'minQuantity', event.target.value)
              }
              placeholder="Ex : 12"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Prix unitaire (FCFA)
            </label>
            <input
              type="number"
              min="0"
              value={tier.price}
              onChange={(event) =>
                updateTier(tier.id, 'price', event.target.value)
              }
              placeholder="Ex : 1500"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <button
            type="button"
            onClick={() => removeTier(tier.id)}
            className="text-left text-sm font-medium text-red-600 hover:text-red-800"
          >
            Supprimer ce tarif
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addTier}
        className="mt-5 rounded-xl border border-vendix-brand px-4 py-2 font-medium text-vendix-brand hover:bg-slate-50"
      >
        Ajouter un tarif
      </button>
    </div>
  );
}
