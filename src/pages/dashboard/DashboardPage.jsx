import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vendix-surface text-vendix-ink">
      {/* En-tête mobile commerçant */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vendix-brand text-lg font-bold text-white">
              V
            </div>
            <div>
              <h1 className="text-base font-bold text-vendix-ink">Boutique Le Progrès</h1>
              <p className="text-xs text-slate-500">Caisse ouverte • Mode connecté</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/connexion')}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal du Tableau de bord */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
        {/* Résumé financier du jour */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            Aujourd'hui au comptoir
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Ventes du jour</p>
              <p className="mt-2 text-xl font-extrabold text-vendix-ink">48 500 <span className="text-xs font-semibold">FCFA</span></p>
              <p className="mt-1 text-[11px] font-medium text-emerald-600">14 tickets validés</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Encaissé en caisse</p>
              <p className="mt-2 text-xl font-extrabold text-emerald-600">38 500 <span className="text-xs font-semibold">FCFA</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Espèces & MoMo</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Crédits accordés</p>
              <p className="mt-2 text-xl font-extrabold text-amber-600">10 000 <span className="text-xs font-semibold">FCFA</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Dettes clients du jour</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Bénéfice estimé</p>
              <p className="mt-2 text-xl font-extrabold text-vendix-brand">12 400 <span className="text-xs font-semibold">FCFA</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Marge brute nette</p>
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button
              type="button"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-vendix-brand px-4 text-sm font-bold text-white shadow-md transition hover:bg-vendix-brand-dark"
            >
              <span>+ Nouvelle vente</span>
            </button>

            <button
              type="button"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-vendix-ink shadow-sm transition hover:bg-slate-50"
            >
              <span>Carnet de dettes</span>
            </button>

            <button
              type="button"
              className="col-span-2 sm:col-span-1 flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-vendix-ink shadow-sm transition hover:bg-slate-50"
            >
              <span>Gérer les stocks</span>
            </button>
          </div>
        </section>

        {/* Alerte stock faible */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-amber-900">2 produits en stock faible</p>
              <p className="mt-1 text-xs text-amber-700">Riz Parfumé 25kg (reste 1 sac), Huile végétale 1L (reste 3 blles).</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-700"
            >
              Réapprovisionner
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
