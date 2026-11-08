import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  ShoppingBasket,
  Star,
  Plus,
} from "lucide-react";

import MoneyDisplay from "../ui/MoneyDisplay";
import Badge from "../ui/Badge";
import { productsService, categoriesService } from "../../api/services.js";

export default function ProductQuickGrid({
  products: initialProducts,
  onAddProduct,
}) {
  const [internalProducts, setInternalProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState([{ id: "all", name: "Tous" }]);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Synchronisation si la prop initialProducts change
  useEffect(() => {
    if (initialProducts) {
      setInternalProducts(initialProducts);
      setIsLoading(false);
    }
  }, [initialProducts]);

  // Chargement depuis productsService et categoriesService si aucune prop products n'est passée
  useEffect(() => {
    if (initialProducts) return;

    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      productsService.getAll(),
      categoriesService.getAll(),
    ]).then(([apiProds, apiCats]) => {
      if (!isMounted) return;

      if (apiCats.status === "fulfilled" && Array.isArray(apiCats.value)) {
        setCategories([
          { id: "all", name: "Tous" },
          ...apiCats.value.map((c) => ({ id: c.id, name: c.name })),
        ]);
      }

      if (apiProds.status === "fulfilled" && Array.isArray(apiProds.value)) {
        const mapped = apiProds.value.map((p) => {
          const baseUnitObj = (p.product_units || []).find((u) => u.is_base_unit) || (p.product_units || [])[0];
          const baseRetailPrice = Number(baseUnitObj?.retail_price ?? 0);
          
          // Construction unifiée des priceTiers :
          // 1. Remise de gros configurée sur l'unité de base si wholesale_price existe
          // 2. Unités secondaires avec leur minQuantity dérivé du facteur de conversion et leur prix unitaire
          const tiers = [];
          
          (p.product_units || []).forEach((u) => {
            const factor = Math.max(1, Math.round(Number(u.conversion_factor) || 1));
            const retailP = Number(u.retail_price ?? baseRetailPrice);
            const unitEquivalentPrice = factor > 1 ? Math.round(retailP / factor) : retailP;

            // Si c'est l'unité de base avec un wholesale_price avantageux
            if (u.is_base_unit && u.wholesale_price && Number(u.wholesale_price) < baseRetailPrice) {
              tiers.push({
                id: `${u.id}-wholesale`,
                tier: 'gros',
                name: `Gros (${u.label})`,
                unit: u.label,
                minQuantity: 10,
                price: Number(u.wholesale_price),
                conversionFactor: 1,
              });
            }

            // Si unité de conditionnement supérieure (carton, pack, sac...)
            if (factor > 1 && unitEquivalentPrice < baseRetailPrice) {
              tiers.push({
                id: u.id,
                tier: factor >= 10 ? 'gros' : 'demi_gros',
                name: u.label,
                unit: u.label,
                minQuantity: factor,
                price: unitEquivalentPrice,
                salePrice: retailP,
                conversionFactor: factor,
              });
            } else {
              tiers.push({
                id: u.id,
                tier: factor >= 10 ? 'gros' : factor >= 2 ? 'demi_gros' : 'detail',
                name: u.label,
                unit: u.label,
                minQuantity: factor,
                price: unitEquivalentPrice,
                salePrice: retailP,
                conversionFactor: factor,
              });
            }
          });

          return {
            id: p.id,
            name: p.name,
            categoryId: p.category_id,
            categoryName: p.category?.name || "Général",
            currentStock: p.current_stock ?? 0,
            alertThreshold: p.alert_threshold ?? 5,
            photoUrl: p.image_url,
            salePrice: baseRetailPrice,
            baseUnit: baseUnitObj?.label || "Unité",
            isFavorite: p.is_favorite ?? false,
            priceTiers: tiers,
          };
        });
        setInternalProducts(mapped);
      } else {
        // Repli local en cas d'erreur réseau
        const savedCustom = JSON.parse(localStorage.getItem("vendix-custom-products") || "[]");
        const savedLegacy = JSON.parse(localStorage.getItem("vendix_products") || "[]");
        const customMap = new Map();
        [...savedLegacy, ...savedCustom].forEach((p) => customMap.set(String(p.id), p));
        setInternalProducts(Array.from(customMap.values()));
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  const activeProducts = initialProducts || internalProducts;

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
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
  }, [activeProducts, selectedCategory, showFavoritesOnly, searchTerm]);

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

      {/* Grille des produits ou état vide */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60" />
          ))}
        </div>
      ) : activeProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center bg-white flex flex-col items-center justify-center">
          <ShoppingBasket size={36} className="mb-3 text-slate-400" />
          <p className="font-bold text-slate-800 text-sm">Catalogue vide</p>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            Aucun produit dans votre boutique. Ajoutez un premier article au catalogue pour enregistrer vos ventes.
          </p>
          <Link
            to="/app/products/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-vendix-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-vendix-brand-dark"
          >
            <Plus size={15} />
            <span>Ajouter un produit</span>
          </Link>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredProducts.map((product) => {
            const hasStock = product.currentStock > 0;

            return (
              <article
                key={product.id}
                onClick={() => {
                  if (hasStock) onAddProduct?.(product);
                }}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-150 select-none btn-press ${
                  hasStock
                    ? "border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-card-hover cursor-pointer"
                    : "border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Image du produit */}
                <div className="relative h-28 bg-slate-100 sm:h-32">
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {!hasStock && (
                    <span className="absolute inset-x-0 bottom-0 bg-rose-600/90 py-1 text-center text-[10px] font-bold text-white backdrop-blur-xs">
                      Épuisé
                    </span>
                  )}
                </div>

                {/* Détails du produit */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                      {product.name}
                    </h3>

                    <div className="mt-1 flex items-baseline justify-between">
                      <MoneyDisplay amount={product.salePrice} size="sm" className="text-emerald-700 font-extrabold" />
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{product.baseUnit}</span>
                      <Badge variant={hasStock ? (product.currentStock <= (product.minStockAlert || 5) ? "warning" : "success") : "danger"} size="sm">
                        {hasStock ? `${product.currentStock} dispo` : "0 stock"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-800 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Plus size={15} />
                    <span>Ajouter</span>
                  </div>
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
