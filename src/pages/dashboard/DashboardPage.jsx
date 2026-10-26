export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-vendix-surface px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vendix-brand text-2xl font-bold text-white shadow-md">
          V
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-vendix-ink">
          Hello World
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tableau de bord Vendix en cours de développement.
        </p>
      </div>
    </main>
  );
}
