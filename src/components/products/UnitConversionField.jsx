import { useEffect, useState } from 'react';
import { Plus, Trash2, Scale } from 'lucide-react';

export default function UnitConversionField({
  baseUnit = 'Unité',
  value = [],
  onChange,
}) {
  const [units, setUnits] = useState(value);

  useEffect(() => {
    if (Array.isArray(value)) {
      setUnits(value);
    }
  }, [value]);

  const addUnit = () => {
    const newUnit = {
      id: `u-${Date.now()}`,
      name: '',
      conversionFactor: '',
      isBase: false,
    };

    const updated = [...units, newUnit];
    setUnits(updated);
    onChange?.(updated);
  };

  const updateUnit = (id, field, val) => {
    const updated = units.map((u) =>
      u.id === id ? { ...u, [field]: val } : u
    );
    setUnits(updated);
    onChange?.(updated);
  };

  const removeUnit = (id) => {
    const updated = units.filter((u) => u.id !== id);
    setUnits(updated);
    onChange?.(updated);
  };

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-vendix-brand">
            <Scale size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Unités secondaires & Conversions
            </h3>
            <p className="text-xs text-slate-500">
              Permet de vendre au carton, sac ou paquet avec déduction automatique du stock en base ({baseUnit || 'Unité'}).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addUnit}
          className="inline-flex items-center justify-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-vendix-brand shadow-2xs transition hover:bg-slate-50 hover:border-vendix-brand focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <Plus size={14} />
          <span>Ajouter une unité</span>
        </button>
      </div>

      {units.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
          <p className="text-xs text-slate-500">
            Aucune unité secondaire. Les ventes se feront uniquement en{' '}
            <strong className="text-slate-700">{baseUnit || 'Unité de base'}</strong>.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Désignation de l'unité
                </label>
                <input
                  type="text"
                  placeholder="Ex : Carton, Paquet..."
                  value={unit.name}
                  onChange={(e) => updateUnit(unit.id, 'name', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>

              <div className="w-full sm:w-64">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Équivalent en {baseUnit || 'unités'}
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="Ex : 24"
                  value={unit.conversionFactor ?? ''}
                  onChange={(e) =>
                    updateUnit(
                      unit.id,
                      'conversionFactor',
                      e.target.value ? Number(e.target.value) : ''
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>

              <button
                type="button"
                onClick={() => removeUnit(unit.id)}
                title="Supprimer cette unité"
                className="flex h-10 w-full sm:w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Supprimer cette unité"
              >
                <Trash2 size={16} />
                <span className="sm:hidden text-xs font-bold ml-1.5">Supprimer cette unité</span>
              </button>
            </div>
          ))}

          <div className="rounded-xl bg-blue-50/70 p-3 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-vendix-brand">Règle de conversion active :</p>
            {units.map((u) => (
              <p key={u.id}>
                • 1 {u.name || 'Unité'} ={' '}
                <span className="font-bold text-slate-900">
                  {u.conversionFactor || 1} {baseUnit || 'Unité(s)'}
                </span>{' '}
                en déstockage automatique.
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
