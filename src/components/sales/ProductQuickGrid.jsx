import { useMemo, useState } from "react";
import {
  Search,
  Package,
  ShoppingBasket,
  Star,
  Plus,
} from "lucide-react";

import productsData from "../../mocks/modules/products.json";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function ProductQuickGrid({
  products = productsData.products,
  onAddProduct,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => [
    { id: "all", name: "Tous" },
    ...productsData.categories,
  ], []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (showFavoritesOnly && !product.isFavorite) {
        return false;
      }

      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, showFavoritesOnly, searchTerm]);

  return (
    <section className="w-full space-y-4">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Catalogue Produits</h2>
          <p className="text-sm text-slate-500">
            Touchez un produit pour l'ajouter directement à la vente.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Package size={16} />
          <span>{filteredProducts.length} référence(s)</span>
        </div>
      </div>

      {/* Barre de recherche et filtre favoris */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Rechercher un produit..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold transition ${
            showFavoritesOnly
              ? "border-amber-300 bg-amber-50 text-amber-800 ring-2 ring-amber-200"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
          aria-pressed={showFavoritesOnly}
        >
          <Star
            size={16}
            className={showFavoritesOnly ? "fill-amber-500 text-amber-500" : "text-slate-400"}
          />
          <span className="hidden sm:inline">Favoris</span>
        </button>
      </div>

      {/* Catégories défilantes */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id && !showFavoritesOnly;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.id);
                setShowFavoritesOnly(false);
              }}
              className={`h-9 shrink-0 rounded-xl px-3.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-vendix-brand text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Grille des produits : 2 colonnes adaptées mobile/desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredProducts.map((product) => {
            const hasStock = product.currentStock > 0;

            return (
              <article
                key={product.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image du produit */}
                <div className="relative h-28 bg-slate-100 sm:h-32">
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ShoppingBasket size={32} />
                    </div>
                  )}

                  {product.isFavorite && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-amber-500 shadow-sm">
                      <Star size={14} className="fill-amber-400" />
                    </span>
                  )}
                </div>

                {/* Détails du produit */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm font-extrabold text-vendix-brand">
                      {formatPrice(product.salePrice)}
                    </p>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{product.baseUnit}</span>
                      <span
                        className={`font-semibold ${
                          hasStock ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        Stock: {product.currentStock}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddProduct?.(product)}
                    className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-vendix-brand px-3 text-xs font-bold text-white transition hover:bg-vendix-brand-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
                  >
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center bg-white">
          <ShoppingBasket size={36} className="mx-auto mb-3 text-slate-400" />
          <p className="font-bold text-slate-800">Aucun produit trouvé</p>
          <p className="mt-1 text-xs text-slate-500">
            Modifiez votre recherche ou réinitialisez les filtres.
          </p>
        </div>
      )}
    </section>
  );
}
