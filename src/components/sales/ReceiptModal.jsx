
import {
  X,
  Store,
  Receipt,
  Printer,
  CheckCircle2,
  CalendarDays,
  Banknote,
} from "lucide-react";

// Formater les montants en FCFA
const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function ReceiptModal({
  isOpen,
  onClose,
  sale = {},
  shopName = "Ma boutique",
}) {
  // Ne rien afficher si la fenêtre est fermée
  if (!isOpen) return null;

  // Informations de la vente
  const products = sale.products || sale.items || [];
  const totalAmount = Number(sale.totalAmount ?? sale.total ?? 0);
  const receivedAmount = Number(sale.receivedAmount ?? totalAmount);
  const changeAmount = Number(
    sale.changeAmount ?? Math.max(receivedAmount - totalAmount, 0)
  );

  const receiptNumber =
    sale.receiptNumber || sale.reference || `VND-${Date.now()}`;

  const saleDate = sale.date
    ? new Date(sale.date)
    : new Date();

  // Imprimer le reçu
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">

      {/* Fenêtre du reçu */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le reçu"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 print:hidden"
        >
          <X size={21} />
        </button>

        {/* Contenu imprimable */}
        <div id="receipt-content" className="p-6 sm:p-8">

          {/* En-tête */}
          <div className="text-center">

            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
              <Store size={28} />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {shopName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Reçu de vente
            </p>

            <div className="my-5 flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 size={19} />
              <span className="text-sm font-semibold">
                Vente enregistrée
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-4">

            {/* Informations du reçu */}
            <div className="mb-5 space-y-2 text-sm">

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">
                  N° du reçu
                </span>

                <span className="font-semibold text-slate-800">
                  {receiptNumber}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-500">
                  <CalendarDays size={15} />
                  Date
                </span>

                <span className="font-medium text-slate-800">
                  {saleDate.toLocaleDateString("fr-FR")}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">
                  Heure
                </span>

                <span className="font-medium text-slate-800">
                  {saleDate.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {sale.customerName && (
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Client
                  </span>

                  <span className="font-medium text-slate-800">
                    {sale.customerName}
                  </span>
                </div>
              )}
            </div>

            {/* Liste des produits */}
            <div className="border-t border-slate-200 pt-4">

              <div className="mb-3 flex items-center gap-2">
                <Receipt size={18} className="text-blue-800" />

                <h3 className="font-bold text-slate-900">
                  Détails des achats
                </h3>
              </div>

              {products.length > 0 ? (
                <div className="space-y-3">

                  {products.map((product, index) => {
                    const quantity = Number(product.quantity) || 0;

                    const unitPrice = Number(
                      product.price ?? product.unitPrice ?? 0
                    );

                    const subtotal =
                      Number(product.subtotal) ||
                      unitPrice * quantity;

                    return (
                      <div
                        key={product.id || index}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">
                            {product.name || product.productName || "Produit"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {quantity} × {formatPrice(unitPrice)}
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold text-slate-800">
                          {formatPrice(subtotal)}
                        </p>
                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-400">
                  Aucun produit renseigné.
                </p>
              )}
            </div>

            {/* Résumé du paiement */}
            <div className="mt-5 space-y-3 border-t border-dashed border-slate-300 pt-4">

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Total des achats
                </span>

                <span className="font-bold text-slate-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <Banknote size={16} />
                  Montant reçu
                </span>

                <span className="font-medium text-slate-800">
                  {formatPrice(receivedAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Monnaie rendue
                </span>

                <span className="font-semibold text-green-700">
                  {formatPrice(changeAmount)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <span className="font-bold text-blue-900">
                  TOTAL PAYÉ
                </span>

                <span className="text-xl font-extrabold text-blue-800">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Pied du reçu */}
          <div className="mt-6 border-t border-dashed border-slate-300 pt-5 text-center">

            <p className="font-semibold text-slate-800">
              Merci pour votre achat !
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Votre satisfaction est notre priorité.
            </p>

            <p className="mt-4 text-xs font-bold tracking-widest text-blue-800">
              POWERED BY VENDIX
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-5 print:hidden">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-800 px-4 py-3 font-semibold text-white transition hover:bg-blue-900"
          >
            <Printer size={18} />
            Imprimer
          </button>

        </div>
      </div>

      {/* Styles spécifiques à l'impression */}
      <style>{`
        @media print {
          @page {
            margin: 10mm;
          }

          body * {
            visibility: hidden;
          }

          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }

          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
