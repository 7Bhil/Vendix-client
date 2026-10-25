
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-vendix-surface px-4 py-8 sm:py-10">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vendix-brand text-2xl font-bold text-white shadow-lg shadow-blue-900/20">
            V
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-vendix-ink">
            Vendix
          </h1>

          {title && (
            <h2 className="mt-3 text-xl font-semibold text-vendix-ink">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {subtitle}
            </p>
          )}
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
          {children}
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
         @ {new Date().getFullYear()} Vendix. Tous droits réservés.
        </p>
      </div>
    </main>
  )
}
