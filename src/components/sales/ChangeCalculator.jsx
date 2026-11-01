import { useState } from "react";
import { Banknote, Calculator, RotateCcw } from "lucide-react";

// Formater les montants en FCFA
const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

export default function ChangeCalculator({
  totalAmount = 0,
  onChangeCalculated,
}) {
  // Montant donné par le client
  const [receivedAmount, setReceivedAmount] = useState("");

  // Conversion du montant saisi en nombre
  const received = Number(receivedAmount) || 0;

  // Calcul de la monnaie à rendre
  const change = Math.max(received - totalAmount, 0);

  // Vérifier si le client a donné suffisamment d'argent
  const isEnough = received >= totalAmount && received > 0;

  // Réinitialiser le calculateur
  const handleReset = () => {
    setReceivedAmount("");
    onChangeCalculated?.(0);
  };

  // Calculer et transmettre la monnaie
  const handleCalculate = () => {
    if (!isEnough) return;

    onChangeCalculated?.(change);
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* En-tête */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-800">
          <Calculator size={22} />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">
            Calcul de monnaie
          </h2>

          <p className="text-sm text-slate-500">
            Calculez la monnaie à rendre au client.
          </p>
        </div>
      </div>

      {/* Montant total des achats */}
      <div className="mb-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Total des achats
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          {formatPrice(totalAmount)}
        </p>
      </div>

      {/* Montant reçu */}
      <div className="mb-5">
        <label
          htmlFor="receivedAmount"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Somme donnée par le client (FCFA)
        </label>

        <div className="relative">
          <Banknote
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="receivedAmount"
            type="number"
            min="0"
            value={receivedAmount}
            onChange={(event) =>
              setReceivedAmount(event.target.value)
            }
            placeholder="Ex : 25000"
            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-lg font-bold outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Résultat du calcul */}
      <div
        className={`rounded-xl p-4 ${
          isEnough
            ? "bg-green-50"
            : "bg-orange-50"
        }`}
      >
        <p className="text-sm font-medium text-slate-600">
          {isEnough
            ? "Monnaie à rendre"
            : "Montant restant à payer"}
        </p>

        <p
          className={`mt-1 text-2xl font-extrabold ${
            isEnough ? "text-green-700" : "text-orange-600"
          }`}
        >
          {formatPrice(
            isEnough
              ? change
              : Math.max(totalAmount - received, 0)
          )}
        </p>

        {!isEnough && received > 0 && (
          <p className="mt-1 text-xs text-orange-700">
            Le montant reçu est insuffisant.
          </p>
        )}
      </div>

      {/* Boutons */}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={17} />
          Réinitialiser
        </button>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!isEnough}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Calculator size={17} />
          Calculer
        </button>
      </div>
    </section>
  );
}
