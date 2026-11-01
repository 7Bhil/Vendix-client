export default function ExpensesListPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Dépenses & Charges
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Enregistrement des frais de boutique (transport, loyer, énergie, etc.).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white">
        <p className="text-sm font-bold text-slate-800">Module Dépenses & Charges</p>
        <p className="mt-1 text-xs text-slate-500">
          Espace de travail réservé au Collaborateur 2 (feature/expenses-tracking).
        </p>
      </div>
    </div>
  );
}
