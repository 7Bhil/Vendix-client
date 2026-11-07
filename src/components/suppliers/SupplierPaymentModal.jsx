import { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/supplierUtils.js';

export default function SupplierPaymentModal({ isOpen, onClose, supplier, onRecordPayment }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ESPECE');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !supplier) return null;

  const currentDebt = supplier.currentDebt || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError('Veuillez saisir un montant valide supérieur à 0.');
      return;
    }

    if (numericAmount > currentDebt) {
      setError(`Le montant ne peut pas dépasser la dette actuelle (${formatCurrency(currentDebt)} FCFA).`);
      return;
    }

    onRecordPayment({
      amount: numericAmount,
      paymentMethod,
      notes: notes.trim(),
      date: new Date().toISOString(),
    });

    setAmount('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <CreditCard size={18} />
            </span>
            <span>Régler une dette fournisseur</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <p className="text-xs font-semibold text-slate-500">Fournisseur</p>
            <p className="text-sm font-bold text-slate-900">{supplier.fullName}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Dette actuelle :</span>
              <span className="font-extrabold text-amber-800">{formatCurrency(currentDebt)} FCFA</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Montant versé (FCFA) *
            </label>
            <input
              type="number"
              min="1"
              max={currentDebt}
              step="1"
              required
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder={`Max : ${currentDebt}`}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Moyen de règlement *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            >
              <option value="ESPECE">Espèces</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="VIREMENT">Virement bancaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Note ou référence (facultatif)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Reçu n° 458"
              maxLength={150}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-vendix-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-vendix-brand-dark transition"
            >
              Confirmer le versement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
