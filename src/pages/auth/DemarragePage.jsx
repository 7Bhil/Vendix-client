import { useNavigate } from 'react-router-dom';

export default function DemarragePage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-vendix-surface px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vendix-brand text-2xl font-bold text-white shadow-md">
          V
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-vendix-ink">
          Configuration Initiale
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Ce module d'onboarding guidé sera implémenté dans le ticket dédié.
        </p>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-600">
          Prochainement : Choix des couleurs de boutique, ajout du logo et création du premier produit.
        </div>

        <button
          type="button"
          onClick={() => navigate('/app/tableau-de-bord')}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-vendix-brand px-4 text-sm font-bold text-white transition hover:bg-vendix-brand-dark"
        >
          Accéder au tableau de bord
        </button>
      </div>
    </main>
  );
}
