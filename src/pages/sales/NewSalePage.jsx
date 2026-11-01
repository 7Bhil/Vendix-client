import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import ProductQuickGrid from "../../components/sales/ProductQuickGrid";
import CartSheet from "../../components/sales/CartSheet";
import PaymentModal from "../../components/sales/PaymentModal";
import ReceiptModal from "../../components/sales/ReceiptModal";
import { getProductTierPrice } from "../../utils/pricingUtils";
import { useToast } from "../../context/ToastContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function NewSalePage() {
  const [cart, setCart] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const { success } = useToast();

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => {
      const { unitPrice } = getProductTierPrice(item, item.quantity);
      return total + unitPrice * Number(item.quantity);
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.quantity), 0);
  }, [cart]);

  const handleAddProduct = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    success(`${product.name} ajouté au panier`, "Panier mis à jour");
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleConfirmPayment = (payment) => {
    const sale = {
      receiptNumber: `VND-${Date.now()}`,
      date: new Date().toISOString(),
      products: cart.map((item) => {
        const { unitPrice, activeTier } = getProductTierPrice(item, item.quantity);
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: unitPrice,
          activeTier,
          subtotal: unitPrice * item.quantity,
        };
      }),
      totalAmount,
      receivedAmount: payment.paidAmount,
      changeAmount: payment.changeAmount,
      remainingAmount: payment.remainingAmount,
      paymentMethod: payment.paymentMethod,
      customerId: payment.customerId,
      customerName: payment.customerName,
      status: payment.status,
    };

    setCompletedSale(sale);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
    success(`Vente enregistrée avec succès (${sale.receiptNumber})`, "Encaissement réussi");
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setCompletedSale(null);
    setCart([]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/app/dashboard"
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
              aria-label="Retour au tableau de bord"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Caisse & Nouvelle Vente
              </h1>
              <p className="text-xs text-slate-500">
                Enregistrez rapidement les achats et réglez les paiements comptants ou à crédit.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm text-xs font-bold text-slate-700">
            <ShoppingCart size={17} className="text-vendix-brand" />
            <span>{totalItems} article(s) • {formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Produits à gauche */}
          <div className="space-y-6 lg:col-span-2">
            <ProductQuickGrid onAddProduct={handleAddProduct} />
          </div>

          {/* Panier desktop à droite */}
          <div className="hidden lg:block space-y-5 lg:sticky lg:top-6">
            <CartSheet
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveProduct={handleRemoveProduct}
              onClearCart={handleClearCart}
              onContinue={() => setIsPaymentOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Barre flottante mobile d'encaissement rapide */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-3 lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-vendix-brand p-3.5 text-white shadow-xl ring-2 ring-white/20">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-blue-200">
                Panier ({totalItems} art.)
              </p>
              <p className="truncate text-base font-black">
                {formatPrice(totalAmount)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-vendix-brand shadow-sm transition active:scale-95"
            >
              <ShoppingBag size={15} />
              <span>Encaisser</span>
            </button>
          </div>
        </div>
      )}

      {/* Modale de Paiement */}
      <PaymentModal
        key={totalAmount}
        isOpen={isPaymentOpen}
        totalAmount={totalAmount}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {/* Modale de Reçu */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        sale={completedSale || {}}
      />
    </div>
  );
}
