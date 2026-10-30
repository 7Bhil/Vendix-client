import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function LowStockAlertBanner({ products = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-300 bg-white p-4 sm:p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        className="flex min-h-12 w-full items-center justify-between gap-3 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            <AlertTriangle size={22} aria-hidden="true" />
          </span>

          <span>
            <span className="block font-semibold text-vendix-ink">
              Stock critique
            </span>
            <span className="block text-sm text-slate-600">
              {products.length} produit(s) à réapprovisionner
            </span>
          </span>
        </span>

        {isExpanded ? (
          <ChevronUp size={20} aria-hidden="true" />
        ) : (
          <ChevronDown size={20} aria-hidden="true" />
        )}
      </button>

      {isExpanded && (
        <ul className="mt-3 divide-y divide-slate-200">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"
            >
              <span className="font-medium text-vendix-ink">
                {product.name}
              </span>
              <span className="shrink-0 text-slate-600">
                Stock : {product.stock}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
