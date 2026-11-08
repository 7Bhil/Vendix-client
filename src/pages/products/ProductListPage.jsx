import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Package, AlertCircle } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard.jsx';
import { productsService, categoriesService } from '../../api/services.js';

export default function ProductListPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError('');

      try {
        const [apiProducts, apiCategories] = await Promise.allSettled([
          productsService.getAll(),
          categoriesService.getAll(),
        ]);

        if (isMounted) {
          if (apiCategories.status === 'fulfilled' && Array.isArray(apiCategories.value)) {
            setCategories(apiCategories.value);
          }

          if (apiProducts.status === 'fulfilled' && Array.isArray(apiProducts.value)) {
            // Mapping du format NestJS vers les props attendues par ProductCard
            const mapped = apiProducts.value.map((p) => {
              const baseUnitObj = (p.product_units || []).find((u) => u.is_base_unit) || (p.product_units || [])[0];
              const salePrice = baseUnitObj?.retail_price ?? 0;
              const costPrice = p.default_cost_price ?? 0;

              return {
                id: p.id,
                name: p.name,
                categoryId: p.category_id,
                categoryName: p.category?.name || 'Général',
                currentStock: p.current_stock ?? 0,
                alertThreshold: p.alert_threshold ?? 5,
                photoUrl: p.image_url,
                costPrice,
                salePrice,
                baseUnit: baseUnitObj?.label || 'Unité',
                product_units: p.product_units || [],
                priceTiers: (p.product_units || []).map((u) => ({
                  id: u.id,
                  name: u.label,
                  unit: u.label,
                  salePrice: u.retail_price,
                  conversionFactor: Number(u.conversion_factor) || 1,
                })),
              };
            });
            setProducts(mapped);
          } else {
            // En cas d'échec serveur ou mode déconnecté : repli sur le localStorage
            const savedCustom = JSON.parse(localStorage.getItem('vendix-custom-products') || '[]');
            const savedLegacy = JSON.parse(localStorage.getItem('vendix_products') || '[]');
            const customMap = new Map();
            [...savedLegacy, ...savedCustom].forEach((p) => customMap.set(String(p.id), p));
            setProducts(Array.from(customMap.values()));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors du chargement des produits.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStockStatus = (product) => {
    const stock = Number(product.currentStock) || 0;
    const threshold = Number(product.alertThreshold) || 0;

    if (stock <= 0) return 'Rupture de stock';
    if (stock <= threshold) return 'Stock faible';
    return 'Stock normal';
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = (product.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === '' ||
        product.categoryId === selectedCategory ||
        product.category === selectedCategory ||
        product.categoryName === selectedCategory;

      const matchesStockStatus =
        selectedStockStatus === '' ||
        getStockStatus(product) === selectedStockStatus;

      return matchesName && matchesCategory && matchesStockStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStockStatus]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Catalogue Produits
            </h1>
            <p className="text-xs text-slate-500">
              Gérez vos articles, tarifs de gros et demi-gros, et états de stock.
            </p>
          </div>

          <button
            onClick={() => navigate('/app/products/new')}
            className="flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 py-2.5 text-xs font-bold text-white transition hover:bg-vendix-brand-dark focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <Plus size={16} />
            <span>Nouveau produit</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand bg-white"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStockStatus}
              onChange={(event) => setSelectedStockStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-xs outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand bg-white"
            >
              <option value="">Tous les états de stock</option>
              <option value="Stock normal">Stock normal</option>
              <option value="Stock faible">Stock faible</option>
              <option value="Rupture de stock">Rupture de stock</option>
            </select>
          </div>
        </div>

        {/* Grille de produits ou Squelette de chargement */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100 border border-slate-200/60" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">
              Aucun produit dans votre boutique
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Aucun produit dans votre boutique. Cliquez sur 'Nouveau produit' pour commencer.
            </p>
            <button
              onClick={() => navigate('/app/products/new')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-vendix-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-vendix-brand-dark"
            >
              <Plus size={15} />
              <span>Nouveau produit</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">
              Aucun produit trouvé
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Aucun produit ne correspond à vos filtres actuels.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
