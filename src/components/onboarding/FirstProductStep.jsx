import { useState } from "react";
import { Package, DollarSign, Boxes, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function FirstProductStep({ initialData, onPrevious, onSubmit, isSubmitting }) {
  const [name, setName] = useState(initialData?.name || "");
  const [salePrice, setSalePrice] = useState(initialData?.salePrice || "");
  const [stockQuantity, setStockQuantity] = useState(initialData?.stockQuantity || "10");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Veuillez renseigner le nom de votre produit.");
      return;
    }

    const price = Number(salePrice);
    if (!salePrice || isNaN(price) || price <= 0) {
      setError("Veuillez renseigner un prix de vente valide supérieur à zéro.");
      return;
    }

    const qty = Number(stockQuantity);
    if (isNaN(qty) || qty < 0) {
      setError("Veuillez renseigner une quantité de stock valide.");
      return;
    }

    onSubmit({
      name: name.trim(),
      salePrice: price,
      stockQuantity: qty,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Nom du produit */}
      <div>
        <label htmlFor="productName" className="block text-xs font-bold text-vendix-ink">
          Nom de l'article <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Package size={18} aria-hidden="true" />
          </div>
          <input
            id="productName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Riz Parfumé 25kg ou Huile 5L"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Vous pourrez ajouter des photos et variantes ultérieurement.
        </p>
      </div>

      {/* Prix de vente en FCFA */}
      <div>
        <label htmlFor="salePrice" className="block text-xs font-bold text-vendix-ink">
          Prix de vente comptoir (FCFA) <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <DollarSign size={18} aria-hidden="true" />
          </div>
          <input
            id="salePrice"
            type="number"
            min="1"
            step="1"
            required
            inputMode="numeric"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="Ex : 12500"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Montant encaissé en espèces ou Mobile Money lors de la vente.
        </p>
      </div>

      {/* Quantité initiale en stock */}
      <div>
        <label htmlFor="stockQuantity" className="block text-xs font-bold text-vendix-ink">
          Quantité disponible en magasin <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Boxes size={18} aria-hidden="true" />
          </div>
          <input
            id="stockQuantity"
            type="number"
            min="0"
            step="1"
            required
            inputMode="numeric"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            placeholder="10"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Règle Vendix : vous pourrez toujours vendre même si le stock passe à zéro.
        </p>
      </div>

      {/* Actions : Retour et Validation finale */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Retour</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2 disabled:opacity-50"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{isSubmitting ? "Enregistrement..." : "Finaliser et ouvrir ma caisse"}</span>
        </button>
      </div>
    </form>
  );
}
