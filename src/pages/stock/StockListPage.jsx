export default function StockListPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Gestion du Stock
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Niveaux de stock, alertes de rupture et mouvements de correction.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white">
        <p className="text-sm font-bold text-slate-800">Module Stock & Mouvements</p>
        <p className="mt-1 text-xs text-slate-500">
          Espace de travail réservé au Collaborateur 1 (feature/stock-management).
        </p>
      </div>
    </div>
  );
}
