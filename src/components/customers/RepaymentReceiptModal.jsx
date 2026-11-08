import { useMemo } from 'react';
import {
  X,
  Store,
  Printer,
  CheckCircle2,
  CalendarDays,
  Banknote,
  Share2,
} from 'lucide-react';
import { formatCurrency, getStoreName } from '../../utils/customerDebtUtils.js';

const PAYMENT_METHODS = {
  ESPECE: 'Espèces',
  CASH: 'Espèces',
  MOBILE_MONEY: 'Mobile Money',
  MOMO: 'Mobile Money',
  VIREMENT: 'Virement',
  AUTRE: 'Autre',
};

export default function RepaymentReceiptModal({
  isOpen,
  onClose,
  customer = {},
  repayment = {},
}) {
  const shopName = getStoreName();
  const amount = Number(repayment.amount || 0);
  const remainingDebt = Number(
    repayment.remainingDebt !== undefined
      ? repayment.remainingDebt
      : customer.currentDebt ?? 0
  );
  const methodLabel =
    PAYMENT_METHODS[repayment.method || repayment.paymentMethod] ||
    repayment.method ||
    'Espèces';

  const dateFormatted = useMemo(() => {
    const d = repayment.date ? new Date(repayment.date) : new Date();
    return {
      date: d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [repayment.date]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');
    const message = `*REÇU DE REMBOURSEMENT - ${shopName}*\n\nClient : ${customer.fullName || ''}\nMontant remboursé : ${formatCurrency(amount)} FCFA\nMode : ${methodLabel}\nDate : ${dateFormatted.date} à ${dateFormatted.time}\nSolde restant dû : ${formatCurrency(remainingDebt)} FCFA\n\nMerci de votre confiance !`;
    const targetUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le reçu"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 print:hidden"
        >
          <X size={18} />
        </button>

        <div id="repayment-receipt-content" className="p-6">
          {/* En-tête */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Store size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900">{shopName}</h2>
            <p className="text-xs text-slate-500">Reçu officiel de remboursement</p>

            <div className="my-3 flex items-center justify-center gap-1.5 text-emerald-700">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Règlement validé
              </span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={14} />
              <span>
                {dateFormatted.date} à {dateFormatted.time}
              </span>
            </div>
          </div>

          {/* Informations client */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Client bénéficiaire
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {customer.fullName || 'Client'}
            </p>
            {customer.phone && (
              <p className="mt-0.5 text-slate-500">{customer.phone}</p>
            )}
          </div>

          {/* Détails du règlement */}
          <div className="mt-5 space-y-2 border-t border-dashed border-slate-300 pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Mode de règlement</span>
              <span className="font-bold text-slate-800">{methodLabel}</span>
            </div>
            {repayment.reference && (
              <div className="flex justify-between">
                <span className="text-slate-500">Référence</span>
                <span className="font-mono text-slate-700">{repayment.reference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Banknote size={13} /> Montant remboursé
              </span>
              <span className="font-bold text-emerald-700">
                +{formatCurrency(amount)} FCFA
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 p-3">
              <span className="text-xs font-black uppercase text-emerald-800">
                Montant encaissé
              </span>
              <span className="text-lg font-black text-emerald-800">
                {formatCurrency(amount)} FCFA
              </span>
            </div>

            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="font-bold text-slate-600">Nouveau solde restant dû</span>
              <span
                className={`font-black ${
                  remainingDebt > 0 ? 'text-amber-800' : 'text-emerald-700'
                }`}
              >
                {formatCurrency(remainingDebt)} FCFA
              </span>
            </div>
          </div>

          {/* Pied */}
          <div className="mt-5 border-t border-dashed border-slate-300 pt-4 text-center">
            <p className="text-xs font-bold text-slate-800">Merci de votre fidélité !</p>
            <p className="mt-2 text-[10px] font-black tracking-widest text-vendix-brand">
              POWERED BY VENDIX
            </p>
          </div>
        </div>

        {/* Boutons d'actions */}
        <div className="flex gap-2 border-t border-slate-100 bg-slate-50 p-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-white"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-vendix-brand py-2.5 text-xs font-bold text-white hover:bg-vendix-brand-dark"
          >
            <Printer size={15} />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          #repayment-receipt-content, #repayment-receipt-content * {
            visibility: visible;
          }
          #repayment-receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 76mm;
            max-width: 76mm;
            padding: 2mm !important;
            font-size: 11px !important;
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
