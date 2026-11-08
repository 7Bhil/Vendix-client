import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, History, RefreshCw } from 'lucide-react';

import { stockService } from '../../api/services.js';
import {
  STOCK_MOVEMENTS_CACHE_KEY,
  readLocalStorage,
  writeLocalStorage,
} from '../../utils/stockStorage.js';

const MOVEMENT_TYPES = {
  ENTRY: 'Entrée',
  LOSS: 'Perte / Casse',
  DAMAGE: 'Casse',
  CORRECTION: 'Ajustement inventaire',
  SALE: 'Vente',
  PURCHASE: 'Achat fournisseur',
  PURCHASE_ENTRY: 'Entrée de marchandise',
  MANUAL_ADJUST: 'Ajustement inventaire',
  INVENTORY_LOSS: 'Perte inventaire',
};

export default function StockMovementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [movements, setMovements] = useState(() => readLocalStorage(STOCK_MOVEMENTS_CACHE_KEY));
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'historique des mouvements depuis l'API NestJS
  const loadMovements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await stockService.getMovementsHistory({ limit: 100 });
      const items = Array.isArray(res) ? res : res?.data || [];

      // Mettre à jour l'état et le cache local offline
      setMovements(items);
      writeLocalStorage(STOCK_MOVEMENTS_CACHE_KEY, items);
    } catch {
      // Fallback sur le cache local
      const cached = readLocalStorage(STOCK_MOVEMENTS_CACHE_KEY);
      if (cached.length > 0) {
        setMovements(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  // Normalisation des mouvements pour un affichage uniforme (API ou local)
  const normalizedMovements = useMemo(() => {
    return movements.map((m) => {
      const productName =
        m.product?.name ||
        m.productName ||
        'Produit';

      const type = m.motif || m.type || 'ENTRY';
      const quantityDelta =
        m.quantity_delta !== undefined
          ? Number(m.quantity_delta)
          : m.signedQuantity !== undefined
            ? Number(m.signedQuantity)
            : type === 'ENTRY' || type === 'PURCHASE' || type === 'PURCHASE_ENTRY'
              ? Math.abs(Number(m.quantity))
              : -Math.abs(Number(m.quantity));

      const createdAt = m.created_at || m.createdAt || m.date || new Date().toISOString();
      const reason = m.reason || 'Aucun motif renseigné';

      return {
        id: m.id || `${m.product_id}-${createdAt}`,
        productName,
        type,
        quantityDelta,
        rawQuantity: Math.abs(quantityDelta),
        reason,
        createdAt,
      };
    });
  }, [movements]);

  const filteredMovements = useMemo(() => {
    return normalizedMovements
      .filter((movement) => {
        const matchesSearch =
          movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          selectedType === '' ||
          movement.type === selectedType ||
          (selectedType === 'ENTRY' && (movement.type === 'PURCHASE_ENTRY' || movement.type === 'PURCHASE')) ||
          (selectedType === 'LOSS' && (movement.type === 'INVENTORY_LOSS' || movement.type === 'DAMAGE'));

        return matchesSearch && matchesType;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [normalizedMovements, searchTerm, selectedType]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date inconnue';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Date invalide';

    const formattedDate = date.toLocaleDateString('fr-FR');
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} à ${formattedTime}`;
  };

  const formatQuantity = (movement) => {
    const isPositive = movement.quantityDelta > 0;
    const sign = isPositive ? '+' : '-';
    return `${sign}${movement.rawQuantity}`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/app/stock"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Retour au stock
          </Link>

          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Historique des mouvements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consultez le grand livre des entrées, sorties, ventes et réceptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMovements}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title="Rafraîchir l'historique"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border border-slate-200">
            <History size={18} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">
              {filteredMovements.length} mouvement(s)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Rechercher un produit ou un motif..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-vendix-brand"
          />
        </div>

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-vendix-brand"
        >
          <option value="">Tous les mouvements</option>
          <option value="ENTRY">Entrées de stock</option>
          <option value="LOSS">Pertes / Casses</option>
          <option value="CORRECTION">Ajustements</option>
          <option value="SALE">Ventes</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {isLoading && normalizedMovements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <RefreshCw size={28} className="animate-spin text-vendix-brand" />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Chargement de l'historique des mouvements...
            </p>
          </div>
        ) : filteredMovements.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <History
              size={36}
              className="mx-auto mb-3 text-slate-300"
            />
            <h2 className="font-bold text-slate-800">
              Aucun mouvement trouvé
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Les mouvements enregistrés apparaîtront ici.
            </p>
          </div>
        ) : (
          <>
            {/* Cartes pour mobile */}
            <div className="divide-y divide-slate-100 sm:hidden">
              {filteredMovements.map((movement) => {
                const isPositive = movement.quantityDelta > 0;

                return (
                  <article key={movement.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-bold text-slate-800">
                          {movement.productName}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(movement.createdAt)}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {MOVEMENT_TYPES[movement.type] || movement.type}
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Quantité</p>
                      <p
                        className={`mt-1 text-lg font-extrabold ${
                          isPositive ? 'text-vendix-brand' : 'text-rose-600'
                        }`}
                      >
                        {formatQuantity(movement)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">Motif</p>
                      <p className="mt-1 break-words text-sm text-slate-700">
                        {movement.reason}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Tableau pour écrans larges */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Produit</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Quantité</th>
                    <th className="px-5 py-4">Motif</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMovements.map((movement) => {
                    const isPositive = movement.quantityDelta > 0;

                    return (
                      <tr key={movement.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {formatDate(movement.createdAt)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {movement.productName}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {MOVEMENT_TYPES[movement.type] || movement.type}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-4 font-bold ${
                            isPositive ? 'text-vendix-brand' : 'text-rose-600'
                          }`}
                        >
                          {formatQuantity(movement)}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {movement.reason}
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
  );
}
