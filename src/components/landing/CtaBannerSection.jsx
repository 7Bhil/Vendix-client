import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CtaBannerSection() {
  return (
    <section className="border-b border-slate-200/80 bg-slate-900 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Aucun abonnement payant au démarrage
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Passez au digital sans changer votre façon de vendre
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Rejoignez les grossistes et détaillants qui fiabilisent leur caisse, éliminent les oublis de créances et partagent leur catalogue WhatsApp dès aujourd'hui.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/inscription"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand px-7 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:bg-vendix-brand-dark sm:w-auto"
            >
              <span>Créer ma boutique gratuitement</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/connexion"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
            >
              Déjà inscrit ? Se connecter
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              100% Fonctionnel sur smartphone
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Opérationnel hors-ligne
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Zéro frais SMS
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
