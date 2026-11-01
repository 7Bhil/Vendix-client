import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus, CheckCircle2 } from "lucide-react";
import productsData from "../../mocks/modules/products.json";
import { useToast } from "../../context/ToastContext";

export default function NewProductPage() {
  const navigate = useNavigate();
  const { success: toastSuccess } = useToast();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("cat-1");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [baseUnit, setBaseUnit] = useState("Sac");
  const [currentStock, setCurrentStock] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !salePrice) {
      setError("Le nom et le prix de vente sont obligatoires.");
      return;
    }

    try {
      const newProduct = {
        id: `p-${Date.now()}`,
        name: name.trim(),
        categoryId,
        salePrice: Number(salePrice),
        costPrice: Number(costPrice) || 0,
        baseUnit: baseUnit.trim() || "Unité",
        currentStock: Number(currentStock) || 0,
        isFavorite: false,
        isVisible: true,
      };

      const existing = JSON.parse(localStorage.getItem("vendix-custom-products") || "[]");
      localStorage.setItem("vendix-custom-products", JSON.stringify([newProduct, ...existing]));

      setSuccess(true);
      toastSuccess(`${newProduct.name} ajouté au catalogue`, "Produit créé");
      setTimeout(() => {
        navigate("/app/sales/new");
      }, 700);
    } catch (err) {
      setError("Erreur lors de l'enregistrement : " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
            aria-label="Retour"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Nouveau Produit
            </h1>
            <p className="text-xs text-slate-500">
              Ajoutez un article au catalogue avec ses tarifs et son stock.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              <CheckCircle2 size={16} />
              <span>Produit ajouté au catalogue ! Redirection...</span>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Désignation du produit *
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Riz Parfumé Royal 25kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            >
              {productsData.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prix de vente (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="Ex : 18500"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Coût d'achat (FCFA)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex : 16500"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Unité de référence
              </label>
              <input
                type="text"
                placeholder="Ex : Sac, Carton, Morceau"
                value={baseUnit}
                onChange={(e) => setBaseUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Stock initial disponible
              </label>
              <input
                type="number"
                placeholder="Ex : 20"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={success}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white transition hover:bg-vendix-brand-dark disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <PackagePlus size={16} />
            <span>Ajouter au catalogue</span>
          </button>
        </form>
      </div>
    </div>
  );
}
