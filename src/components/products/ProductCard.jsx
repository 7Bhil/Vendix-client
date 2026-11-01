import { useNavigate } from 'react-router-dom';
import { Edit3, AlertTriangle, Package } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('fr-FR').format(Number(price) || 0) + ' FCFA';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const currentStock = Number(product.currentStock) || 0;
  const alertThreshold = Number(product.alertThreshold) || 0;
  const costPrice = Number(product.costPrice) || 0;
  const salePrice = Number(product.salePrice) || 0;

  const getStockBadge = () => {
    if (currentStock <= 0) {
      return {
        label: 'Rupture',
        classes: 'bg-red-50 text-red-700 border-red-200',
      };
    }
    if (currentStock <= alertThreshold) {
      return {
        label: 'Stock faible',
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      label: 'En stock',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  };

  const isSellingAtLoss = salePrice < costPrice;
  const stockBadge = getStockBadge();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500">
                {product.categoryName || 'Alimentation générale'}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${stockBadge.classes}`}
          >
            {stockBadge.label}
          </span>
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Prix de vente</span>
            <span className="font-extrabold text-vendix-brand text-sm">
              {formatPrice(salePrice)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
            <span className="text-slate-500">Prix d'achat</span>
            <span className="font-medium text-slate-700">
              {formatPrice(costPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
            <span className="text-slate-500">Quantité en stock</span>
            <span className="font-bold text-slate-900">
              {currentStock} {product.baseUnit || 'Unité'}
            </span>
          </div>
        </div>

        {isSellingAtLoss && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-700">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Vente à perte détectée</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => navigate(`/app/products/${product.id}/modifier`)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-vendix-brand focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <Edit3 size={14} />
          <span>Modifier</span>
        </button>
      </div>
    </div>
  );
}
