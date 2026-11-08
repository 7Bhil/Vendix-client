import { useEffect, useMemo, useState } from "react";
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
import { salesService } from "../../api/services.js";

const CART_STORAGE_KEY = "vendix_pos_active_cart";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function NewSalePage() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const { success } = useToast();

  // Persistance du panier local
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      // Ignoré si indisponible
    }
  }, [cart]);

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
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignoré
    }
  };

  const handleConfirmPayment = async (payment) => {
    // Mapping strict selon le contrat Prisma / Backend (PaymentMethod: CASH, MOMO, CREDIT, SPLIT)
    let mappedPaymentMethod = 'CASH';
    const methodUpper = String(payment.paymentMethod || '').toUpperCase();
    if (methodUpper === 'MOMO' || methodUpper === 'MOBILE_MONEY') {
      mappedPaymentMethod = 'MOMO';
    } else if (methodUpper === 'CREDIT') {
      mappedPaymentMethod = 'CREDIT';
    } else if (methodUpper === 'SPLIT') {
      mappedPaymentMethod = 'SPLIT';
    } else {
      mappedPaymentMethod = 'CASH';
    }

    // Clé d'idempotence stricte UUID v4
    const clientOpUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `op-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const salePayload = {
      amount_paid: Number(payment.paidAmount) || 0,
      payment_method: mappedPaymentMethod,
      customer_id: payment.customerId || undefined,
      client_op_uuid: clientOpUuid,
      lines: cart.map((item) => {
        const { unitPrice, activeTier } = getProductTierPrice(item, item.quantity);
        return {
          product_id: item.id,
          quantity: Number(item.quantity),
          unit_label: activeTier?.unit || item.unit || 'Pièce',
          conversion_factor: Number(activeTier?.conversionFactor) || 1,
          unit_price: Math.round(Number(unitPrice)),
        };
      }),
    };

    let serverSale = null;
    try {
      serverSale = await salesService.create(salePayload);
    } catch (err) {
      console.warn('Vente enregistrée en local (mode dégradé):', err?.message);
    }

    const receiptNumber = serverSale?.reference || `VND-${Date.now()}`;

    const sale = {
      id: serverSale?.id || `sale_${Date.now()}`,
      receiptNumber,
      client_op_uuid: clientOpUuid,
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
      paymentMethod: mappedPaymentMethod,
      customerId: payment.customerId,
      customerName: payment.customerName,
      status: payment.status,
    };

    try {
      const existingSales = JSON.parse(localStorage.getItem('vendix-custom-sales') || '[]');
      localStorage.setItem('vendix-custom-sales', JSON.stringify([sale, ...existingSales]));
    } catch {
      // Ignoré si indisponible
    }

    setCompletedSale(sale);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
    success(`Vente enregistrée avec succès (${sale.receiptNumber})`, "Encaissement réussi");
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setCompletedSale(null);
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignoré
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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
