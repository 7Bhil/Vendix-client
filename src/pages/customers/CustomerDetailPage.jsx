import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CircleDollarSign, CreditCard, ReceiptText } from 'lucide-react';
import DebtSummaryCard from '../../components/customers/DebtSummaryCard.jsx';
import PaymentRecordModal from '../../components/customers/PaymentRecordModal.jsx';
import WhatsAppReminderButton from '../../components/customers/WhatsAppReminderButton.jsx';
import { formatCurrency, formatDate, getInitialPaymentHistory, loadCustomers, saveCustomers } from '../../utils/customerDebtUtils.js';

const PAYMENT_METHODS = {
  ESPECE: 'Espèces',
  MOBILE_MONEY: 'Mobile Money',
  MOMO: 'Mobile Money',
  VIREMENT: 'Virement',
  AUTRE: 'Autre',
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(loadCustomers);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [storageError, setStorageError] = useState('');
  const customer = customers.find((entry) => entry.id === id);

  if (!customer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Client introuvable</h1>
          <p className="mt-2 text-sm text-slate-600">Ce client n’existe pas dans les données de démonstration.</p>
          <Link to="/app/clients" className="mt-5 inline-flex font-semibold text-vendix-brand hover:underline">
            Retour à la liste des clients
          </Link>
        </section>
      </main>
    );
  }

  const payments = [
    ...getInitialPaymentHistory(customer),
    ...(customer.paymentHistory ?? []),
  ].sort((first, second) => new Date(second.date) - new Date(first.date));
  const statement = [...(customer.statement ?? [])]
    .sort((first, second) => new Date(second.date) - new Date(first.date));

  function recordPayment(payment) {
    const updatedCustomer = {
      ...customer,
      currentDebt: customer.currentDebt - payment.amount,
      totalPaid: (customer.totalPaid ?? 0) + payment.amount,
      oldestDebtDate: customer.currentDebt - payment.amount === 0 ? null : customer.oldestDebtDate,
      paymentHistory: [
        ...(customer.paymentHistory ?? []),
        {
          id: `PAY-${payment.date}-${(customer.paymentHistory ?? []).length + 1}`,
          ...payment,
        },
      ],
      statement: [
        ...(customer.statement ?? []),
        {
          date: payment.date,
          type: `ACOMPTE_${payment.method}`,
          ref: `PAY-${payment.date}-${(customer.paymentHistory ?? []).length + 1}`,
          debit: 0,
          credit: payment.amount,
          balance: customer.currentDebt - payment.amount,
        },
      ],
    };
    const updatedCustomers = customers.map((entry) =>
      entry.id === customer.id ? updatedCustomer : entry,
    );

    try {
      saveCustomers(updatedCustomers);
      setCustomers(updatedCustomers);
      setStorageError('');
      setShowPaymentModal(false);
    } catch (error) {
      setStorageError(`Le règlement n’a pas pu être sauvegardé dans ce navigateur. ${error.message}`);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-vendix-brand">
            Vendix<span className="text-vendix-accent">.</span>
          </Link>
          <Link to="/app/clients" className="text-sm font-semibold text-slate-600 hover:text-vendix-brand">
            Tous les clients
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate('/app/clients')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-vendix-brand"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Retour aux clients
        </button>

        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-vendix-brand">
              {customer.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">Fiche client</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{customer.fullName}</h1>
              <p className="mt-1 text-sm text-slate-600">{customer.phone}{customer.address ? ` · ${customer.address}` : ''}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {customer.currentDebt > 0 && <WhatsAppReminderButton customer={customer} />}
            {customer.currentDebt > 0 && (
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-vendix-brand-dark focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <CircleDollarSign size={18} aria-hidden="true" />
                Enregistrer un règlement
              </button>
            )}
          </div>
        </section>

        {storageError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{storageError}</p>}

        <DebtSummaryCard customer={customer} />

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CreditCard size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Historique des acomptes</h2>
              <p className="text-sm text-slate-500">Règlements enregistrés pour ce client</p>
            </div>
          </div>
          {payments.length ? (
            <div className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <CalendarDays size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">{formatDate(payment.date)}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {PAYMENT_METHODS[payment.method] ?? payment.method}
                        {payment.reference ? ` · ${payment.reference}` : ''}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-bold text-emerald-700">+ {formatCurrency(payment.amount)} FCFA</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-slate-500 sm:px-6">
              Aucun acompte enregistré pour le moment.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <ReceiptText size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Mouvements du compte</h2>
              <p className="text-sm text-slate-500">Ventes à crédit et règlements enregistrés</p>
            </div>
          </div>
          {statement.length ? (
            <div className="divide-y divide-slate-100">
              {statement.map((entry, index) => (
                <div key={`${entry.ref}-${index}`} className="grid grid-cols-2 gap-2 px-5 py-4 text-sm sm:grid-cols-4 sm:px-6">
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="mt-1 font-medium text-slate-800">{formatDate(entry.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Opération</p>
                    <p className="mt-1 font-medium text-slate-800">{entry.type.replaceAll('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Montant</p>
                    <p className={`mt-1 font-semibold ${entry.credit > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {entry.credit > 0 ? '− ' : '+ '}{formatCurrency(entry.credit || entry.debit)} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Solde après opération</p>
                    <p className="mt-1 font-semibold text-slate-800">{formatCurrency(entry.balance)} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-slate-500 sm:px-6">Aucun mouvement enregistré.</p>
          )}
        </section>

        {customer.notes && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">Note client</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{customer.notes}</p>
          </section>
        )}
        <p className="mt-5 text-xs text-slate-500">
          Prototype local : les règlements sont conservés dans ce navigateur et ne sont pas encore synchronisés avec un serveur.
        </p>
      </div>

      {showPaymentModal && (
        <PaymentRecordModal
          customer={customer}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={recordPayment}
        />
      )}
    </main>
  );
}
