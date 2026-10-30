import { useState } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/customerDebtUtils.js';

function getToday() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function PaymentRecordModal({ customer, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('ESPECE');
  const [date, setDate] = useState(getToday());
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Saisissez un montant supérieur à zéro.');
      return;
    }
    if (numericAmount > customer.currentDebt) {
      setError('Le règlement ne peut pas dépasser le solde restant dû.');
      return;
    }
    if (!date) {
      setError('Sélectionnez la date du règlement.');
      return;
    }

    onSubmit({ amount: numericAmount, method, date: new Date(`${date}T12:00:00`).toISOString() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="payment-modal-title" className="text-xl font-bold text-slate-900">
              Enregistrer un règlement
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {customer.fullName} · reste {formatCurrency(customer.currentDebt)} FCFA
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="payment-amount" className="mb-1.5 block text-sm font-medium text-slate-700">
              Montant reçu (FCFA)
            </label>
            <input
              id="payment-amount"
              type="number"
              min="1"
              max={customer.currentDebt}
              step="1"
              required
              autoFocus
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError('');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="payment-method" className="mb-1.5 block text-sm font-medium text-slate-700">
                Mode de règlement
              </label>
              <select
                id="payment-method"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
              >
                <option value="ESPECE">Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="VIREMENT">Virement</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="payment-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                Date du règlement
              </label>
              <input
                id="payment-date"
                type="date"
                required
                max={getToday()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <footer className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-vendix-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-vendix-brand-dark"
            >
              Enregistrer le règlement
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
