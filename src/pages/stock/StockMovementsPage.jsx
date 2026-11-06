import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, History } from 'lucide-react';

import productsData from '../../mocks/modules/products.json';

const readLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const MOVEMENT_TYPES = {
  ENTRY: 'Entrée',
  LOSS: 'Perte',
  DAMAGE: 'Casse',
};

export default function StockMovementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const movements = useMemo(
    () => readLocalStorage('vendix-stock-movements'),
    []
  );

  const products = useMemo(() => {
    const savedLegacy = readLocalStorage('vendix_products');
    const savedCustom = readLocalStorage('vendix-custom-products');

    const productMap = new Map();

    [...savedLegacy, ...savedCustom].forEach((product) => {
      productMap.set(String(product.id), product);
    });

    const savedProducts = Array.from(productMap.values());
    const savedIds = new Set(
      savedProducts.map((product) => String(product.id))
    );

    const mockProducts = productsData.products.filter(
      (product) => !savedIds.has(String(product.id))
    );

    return [...savedProducts, ...mockProducts];
  }, []);

  const productsById = useMemo(
    () =>
      new Map(
        products.map((product) => [
          String(product.id),
          product.name,
        ])
      ),
    [products]
  );

  const filteredMovements = useMemo(() => {
    return movements
      .filter((movement) => {
        const productName =
          productsById.get(String(movement.productId)) || '';

        const matchesSearch =
          productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (movement.reason || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesType =
          selectedType === '' || movement.type === selectedType;

        return matchesSearch && matchesType;
      })
     .sort(
  (a, b) =>
    new Date(b.date || b.createdAt).getTime() -
    new Date(a.date || a.createdAt).getTime()
);
  }, [movements, productsById, searchTerm, selectedType]);

  const formatDate = (date) => {
    if (!date) return 'Date inconnue';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date invalide';
    }

    return parsedDate.toLocaleString('fr-FR');
  };

  const formatQuantity = (movement) => {
    const quantity = Math.abs(Number(movement.quantity) || 0);
    const sign = movement.type === 'ENTRY' ? '+' : '-';

    return `${sign}${quantity}`;
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
            Consultez les entrées, pertes et casses de produits.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
          <History size={20} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            {filteredMovements.length} mouvement(s)
          </span>
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
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-600"
          />
        </div>

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
        >
          <option value="">Tous les mouvements</option>
          <option value="ENTRY">Entrées</option>
          <option value="LOSS">Pertes</option>
          <option value="DAMAGE">Casses</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filteredMovements.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
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
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(movement.date || movement.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {productsById.get(String(movement.productId)) ||
                        'Produit introuvable'}
                    </td>

                    <td className="px-5 py-4">
                      {MOVEMENT_TYPES[movement.type] || movement.type}
                    </td>

                    <td
                      className={`px-5 py-4 font-bold ${
                        movement.type === 'ENTRY'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatQuantity(movement)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {movement.reason || 'Aucun motif renseigné'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}