import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  ReceiptText,
  Phone,
  MapPin,
  Plus,
} from 'lucide-react';
import DebtSummaryCard from '../../components/customers/DebtSummaryCard.jsx';
import PaymentRecordModal from '../../components/customers/PaymentRecordModal.jsx';
import WhatsAppReminderButton from '../../components/customers/WhatsAppReminderButton.jsx';
import {
  formatCurrency,
  formatDate,
  getInitialPaymentHistory,
  loadCustomers,
  saveCustomers,
} from '../../utils/customerDebtUtils.js';

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
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Client introuvable</h1>
          <p className="mt-1 text-xs text-slate-500">
            Cette fiche client n’existe pas dans vos données.
          </p>
          <Link
            to="/app/customers"
            className="mt-4 inline-flex text-xs font-bold text-vendix-brand hover:underline"
          >
            Retour aux clients
          </Link>
        </section>
      </div>
    );
  }

  const payments = [
    ...getInitialPaymentHistory(customer),
    ...(customer.paymentHistory ?? []),
  ].sort((first, second) => new Date(second.date) - new Date(first.date));

  const statement = [...(customer.statement ?? [])].sort(
    (first, second) => new Date(second.date) - new Date(first.date)
  );

  function recordPayment(payment) {
    const updatedCustomer = {
      ...customer,
      currentDebt: Math.max(customer.currentDebt - payment.amount, 0),
      totalPaid: (customer.totalPaid ?? 0) + payment.amount,
      oldestDebtDate:
        customer.currentDebt - payment.amount <= 0 ? null : customer.oldestDebtDate,
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
          balance: Math.max(customer.currentDebt - payment.amount, 0),
        },
      ],
    };

    const updatedCustomers = customers.map((entry) =>
      entry.id === customer.id ? updatedCustomer : entry
    );

    try {
      saveCustomers(updatedCustomers);
      setCustomers(updatedCustomers);
      setStorageError('');
      setShowPaymentModal(false);
    } catch (error) {
      setStorageError(`Le règlement n’a pas pu être sauvegardé. ${error.message}`);
    }
  }

  const initials = customer.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Navigation et actions principales */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate('/app/customers')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-vendix-brand"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour à la liste des clients</span>
        </button>

        <div className="flex items-center gap-2">
          {customer.currentDebt > 0 && <WhatsAppReminderButton customer={customer} />}
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <Plus size={16} />
            <span>Enregistrer un versement</span>
          </button>
        </div>
      </div>

      {storageError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          {storageError}
        </div>
      )}

      {/* Carte d'identité client épurée */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-base font-black text-vendix-brand">
              {initials}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Fiche Client Individuelle
              </span>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {customer.fullName}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Phone size={13} className="text-slate-400" />
                  {customer.phone}
                </span>
                {customer.address && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={13} className="text-slate-400" />
                      {customer.address}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Solde débiteur actuel
            </p>
            <p
              className={`text-2xl font-black ${
                customer.currentDebt > 0 ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {formatCurrency(customer.currentDebt)} <span className="text-xs font-bold text-slate-400">FCFA</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cartes d'indicateurs de créance */}
      <DebtSummaryCard customer={customer} />

      {/* Grille : Relevé de compte & Historique des règlements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Relevé chronologique */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ReceiptText size={17} className="text-vendix-brand" />
              <span>Carnet de débit & crédit</span>
            </h2>
          </div>

          {statement.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {statement.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.type.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(item.date)} • Ref: {item.ref}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-black ${
                        item.debit > 0 ? 'text-slate-900' : 'text-emerald-700'
                      }`}
                    >
                      {item.debit > 0 ? `+${formatCurrency(item.debit)}` : `-${formatCurrency(item.credit)}`} FCFA
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Solde : {formatCurrency(item.balance)} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-center text-xs text-slate-400">
              Aucun mouvement comptable enregistré.
            </p>
          )}
        </div>

        {/* Historique des paiements reçus */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CreditCard size={17} className="text-emerald-600" />
              <span>Règlements encaissés</span>
            </h2>
          </div>

          {payments.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {payments.map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">
                      {PAYMENT_METHODS[payment.method] || payment.method}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(payment.date)}
                    </p>
                  </div>

                  <p className="font-black text-emerald-700">
                    +{formatCurrency(payment.amount)} FCFA
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-center text-xs text-slate-400">
              Aucun paiement antérieur.
            </p>
          )}
        </div>
      </div>

      {showPaymentModal && (
  <PaymentRecordModal
    customer={customer}
    onClose={() => setShowPaymentModal(false)}
    onSubmit={recordPayment}
  />
)}
    </div>
  );
}
