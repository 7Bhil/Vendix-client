import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBasket, Sparkles } from "lucide-react";
import { getProductTierPrice, getTierLabel } from "../../utils/pricingUtils";
import MoneyDisplay from "../ui/MoneyDisplay";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function CartSheet({
  cart = [],
  onUpdateQuantity,
  onRemoveProduct,
  onClearCart,
  onContinue,
}) {
  const [confirmClear, setConfirmClear] = useState(false);

  const totalAmount = cart.reduce((total, item) => {
    const { unitPrice } = getProductTierPrice(item, item.quantity);
    return total + unitPrice * Number(item.quantity);
  }, 0);

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    onClearCart?.();
  };

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* En-tête du panier */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ShoppingBasket size={19} className="text-vendix-brand" />
            Panier en cours
          </h2>
          <p className="text-xs text-slate-500">
            {totalItems} article{totalItems > 1 ? "s" : ""} sélectionné{totalItems > 1 ? "s" : ""}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              confirmClear
                ? "bg-red-50 text-red-700 ring-1 ring-red-300"
                : "text-slate-500 hover:text-red-600 hover:bg-slate-50"
            }`}
          >
            {confirmClear ? "Confirmer ?" : "Vider"}
          </button>
        )}
      </div>

      {/* Contenu du panier */}
      <div className="max-h-96 space-y-3 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <ShoppingBasket size={36} className="mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Le panier est vide</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Touchez un produit dans le catalogue pour l'ajouter.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const { unitPrice, activeTier } = getProductTierPrice(item, item.quantity);
            const lineSubtotal = unitPrice * Number(item.quantity);

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
              >
                {/* Informations du produit */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                        {item.name}
                      </h3>
                      {activeTier && (
                        <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Sparkles size={10} />
                          {getTierLabel(activeTier)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                      aria-label={`Supprimer ${item.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    {formatPrice(unitPrice)} / {item.baseUnit || "unité"}
                    {activeTier && (
                      <span className="ml-1 text-[11px] line-through text-slate-400">
                        {formatPrice(item.salePrice)}
                      </span>
                    )}
                  </p>

                  {/* Contrôle de quantité */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, Number(item.quantity) - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={13} />
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            onUpdateQuantity(item.id, val);
                          }
                        }}
                        className="h-7 w-12 rounded-lg border border-slate-200 text-center text-xs font-bold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                      />

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, Number(item.quantity) + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 btn-press"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <MoneyDisplay amount={lineSubtotal} size="sm" className="text-slate-900 font-extrabold" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pied du panier */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Total à payer</span>
          <MoneyDisplay amount={totalAmount} size="lg" className="text-emerald-700 font-black" />
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={cart.length === 0}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Encaisser la vente
        </button>
      </div>
    </section>
  );
}
