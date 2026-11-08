import { useEffect, useState } from 'react';
import { X, ArrowDownToLine, TrendingDown, PackageX } from 'lucide-react';

export default function StockMovementModal({
  products = [],
  onClose,
  onSubmit,
  isLoading = false,
}) {
  // Type de mouvement sélectionné
  const [type, setType] = useState('ENTRY');

  // Produit concerné
  const [productId, setProductId] = useState('');

  // Quantité à enregistrer
  const [quantity, setQuantity] = useState('');

  // Motif du mouvement
  const [reason, setReason] = useState('');

  // Date du mouvement
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Message d'erreur
  const [error, setError] = useState('');

  // Fermer le modal avec la touche Escape
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [onClose]);

    // Valider et transmettre le mouvement de stock
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    // Verifier le produit selectionne
    if (!productId) {
      setError('Veuillez selectionner un produit.');
      return;
    }

    // Verifier la quantite
    const parsedQuantity = Number(quantity);

    if (!quantity || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError('La quantite doit etre superieure a zero.');
      return;
    }

    // Limiter la precision a trois decimales
    const decimalPart = quantity.split('.')[1] || '';

    if (decimalPart.length > 3) {
      setError('La quantite ne peut pas depasser trois decimales.');
      return;
    }

    // Le motif est obligatoire pour les pertes et les casses
    if (type !== 'ENTRY' && !reason.trim()) {
      setError('Veuillez preciser le motif du mouvement.');
      return;
    }

  // Vérifier que le produit existe
const selectedProduct = products.find(
  (product) => String(product.id) === String(productId)
);

if (!selectedProduct) {
  setError('Produit introuvable.');
  return;
}

// Empêcher une sortie supérieure au stock disponible
if (type !== 'ENTRY') {
  const availableStock = Number(selectedProduct.currentStock) || 0;

  if (parsedQuantity > availableStock) {
    setError(
      `Stock insuffisant. Quantité disponible : ${availableStock} ${selectedProduct.baseUnit || ''}.`
    );
    return;
  }
}

// Déterminer le signe de la quantité
const signedQuantity =
  type === 'ENTRY' ? parsedQuantity : -parsedQuantity;

    // Transmettre les donnees au composant parent
    onSubmit({
      type,
      productId,
      quantity: parsedQuantity,
      signedQuantity,
      reason: reason.trim(),
      date,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        {/* En-tête du modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="stock-modal-title"
              className="text-lg font-extrabold text-slate-900"
            >
              Nouveau mouvement de stock
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enregistrez une entrée, une perte ou une casse.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulaire de mouvement */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto px-5 py-5"
        >
          {/* Choix du type de mouvement */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Type de mouvement
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('ENTRY');
                  setError('');
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  type === 'ENTRY'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowDownToLine size={20} />
                Entrée
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('LOSS');
                  setError('');
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  type === 'LOSS'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrendingDown size={20} />
                Perte
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('DAMAGE');
                  setError('');
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  type === 'DAMAGE'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PackageX size={20} />
                Casse
              </button>
            </div>
          </div>

          {/* Sélection du produit */}
          <div>
            <label
              htmlFor="stock-product"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Produit concerné
            </label>

            <select
              id="stock-product"
              value={productId}
              onChange={(event) => {
                setProductId(event.target.value);
                setError('');
              }}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Sélectionner un produit</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — Stock : {product.currentStock}{' '}
                  {product.baseUnit || ''}
                </option>
              ))}
            </select>
          </div>

          {/* Quantité */}
          <div>
            <label
              htmlFor="stock-quantity"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Quantité
            </label>

            <input
              id="stock-quantity"
              type="number"
              min="0.001"
              step="0.001"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                setError('');
              }}
              required
              placeholder="Ex. : 2.500"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              Jusqu'à trois chiffres après la virgule.
            </p>
          </div>

          {/* Motif du mouvement */}
          <div>
            <label
              htmlFor="stock-reason"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Motif du mouvement
              {type !== 'ENTRY' && (
                <span className="ml-1 text-rose-500">*</span>
              )}
              {type === 'ENTRY' && (
                <span className="ml-1 font-normal text-slate-400">
                  (facultatif)
                </span>
              )}
            </label>

            <textarea
              id="stock-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setError('');
              }}
              required={type !== 'ENTRY'}
              rows={3}
              placeholder={
                type === 'ENTRY'
                  ? 'Ex. : Réapprovisionnement auprès du fournisseur...'
                  : type === 'LOSS'
                    ? 'Ex. : Produit perdu pendant le transport...'
                    : 'Ex. : Produit endommagé...'
              }
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Date du mouvement */}
          <div>
            <label
              htmlFor="stock-date"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Date du mouvement
            </label>

            <input
              id="stock-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {error}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={products.length === 0 || isLoading}
              className="rounded-xl bg-vendix-brand px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer le mouvement'}
            </button>
          </div>
        </form>


      </section>
    </div>
  );
}