
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

// Importation des composants de vente
import ProductQuickGrid from "../../components/sales/ProductQuickGrid";
import CartSheet from "../../components/sales/CartSheet";
import PaymentModal from "../../components/sales/PaymentModal";
import ChangeCalculator from "../../components/sales/ChangeCalculator";
import ReceiptModal from "../../components/sales/ReceiptModal";

// Formater les montants en FCFA
const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

export default function NewSalePage() {
  // Panier de la vente en cours
  const [cart, setCart] = useState([]);

  // Affichage de la fenêtre de paiement
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Affichage du reçu
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Informations de la vente terminée
  const [completedSale, setCompletedSale] = useState(null);

  // Monnaie calculée
  const [calculatedChange, setCalculatedChange] = useState(0);

  // Calcul automatique du total du panier
  const totalAmount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.salePrice) * Number(item.quantity),
      0
    );
  }, [cart]);

  // Calcul du nombre total d'articles
  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
  }, [cart]);

  // Ajouter un produit au panier
  const handleAddProduct = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Modifier la quantité d'un produit
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Supprimer un produit du panier
  const handleRemoveProduct = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  };

  // Vider le panier
  const handleClearCart = () => {
    setCart([]);
    setCalculatedChange(0);
  };

  // Ouvrir la fenêtre de paiement
  const handleContinue = () => {
    if (cart.length === 0) return;

    setIsPaymentOpen(true);
  };

  // Confirmer le paiement
  const handleConfirmPayment = (payment) => {
    const sale = {
      receiptNumber: `VND-${Date.now()}`,
      date: new Date().toISOString(),

      // Produits vendus
      products: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.salePrice),
        subtotal: Number(item.salePrice) * item.quantity,
      })),

      // Informations financières
      totalAmount,
      receivedAmount: payment.paidAmount,
      changeAmount: payment.changeAmount,
      remainingAmount: payment.remainingAmount,

      // Informations du paiement
      paymentMethod: payment.paymentMethod,
      status: payment.status,
    };

    setCompletedSale(sale);

    // Fermer le paiement et ouvrir le reçu
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
  };

  // Fermer le reçu et terminer le processus
  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setCompletedSale(null);
    setCart([]);
    setCalculatedChange(0);
  };

  // Réinitialiser la vente
  const handleResetSale = () => {
    setCart([]);
    setCalculatedChange(0);
    setIsPaymentOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* En-tête de la page */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-800">
                <ShoppingCart size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Nouvelle vente
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Enregistrez rapidement les achats de vos clients.
                </p>
              </div>
            </div>
          </div>

          {/* Informations du panier */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <ShoppingCart size={20} className="text-blue-700" />

            <div>
              <p className="text-xs text-slate-500">
                Articles sélectionnés
              </p>

              <p className="font-bold text-slate-900">
                {totalItems} article(s)
              </p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* Partie gauche : produits */}
          <div className="space-y-6 lg:col-span-2">

            <ProductQuickGrid
              onAddProduct={handleAddProduct}
            />

          </div>

          {/* Partie droite : panier */}
          <div className="space-y-5 lg:sticky lg:top-6">

            <CartSheet
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveProduct={handleRemoveProduct}
              onClearCart={handleClearCart}
              onContinue={handleContinue}
            />

            {/* Résumé de la vente */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="mb-4 font-bold text-slate-900">
                Résumé de la vente
              </h3>

              <div className="flex justify-between text-sm text-slate-500">
                <span>Nombre d'articles</span>
                <span className="font-semibold text-slate-800">
                  {totalItems}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="font-semibold text-slate-600">
                  Total
                </span>

                <span className="text-lg font-extrabold text-blue-800">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetSale}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <RotateCcw size={17} />
                  Annuler la vente
                </button>
              )}
            </div>

            {/* Calculateur de monnaie */}
            <ChangeCalculator
              totalAmount={totalAmount}
              onChangeCalculated={setCalculatedChange}
            />

          </div>
        </div>

        {/* Indication de la monnaie calculée */}
        {calculatedChange > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={19} />

            <span>
              Monnaie calculée : <strong>{formatPrice(calculatedChange)}</strong>
            </span>
          </div>
        )}

      </div>

      {/* Fenêtre de paiement */}
      <PaymentModal
        key={totalAmount}
        isOpen={isPaymentOpen}
        totalAmount={totalAmount}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {/* Fenêtre du reçu */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        sale={completedSale || {}}
        shopName="Ma boutique Vendix"
      />

    </div>
  );
}
