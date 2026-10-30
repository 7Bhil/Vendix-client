import { AlertCircle, CalendarClock, Wallet } from 'lucide-react';
import { formatCurrency, formatDate, getDebtAge } from '../../utils/customerDebtUtils.js';

export default function DebtSummaryCard({ customer }) {
  const debtAge = getDebtAge(customer.oldestDebtDate);
  const isOverdue = debtAge >= 30;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Solde restant dû</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {formatCurrency(customer.currentDebt)} <span className="text-base font-semibold">FCFA</span>
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <Wallet size={21} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <CalendarClock size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <div>
            <p className="text-xs text-slate-500">Dette la plus ancienne</p>
            <p className="text-sm font-semibold text-slate-800">
              {customer.oldestDebtDate ? formatDate(customer.oldestDebtDate) : 'Aucune dette'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AlertCircle
            size={18}
            className={`shrink-0 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}
            aria-hidden="true"
          />
          <div>
            <p className="text-xs text-slate-500">Ancienneté</p>
            <p className={`text-sm font-semibold ${isOverdue ? 'text-red-700' : 'text-slate-800'}`}>
              {customer.oldestDebtDate ? `${debtAge} jour${debtAge > 1 ? 's' : ''}` : '—'}
              {isOverdue && ' · à suivre'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
