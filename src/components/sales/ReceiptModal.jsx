import { useEffect, useMemo, useState } from "react";
import {
  X,
  Store,
  Receipt,
  Printer,
  CheckCircle2,
  CalendarDays,
  Banknote,
  Share2,
} from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

const RECEIPT_FORMAT_KEY = "vendix_receipt_paper_format";
const AUTO_PRINT_KEY = "vendix_receipt_auto_print";

export default function ReceiptModal({
  isOpen,
  onClose,
  sale = {},
  shopName = "Ma boutique Vendix",
  autoPrintEnabled = false,
}) {
  // Format de papier : '58mm' ou '80mm'
  const [paperFormat, setPaperFormat] = useState(() => {
    try {
      return localStorage.getItem(RECEIPT_FORMAT_KEY) || "80mm";
    } catch {
      return "80mm";
    }
  });

  const [autoPrint, setAutoPrint] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTO_PRINT_KEY);
      return stored !== null ? stored === "true" : autoPrintEnabled;
    } catch {
      return autoPrintEnabled;
    }
  });

  const handleFormatChange = (format) => {
    setPaperFormat(format);
    try {
      localStorage.setItem(RECEIPT_FORMAT_KEY, format);
    } catch {
      // Ignoré
    }
  };

  const handleToggleAutoPrint = () => {
    const nextVal = !autoPrint;
    setAutoPrint(nextVal);
    try {
      localStorage.setItem(AUTO_PRINT_KEY, String(nextVal));
    } catch {
      // Ignoré
    }
  };

  const products = useMemo(() => sale.products || sale.items || sale.lines || [], [sale]);
  const totalAmount = Number(sale.totalAmount ?? sale.total ?? 0);
  const receivedAmount = Number(sale.receivedAmount ?? sale.paidAmount ?? totalAmount);
  const changeAmount = Number(
    sale.changeAmount ?? Math.max(receivedAmount - totalAmount, 0)
  );
  const balanceDue = Number(sale.remainingAmount ?? sale.balanceDue ?? 0);

  const saleDateFormatted = useMemo(() => {
    const d = sale.date ? new Date(sale.date) : new Date();
    return {
      date: d.toLocaleDateString("fr-FR"),
      time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
  }, [sale.date]);

  // Déclenchement automatique de l'impression si activé
  useEffect(() => {
    if (isOpen && autoPrint && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPrint]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Reçu ${sale.receiptNumber || "VENDIX"}\nBoutique: ${shopName}\nTotal: ${formatPrice(
        totalAmount
      )}\nPayé: ${formatPrice(receivedAmount)}${
        balanceDue > 0 ? `\nReste dû: ${formatPrice(balanceDue)}` : ""
      }\nMerci pour votre achat !`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le reçu"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 print:hidden"
        >
          <X size={18} />
        </button>

        {/* Contrôles du format et options d'impression */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 text-xs print:hidden">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Format papier :</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => handleFormatChange("58mm")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  paperFormat === "58mm"
                    ? "bg-vendix-brand text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                58 mm
              </button>
              <button
                type="button"
                onClick={() => handleFormatChange("80mm")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  paperFormat === "80mm"
                    ? "bg-vendix-brand text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                80 mm
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600 select-none">
            <input
              type="checkbox"
              checked={autoPrint}
              onChange={handleToggleAutoPrint}
              className="h-3.5 w-3.5 rounded border-slate-300 text-vendix-brand focus:ring-vendix-brand"
            />
            <span className="text-[11px]">Auto-impression</span>
          </label>
        </div>

        <div
          id="receipt-content"
          className={`p-6 receipt-print-${paperFormat}`}
        >
          {/* En-tête */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-vendix-brand">
              <Store size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900">{shopName}</h2>
            <p className="text-xs text-slate-500">Reçu de vente officiel</p>

            <div className="my-3 flex items-center justify-center gap-1.5 text-emerald-700">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Vente validée
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-3">
            {/* Détails méta */}
            <div className="mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">N° Référence</span>
                <span className="font-bold text-slate-900">
                  {sale.receiptNumber || sale.reference || "VND-LOCAL"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-500">
                  <CalendarDays size={13} /> Date & Heure
                </span>
                <span className="font-medium text-slate-800">
                  {saleDateFormatted.date} à {saleDateFormatted.time}
                </span>
              </div>
              {sale.customerName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Client</span>
                  <span className="font-bold text-vendix-brand">
                    {sale.customerName}
                  </span>
                </div>
              )}
            </div>

            {/* Articles */}
            <div className="border-t border-slate-200 pt-3">
              <div className="mb-2 flex items-center gap-1 text-xs font-bold text-slate-900">
                <Receipt size={14} className="text-vendix-brand" />
                <span>Articles achetés</span>
              </div>

              <div className="space-y-2">
                {products.map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name || item.productName}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} × {formatPrice(item.price || item.unitPriceApplied)}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatPrice(
                        Number(item.subtotal || item.total) ||
                          Number(item.price || item.unitPriceApplied) * Number(item.quantity)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Montants */}
            <div className="mt-4 space-y-1.5 border-t border-dashed border-slate-300 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total net</span>
                <span className="font-bold text-slate-900">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-slate-500">
                  <Banknote size={13} /> Montant versé
                </span>
                <span className="font-bold text-slate-900">{formatPrice(receivedAmount)}</span>
              </div>
              {balanceDue > 0 ? (
                <div className="flex justify-between text-amber-800">
                  <span className="font-bold">Solde restant dû</span>
                  <span className="font-black">{formatPrice(balanceDue)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-800">
                  <span className="font-medium">Monnaie rendue</span>
                  <span className="font-bold">{formatPrice(changeAmount)}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 p-3">
                <span className="text-xs font-black uppercase text-vendix-brand">
                  Total payé
                </span>
                <span className="text-lg font-black text-vendix-brand">
                  {formatPrice(receivedAmount)}
                </span>
              </div>
            </div>

            {/* Pied */}
            <div className="mt-4 border-t border-dashed border-slate-300 pt-3 text-center">
              <p className="text-xs font-bold text-slate-800">Merci de votre confiance !</p>
              <p className="mt-2 text-[10px] font-black tracking-widest text-vendix-brand">
                POWERED BY VENDIX
              </p>
            </div>
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
            size: ${paperFormat === "58mm" ? "58mm auto" : "80mm auto"};
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
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: ${paperFormat === "58mm" ? "54mm" : "76mm"};
            max-width: ${paperFormat === "58mm" ? "54mm" : "76mm"};
            padding: 2mm !important;
            font-size: ${paperFormat === "58mm" ? "9.5px" : "11px"} !important;
            line-height: ${paperFormat === "58mm" ? "1.25" : "1.35"} !important;
            color: #000 !important;
          }
          .receipt-print-58mm h2 {
            font-size: 13px !important;
          }
          .receipt-print-58mm .text-xs {
            font-size: 9px !important;
          }
          .receipt-print-58mm .text-lg {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}
