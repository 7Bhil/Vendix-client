import { useState } from 'react';
export default function UnitConversionField({ onChange }) {
    const [units, setUnits] = useState([]);
   const addUnit = () => {
  const newUnit = {
    id: Date.now(),
    name: '',
    conversionFactor: ''
  };

  const updatedUnits = [...units, newUnit];

  setUnits(updatedUnits);
  onChange?.(updatedUnits);
};
const updateUnit = (id, field, value) => {
  const updatedUnits = units.map((unit) =>
    unit.id === id ? { ...unit, [field]: value } : unit
  );

  setUnits(updatedUnits);
  onChange?.(updatedUnits);
};

const removeUnit = (id) => {
  const updatedUnits = units.filter((unit) => unit.id !== id);

  setUnits(updatedUnits);
  onChange?.(updatedUnits);
};

  return (
    <div className="mt-5 rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-vendix-ink">
        Unités et conversions
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Définissez les unités de vente supplémentaires de votre produit.
      </p>
      {units.map((unit) => (
  <div key={unit.id} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Nom de l'unité
      </label>

      <input
        type="text"
        value={unit.name}
        placeholder="Ex : Carton"
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
        onChange={(event) => updateUnit(unit.id, 'name', event.target.value)}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Équivalent en unités de base
      </label>

      <input
        type="number"
        min="0.01"
        step="any"
        value={unit.conversionFactor}
        placeholder="Ex : 24"
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
        onChange={(event) => updateUnit(unit.id, 'conversionFactor', event.target.value)}
      />
    </div>
 <button
  type="button"
  onClick={() => removeUnit(unit.id)}
  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
>
  Supprimer cette unité
</button>
  </div>
))}
{units.length > 0 && (
  <div className="mt-5 rounded-xl bg-slate-50 p-4">
    <h4 className="mb-3 font-semibold text-vendix-ink">
      Récapitulatif des conversions
    </h4>

    {units.map((unit) => (
      <p key={unit.id} className="mb-2 text-sm text-slate-600">
        1 {unit.name || 'Unité'} = {unit.conversionFactor || 0} unités de base
      </p>
    ))}
  </div>
)}
<button
  type="button"
  onClick={addUnit}
  className="mt-5 rounded-xl border border-vendix-brand px-4 py-2 font-medium text-vendix-brand hover:bg-slate-50"
>
  Ajouter une unité
</button>
    </div>
  );
}