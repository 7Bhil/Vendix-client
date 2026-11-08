
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-vendix-surface px-4 py-8 sm:py-10">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>

        <header className="mb-8 text-center">
          <Link
            to="/"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vendix-brand text-2xl font-bold text-white shadow-lg shadow-blue-900/20 transition hover:opacity-90"
            aria-label="Accueil Vendix"
          >
            V
          </Link>

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
