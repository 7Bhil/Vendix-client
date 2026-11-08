import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Package,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import StockMovementModal from '../../components/stock/StockMovementModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { stockService, categoriesService } from '../../api/services.js';
import {
  STOCK_PRODUCTS_CACHE_KEY,
  STOCK_MOVEMENTS_CACHE_KEY,
  readLocalStorage,
  writeLocalStorage,
} from '../../utils/stockStorage.js';

export default function StockListPage() {
  const { success, error } = useToast();

  // Recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('');

  // États des données distantes
  const [products, setProducts] = useState(() => readLocalStorage(STOCK_PRODUCTS_CACHE_KEY));
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Affichage du modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chargement des données (Stock + Catégories) depuis l'API NestJS
  const loadStockData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stockData, categoriesData] = await Promise.all([
        stockService.getStockState(),
        categoriesService.getAll().catch(() => []),
      ]);

      const items = Array.isArray(stockData) ? stockData : stockData?.data || [];
      const cats = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

      setProducts(items);
      writeLocalStorage(STOCK_PRODUCTS_CACHE_KEY, items);

      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    } catch (err) {
      // Fallback sur le cache local
      const cached = readLocalStorage(STOCK_PRODUCTS_CACHE_KEY);
      if (cached.length > 0) {
        setProducts(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockData();
  }, [loadStockData]);

  // Normalisation des produits avec calcul de l'état
  const normalizedProducts = useMemo(() => {
    return products.map((product) => {
      const currentStock =
        product.current_stock !== undefined
          ? Number(product.current_stock)
          : Number(product.currentStock) || 0;

      const alertThreshold =
        product.alert_threshold !== undefined
          ? Number(product.alert_threshold)
          : Number(product.alertThreshold) || 5;

      const baseUnit =
        product.base_unit_label ||
        product.baseUnit ||
        product.product_units?.find((u) => u.is_base_unit)?.label ||
        'Unité';

      const categoryName =
        product.category?.name ||
        product.categoryName ||
        categories.find((c) => c.id === product.category_id || c.id === product.categoryId)?.name ||
        'Général';

      return {
        ...product,
        id: product.id,
        name: product.name,
        currentStock,
        alertThreshold,
        baseUnit,
        categoryName,
        categoryId: product.category_id || product.categoryId,
      };
    });
  }, [products, categories]);

  // Déterminer l'état du stock d'un produit
  const getStockStatus = (product) => {
    const stock = Number(product.currentStock);
    const threshold = Number(product.alertThreshold);

    if (stock <= 0) return 'Rupture de stock';
    if (stock <= threshold) return 'Stock faible';
    return 'Stock normal';
  };

  // Calculer les indicateurs du stock
  const stockStats = useMemo(() => {
    return {
      total: normalizedProducts.length,
      lowStock: normalizedProducts.filter(
        (product) => getStockStatus(product) === 'Stock faible'
      ).length,
      outOfStock: normalizedProducts.filter(
        (product) => getStockStatus(product) === 'Rupture de stock'
      ).length,
    };
  }, [normalizedProducts]);

  // Filtrer les produits selon les critères sélectionnés
  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => {
      const matchesName = (product.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === '' ||
        product.categoryId === selectedCategory ||
        product.categoryName === selectedCategory;

      const matchesStatus =
        selectedStockStatus === '' ||
        getStockStatus(product) === selectedStockStatus;

      return matchesName && matchesCategory && matchesStatus;
    });
  }, [normalizedProducts, searchTerm, selectedCategory, selectedStockStatus]);

  // Enregistrer un nouveau mouvement de stock via l'API NestJS
  const handleMovementSubmit = async (movement) => {
    setIsSubmitting(true);
    try {
      const payload = {
        productId: movement.productId,
        type: movement.type,
        motif: movement.type,
        quantity: Math.abs(Number(movement.quantity)),
        reason: movement.reason || undefined,
      };

      await stockService.recordMovement(payload);

      // Consigner également dans l'historique local pour l'accès offline
      const localHistory = readLocalStorage(STOCK_MOVEMENTS_CACHE_KEY);
      const newLocalEntry = {
        id: crypto.randomUUID(),
        productId: movement.productId,
        productName: normalizedProducts.find((p) => p.id === movement.productId)?.name,
        type: movement.type,
        quantity: movement.quantity,
        signedQuantity: movement.signedQuantity,
        reason: movement.reason,
        createdAt: new Date().toISOString(),
      };
      writeLocalStorage(STOCK_MOVEMENTS_CACHE_KEY, [newLocalEntry, ...localHistory]);

      success('Le mouvement de stock a été enregistré avec succès.');
      setIsModalOpen(false);
      await loadStockData();
    } catch (err) {
      error(err.message || "Impossible d'enregistrer le mouvement de stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Gestion du stock
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Suivez vos quantités, vos alertes et vos mouvements de stock en temps réel.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={loadStockData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              title="Rafraîchir"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualiser</span>
            </button>

            <Link
              to="/app/stock/movements"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Historique des mouvements
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark"
            >
              <Plus size={18} />
              Nouveau mouvement
            </button>
          </div>
        </div>

        {/* Synthèse mobile */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Total références :</span>
            <span className="font-extrabold text-slate-900">{stockStats.total}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-1.5">
            <span className="font-semibold text-amber-600">
              {stockStats.lowStock} stock faible
            </span>
            <span className="font-semibold text-rose-600">
              {stockStats.outOfStock} rupture
            </span>
          </div>
        </div>

        {/* Indicateurs de stock desktop */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          {/* Total des produits */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total des références</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {stockStats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={24} />
              </div>
            </div>
          </div>

          {/* Stock faible */}
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Stock faible</p>
                <p className="mt-2 text-3xl font-extrabold text-amber-600">
                  {stockStats.lowStock}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Filter size={24} />
              </div>
            </div>
          </div>

          {/* Rupture de stock */}
          <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rupture de stock</p>
                <p className="mt-2 text-3xl font-extrabold text-rose-600">
                  {stockStats.outOfStock}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Package size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recherche et filtres */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          {/* Recherche par nom */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par état du stock */}
          <div>
            <select
              value={selectedStockStatus}
              onChange={(event) => setSelectedStockStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            >
              <option value="">Tous les états de stock</option>
              <option value="Stock normal">Stock normal</option>
              <option value="Stock faible">Stock faible</option>
              <option value="Rupture de stock">Rupture de stock</option>
            </select>
          </div>
        </div>

        {/* Liste des produits et niveaux de stock */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                État des stocks
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredProducts.length} référence(s) affichée(s)
              </p>
            </div>
          </div>

          {isLoading && normalizedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <RefreshCw size={28} className="animate-spin text-vendix-brand" />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Chargement de l'état des stocks...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Package size={32} className="text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                Aucun produit trouvé
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Modifiez votre recherche ou vos filtres.
              </p>
            </div>
          ) : (
            <>
              {/* Cartes pour mobile */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {filteredProducts.map((product) => {
                  const stock = product.currentStock;
                  const threshold = product.alertThreshold;
                  const status = getStockStatus(product);

                  const statusStyles = {
                    'Stock normal': 'bg-emerald-50 text-emerald-700',
                    'Stock faible': 'bg-amber-50 text-amber-700',
                    'Rupture de stock': 'bg-rose-50 text-rose-700',
                  };

                  return (
                    <article key={product.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-bold text-slate-800">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.categoryName}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-xs text-slate-500">Quantité disponible</p>
                          <p
                            className={`mt-1 text-lg font-extrabold ${
                              stock <= 0
                                ? 'text-rose-600'
                                : stock <= threshold
                                  ? 'text-amber-600'
                                  : 'text-slate-800'
                            }`}
                          >
                            {stock} {product.baseUnit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Seuil d'alerte</p>
                          <p className="mt-1 text-lg font-bold text-slate-700">
                            {threshold} {product.baseUnit}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Tableau pour écrans plus larges */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Produit</th>
                      <th className="px-5 py-4">Catégorie</th>
                      <th className="px-5 py-4">Quantité disponible</th>
                      <th className="px-5 py-4">Seuil d'alerte</th>
                      <th className="px-5 py-4">État</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => {
                      const stock = product.currentStock;
                      const threshold = product.alertThreshold;
                      const status = getStockStatus(product);

                      const statusStyles = {
                        'Stock normal': 'bg-emerald-50 text-emerald-700',
                        'Stock faible': 'bg-amber-50 text-amber-700',
                        'Rupture de stock': 'bg-rose-50 text-rose-700',
                      };

                      return (
                        <tr key={product.id} className="transition hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-800">
                              {product.name}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {product.categoryName}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`text-sm font-extrabold ${
                                stock <= 0
                                  ? 'text-rose-600'
                                  : stock <= threshold
                                    ? 'text-amber-600'
                                    : 'text-slate-800'
                              }`}
                            >
                              {stock}
                            </span>
                            <span className="ml-1 text-xs text-slate-500">
                              {product.baseUnit}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {threshold} {product.baseUnit}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[status]}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <StockMovementModal
          products={normalizedProducts}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleMovementSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
