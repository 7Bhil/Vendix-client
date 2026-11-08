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
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-md sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:h-10 sm:w-10">
              <Package size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {product.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                {product.categoryName || 'Alimentation générale'}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${stockBadge.classes}`}
          >
            {stockBadge.label}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 sm:space-y-2 sm:p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 sm:text-xs">Prix vente</span>
            <span className="font-extrabold text-vendix-brand text-xs sm:text-sm">
              {formatPrice(salePrice)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
            <span className="text-[11px] text-slate-500 sm:text-xs">Stock dispo</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {currentStock} {product.baseUnit || 'Unité'}
            </span>
          </div>
        </div>

        {isSellingAtLoss && (
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-red-50 p-1.5 text-[11px] font-semibold text-red-700">
            <AlertTriangle size={13} className="shrink-0" />
            <span>Vente à perte</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-2.5">
        <button
          type="button"
          onClick={() => navigate(`/app/products/${product.id}/modifier`)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-vendix-brand active:scale-95 focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <Edit3 size={13} />
          <span>Modifier</span>
        </button>
      </div>
    </div>
  );
}
