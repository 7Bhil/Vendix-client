import {
  Minus,
  Plus,
  Trash2,
  ShoppingBasket,
  X,
} from "lucide-react";

// Formater les montants en FCFA
const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";

export default function CartSheet({
  cart = [],
  onUpdateQuantity,
  onRemoveProduct,
  onClearCart,
  onContinue,
}) {
  // Calcul du montant total du panier
  const totalAmount = cart.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );

  // Calcul du nombre total d'articles
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* En-tête du panier */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingBasket size={21} />
            Panier
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {totalItems} article(s)
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Vider
          </button>
        )}
      </div>

      {/* Contenu du panier */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">

        {cart.length === 0 ? (
          // Message affiché lorsque le panier est vide
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <ShoppingBasket size={42} className="mb-3 text-slate-300" />

            <p className="font-semibold text-slate-700">
              Votre panier est vide
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Ajoutez des produits pour commencer une vente.
            </p>
          </div>
        ) : (
          // Affichage de chaque produit ajouté
          cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-b border-slate-100 pb-4"
            >
              {/* Image du produit */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBasket className="text-slate-400" />
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatPrice(item.salePrice)} / unité
                    </p>
                  </div>

                  {/* Supprimer le produit */}
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(item.id)}
                    className="h-fit text-slate-400 hover:text-red-600"
                    aria-label={`Supprimer ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {/* Quantité et prix total de la ligne */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-5 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {formatPrice(item.salePrice * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pied du panier : total et bouton de validation */}
      <div className="border-t border-slate-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-slate-600">
            Total à payer
          </span>

          <span className="text-xl font-extrabold text-blue-800">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={cart.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continuer vers le paiement
        </button>
      </div>
    </section>
  );
}
