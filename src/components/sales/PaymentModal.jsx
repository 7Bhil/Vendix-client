import { useState, useMemo } from "react";
import {
  X,
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { loadCustomers } from "../../utils/customerDebtUtils";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function PaymentModal({
  isOpen,
  totalAmount = 0,
  onClose,
  onConfirm,
}) {
  const [paidAmount, setPaidAmount] = useState(String(totalAmount));
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customCustomerName, setCustomCustomerName] = useState("");

  const customers = useMemo(() => {
    try {
      return loadCustomers();
    } catch {
      return [];
    }
  }, []);

  const selectedCustomerObj = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const debtAgeDays = useMemo(() => {
    if (!selectedCustomerObj || !selectedCustomerObj.oldestDebtDate) return 0;
    const debtTime = new Date(selectedCustomerObj.oldestDebtDate).getTime();
    if (isNaN(debtTime)) return 0;
    const diffMs = Date.now() - debtTime;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }, [selectedCustomerObj]);

  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericPaid = Number(paidAmount) || 0;
  const remainingAmount = Math.max(totalAmount - numericPaid, 0);
  const changeAmount = Math.max(numericPaid - totalAmount, 0);

  // La vente est valide si montant payé >= 0, mais si dette, un client doit être désigné
  const isCreditSale = remainingAmount > 0;
  const isCustomerProvided =
    selectedCustomerId !== "" || customCustomerName.trim().length > 0;
  const isValid = !isSubmitting && (!isCreditSale || isCustomerProvided);

  const paymentMethods = [
    { id: "CASH", label: "Espèces", icon: Banknote },
    { id: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
    { id: "CARD", label: "Carte", icon: CreditCard },
    { id: "CREDIT", label: "Crédit", icon: Wallet },
  ];

  const handleConfirm = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    let customerName = "Client Comptoir";
    let customerId = null;

    if (selectedCustomerId) {
      const found = customers.find((c) => c.id === selectedCustomerId);
      if (found) {
        customerName = found.fullName;
        customerId = found.id;
      }
    } else if (customCustomerName.trim()) {
      customerName = customCustomerName.trim();
    }

    try {
      await onConfirm?.({
        paidAmount: numericPaid,
        paymentMethod,
        remainingAmount,
        changeAmount,
        customerId,
        customerName,
        status:
          numericPaid === 0
            ? "NON_PAYEE"
            : remainingAmount > 0
            ? "PARTIELLEMENT_PAYEE"
            : "PAYEE",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Encaisser la vente</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Précisez le règlement et le client associé.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps */}
        <div className="space-y-5 p-5">
          {/* Montant total */}
          <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
            <span className="text-sm font-semibold text-vendix-brand">
              Montant total net
            </span>
            <span className="text-2xl font-black text-vendix-brand">
              {formatPrice(totalAmount)}
            </span>
          </div>

          {/* Sélection du client */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <User size={15} className="text-vendix-brand" />
              <span>Client associé {isCreditSale && <span className="text-red-500">*</span>}</span>
            </label>

            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                if (e.target.value) setCustomCustomerName("");
              }}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            >
              <option value="">Sélectionner un client existant (ou saisir ci-dessous)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.phone}) {c.currentDebt > 0 ? `· Dette: ${formatPrice(c.currentDebt)}` : ""}
                </option>
              ))}
            </select>

            {!selectedCustomerId && (
              <input
                type="text"
                placeholder="Ou nom du client comptoir / nouveau client"
                value={customCustomerName}
                onChange={(e) => setCustomCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            )}

            {isCreditSale && !isCustomerProvided && (
              <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <AlertTriangle size={14} />
                Veuillez désigner un client pour enregistrer une vente à crédit.
              </p>
            )}

            {/* Alerte Risque d'impayé / Dette ancienne */}
            {selectedCustomerObj && selectedCustomerObj.currentDebt > 0 && (
              <div
                className={`rounded-xl p-3 text-xs border ${
                  debtAgeDays > 30
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={14} className={debtAgeDays > 30 ? "text-red-600" : "text-amber-600"} />
                  <span>
                    {debtAgeDays > 30
                      ? `Attention : Dette ancienne critique (${debtAgeDays} jours)`
                      : "Dette en cours"}
                  </span>
                </div>
                <p className="mt-1 leading-snug">
                  Ce client doit déjà {formatPrice(selectedCustomerObj.currentDebt)}.
                  {debtAgeDays > 30 && " Une autorisation ou un acompte est fortement recommandé avant d'octroyer un nouveau crédit."}
                </p>
              </div>
            )}
          </div>

          {/* Montant versé */}
          <div>
            <label
              htmlFor="paidAmount"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Montant versé par le client (FCFA)
            </label>
            <input
              id="paidAmount"
              type="number"
              min="0"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-lg font-black outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
              placeholder="0"
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPaidAmount(String(totalAmount))}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Paiement exact
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaidAmount("0");
                  setPaymentMethod("CREDIT");
                }}
                className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                100% à crédit (0 FCFA)
              </button>
            </div>
          </div>

          {/* Mode de paiement */}
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mode de paiement
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                      isSelected
                        ? "border-vendix-brand bg-blue-50 text-vendix-brand ring-2 ring-vendix-brand/20"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bilan financier de la transaction */}
          <div className="rounded-xl border border-slate-200 p-3.5">
            {remainingAmount > 0 ? (
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold">Reste à recouvrer (Dette client)</span>
                <span className="text-base font-black">{formatPrice(remainingAmount)}</span>
              </div>
            ) : changeAmount > 0 ? (
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold">Monnaie à rendre au client</span>
                <span className="text-base font-black">{formatPrice(changeAmount)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle size={16} />
                <span>Règlement intégral comptant</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid || isSubmitting}
            className="flex-1 rounded-xl bg-vendix-brand py-2.5 text-xs font-bold text-white transition hover:bg-vendix-brand-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            {isSubmitting ? "Enregistrement..." : "Valider et imprimer le reçu"}
          </button>
        </div>
      </div>
    </div>
  );
}
