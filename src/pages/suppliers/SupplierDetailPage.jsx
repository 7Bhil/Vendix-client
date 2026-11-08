import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  ReceiptText,
  Calendar,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  loadSuppliers,
  saveSuppliers,
} from '../../utils/supplierUtils.js';
import SupplierPaymentModal from '../../components/suppliers/SupplierPaymentModal.jsx';

export default function SupplierDetailPage() {
  const { id } = useParams();
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const supplier = suppliers.find((s) => s.id === id);

  if (!supplier) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Truck size={36} className="mx-auto text-slate-300" />
          <h1 className="mt-3 text-lg font-bold text-slate-900">Fournisseur introuvable</h1>
          <p className="mt-1 text-xs text-slate-500">
            Cette fiche fournisseur n'existe pas dans vos données.
          </p>
          <Link
            to="/app/suppliers"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-vendix-brand hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Retour aux fournisseurs</span>
          </Link>
        </section>
      </div>
    );
  }

  const hasDebt = (supplier.currentDebt || 0) > 0;

  const handleRecordPayment = (paymentData) => {
    const updated = suppliers.map((s) => {
      if (s.id !== supplier.id) return s;

      const newDebt = Math.max(0, (s.currentDebt || 0) - paymentData.amount);
      const newPaid = (s.totalPaid || 0) + paymentData.amount;
      const newStatementEntry = {
        id: `reg-${Date.now()}`,
        date: paymentData.date,
        type: 'REGLEMENT_FOURNISSEUR',
        ref: `REG-${Date.now().toString().slice(-4)}`,
        totalCost: 0,
        amountPaid: paymentData.amount,
        debtAmount: newDebt,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes,
      };

      return {
        ...s,
        currentDebt: newDebt,
        totalPaid: newPaid,
        statement: [newStatementEntry, ...(s.statement || [])],
      };
    });

    setSuppliers(updated);
    saveSuppliers(updated);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Retour et En-tête */}
      <div>
        <Link
          to="/app/suppliers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Retour au carnet fournisseurs</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-vendix-brand">
              <Truck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {supplier.fullName}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    hasDebt
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {hasDebt ? 'Dette en cours' : 'Compte soldé'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {supplier.companyName || 'Partenaire grossiste'}
              </p>
            </div>
          </div>

          {hasDebt && (
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-900"
            >
              <CreditCard size={15} />
              <span>Régler la dette</span>
            </button>
          )}
        </div>
      </div>

      {/* Cartes financières */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Dette restante</p>
          <p
            className={`mt-1.5 text-xl font-black sm:text-2xl ${
              hasDebt ? 'text-amber-800' : 'text-emerald-700'
            }`}
          >
            {formatCurrency(supplier.currentDebt)}{' '}
            <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Montant à régler au grossiste</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total payé</p>
          <p className="mt-1.5 text-xl font-black text-slate-900 sm:text-2xl">
            {formatCurrency(supplier.totalPaid)}{' '}
            <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Cumul des règlements effectués</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Volume total d'approvisionnement</p>
          <p className="mt-1.5 text-xl font-black text-slate-900 sm:text-2xl">
            {formatCurrency(supplier.totalPurchases)}{' '}
            <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Historique complet des commandes</p>
        </div>
      </div>

      {/* Coordonnées & Historique */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Informations de contact
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone size={15} className="text-slate-400 shrink-0" />
              <a href={`tel:${supplier.phone}`} className="font-semibold text-vendix-brand hover:underline">
                {supplier.phone}
              </a>
            </div>

            {supplier.address && (
              <div className="flex items-center gap-2.5 text-slate-700">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                <span>{supplier.address}</span>
              </div>
            )}

            {supplier.companyName && (
              <div className="flex items-center gap-2.5 text-slate-700">
                <Building2 size={15} className="text-slate-400 shrink-0" />
                <span>Raison sociale : {supplier.companyName}</span>
              </div>
            )}
          </div>

          {supplier.notes && (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/60">
              <p className="font-bold text-slate-700 mb-0.5">Notes internes</p>
              <p>{supplier.notes}</p>
            </div>
          )}
        </div>

        {/* Historique des achats et règlements */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900">
              Historique des approvisionnements & règlements
            </h2>
            <p className="text-xs text-slate-500">
              Traçabilité des bons de commande et des versements.
            </p>
          </div>

          {!supplier.statement || supplier.statement.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Aucune opération enregistrée pour ce fournisseur.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {supplier.statement.map((entry) => {
                const isPayment = entry.type === 'REGLEMENT_FOURNISSEUR';
                return (
                  <div key={entry.id || entry.ref} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                            isPayment ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-vendix-brand'
                          }`}
                        >
                          {isPayment ? <CreditCard size={13} /> : <ReceiptText size={13} />}
                        </span>
                        <p className="font-bold text-slate-900">
                          {isPayment ? 'Règlement effectué' : `Achat ${entry.ref}`}
                        </p>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-slate-400">
                        <Calendar size={12} />
                        <span>{formatDate(entry.date)}</span>
                        {entry.paymentMethod && <span>• {entry.paymentMethod}</span>}
                        {entry.notes && <span>• {entry.notes}</span>}
                      </p>
                    </div>

                    <div className="text-right">
                      {isPayment ? (
                        <p className="font-extrabold text-emerald-700">
                          - {formatCurrency(entry.amountPaid)} FCFA
                        </p>
                      ) : (
                        <div>
                          <p className="font-extrabold text-slate-900">
                            {formatCurrency(entry.totalCost)} FCFA
                          </p>
                          {entry.debtAmount > 0 && (
                            <p className="text-[11px] font-bold text-amber-800">
                              Dette : {formatCurrency(entry.debtAmount)} FCFA
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SupplierPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        supplier={supplier}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  );
}
