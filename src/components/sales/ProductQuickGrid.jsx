import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Package,
  ShoppingBasket,
} from "lucide-react";

import productsData from "../../mocks/modules/products.json";

// Formater les prix en FCFA
const formatPrice = (price) => {
  return new Intl.NumberFormat("fr-FR").format(price || 0) + " FCFA";
};

export default function ProductQuickGrid({
  products = productsData.products,
  onAddProduct,
}) {
  // Catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Texte saisi dans la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les catégories du fichier JSON
  const categories = [
    { id: "all", name: "Tous" },
    ...productsData.categories,
  ];

  // Filtrer les produits selon la catégorie et la recherche
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.categoryId === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Ajouter un produit au panier
  const handleAddProduct = (product) => {
    if (onAddProduct) {
      onAddProduct(product);
    }
  };

  return (
    <section className="w-full space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Produits
          </h2>

          <p className="text-sm text-slate-500">
            Sélectionnez un produit pour l'ajouter au panier.
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Package size={17} />
          <span>{filteredProducts.length} produits</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Rechercher un produit..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`h-12 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Grille des produits : 2 colonnes sur mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Image du produit */}
              <div className="relative h-28 bg-slate-100">
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
              </div>

              {/* Informations du produit */}
              <div className="space-y-2 p-3">
                <h3 className="min-h-10 text-sm font-semibold leading-5 text-slate-800">
                  {product.name}
                </h3>

                <p className="text-base font-bold text-blue-700">
                  {formatPrice(product.salePrice)}
                </p>

                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs text-slate-500">
                    {product.baseUnit}
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      product.currentStock > 0
                        ? "text-green-700"
                        : "text-orange-600"
                    }`}
                  >
                    Stock : {product.currentStock}
                  </span>
                </div>

                {/* Bouton toujours actif, même si le stock est nul */}
                <button
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-2 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Message si aucun produit ne correspond */
        <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center">
          <ShoppingBasket
            size={35}
            className="mx-auto mb-3 text-slate-400"
          />

          <p className="font-semibold text-slate-700">
            Aucun produit trouvé
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Essayez une autre recherche ou catégorie.
          </p>
        </div>
      )}
    </section>
  );
}