import { useState } from "react";
import {
  X,
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle,
} from "lucide-react";

// Formater les montants en FCFA
const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

export default function PaymentModal({
  isOpen,
  totalAmount = 0,
  onClose,
  onConfirm,
}) {
  // Montant déjà saisi par le vendeur
  const [paidAmount, setPaidAmount] = useState(String(totalAmount));

  // Mode de paiement sélectionné
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // Ne rien afficher si la fenêtre est fermée
  if (!isOpen) return null;

  // Conversion du montant saisi en nombre
  const amount = Number(paidAmount) || 0;

  // Calcul du reste à payer
  const remainingAmount = Math.max(totalAmount - amount, 0);

  // Calcul de la monnaie à rendre
  const changeAmount = Math.max(amount - totalAmount, 0);

  // Vérifier si le montant est valide
  const isValid = amount > 0;

  // Modes de paiement proposés
  const paymentMethods = [
    {
      id: "CASH",
      label: "Espèces",
      icon: Banknote,
    },
    {
      id: "MOBILE_MONEY",
      label: "Mobile Money",
      icon: Smartphone,
    },
    {
      id: "CARD",
      label: "Carte bancaire",
      icon: CreditCard,
    },
    {
      id: "OTHER",
      label: "Autre",
      icon: Wallet,
    },
  ];

  // Confirmer le paiement
  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm?.({
      paidAmount: amount,
      paymentMethod,
      remainingAmount,
      changeAmount,
      status:
        remainingAmount > 0
          ? "PARTIELLEMENT_PAYEE"
          : "PAYEE",
    });
  };

  return (
    // Fond sombre de la fenêtre
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">

      {/* Fenêtre de paiement */}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Encaisser la vente
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enregistrez le paiement du client.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X size={21} />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6 p-5">

          {/* Montant total */}
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-700">
              Montant total de la vente
            </p>

            <p className="mt-1 text-2xl font-extrabold text-blue-900">
              {formatPrice(totalAmount)}
            </p>
          </div>

          {/* Montant versé */}
          <div>
            <label
              htmlFor="paidAmount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Montant versé par le client (FCFA)
            </label>

            <input
              id="paidAmount"
              type="number"
              min="0"
              value={paidAmount}
              onChange={(event) => setPaidAmount(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Ex : 20000"
            />

            <button
              type="button"
              onClick={() => setPaidAmount(String(totalAmount))}
              className="mt-2 text-sm font-medium text-blue-700 hover:underline"
            >
              Le client paie le montant exact
            </button>
          </div>

          {/* Mode de paiement */}
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Mode de paiement
            </p>

            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const selected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                      selected
                        ? "border-blue-700 bg-blue-50 text-blue-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={19} />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reste à payer ou monnaie */}
          <div className="rounded-xl border border-slate-200 p-4">
            {remainingAmount > 0 ? (
              <div>
                <p className="text-sm text-slate-500">
                  Reste à payer
                </p>

                <p className="mt-1 text-xl font-bold text-orange-600">
                  {formatPrice(remainingAmount)}
                </p>
              </div>
            ) : changeAmount > 0 ? (
              <div>
                <p className="text-sm text-slate-500">
                  Monnaie à rendre
                </p>

                <p className="mt-1 text-xl font-bold text-green-700">
                  {formatPrice(changeAmount)}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />

                <p className="font-semibold">
                  Paiement complet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 border-t border-slate-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle size={18} />
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
