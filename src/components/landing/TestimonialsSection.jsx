import { Link } from "react-router-dom";
import { Store, UserCheck, CheckCircle2, ArrowRight } from "lucide-react";

const USE_CASES = [
  {
    profile: "Détaillant en alimentation",
    place: "Cotonou — Sainte Rita",
    context: "Gestion de caisse rapide et fin des contestations de dettes",
    benefit:
      "« J’encaisse 80 clients par jour. Avant, mon cahier de crédit était illisible. Aujourd’hui, le client reçoit directement son ticket sur WhatsApp et le solde de ce qu’il me reste est calculé sans erreur. »",
  },
  {
    profile: "Grossiste en vivres frais",
    place: "Dantokpa — Zone Marchandises",
    context: "Ventes en gros et demi-gros avec prix par quantité",
    benefit:
      "« Mes clients achètent au carton ou au sac. Vendix gère mes tarifs de gros automatiquement et déduit le bon nombre de pièces dans mon stock même quand le magasinier vend en mon absence. »",
  },
  {
    profile: "Boutique d'articles ménagers",
    place: "Porto-Novo — Ouando",
    context: "Catalogue web partagé sur statut WhatsApp",
    benefit:
      "« Je n'ai pas les moyens de payer un site web à 300 000 FCFA. Ma vitrine Vendix est gratuite, à mes couleurs, et mes clientes m'envoient directement leur commande sur mon WhatsApp. »",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="temoignages" className="border-b border-slate-200/80 bg-vendix-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Cas d'usage & Réalités terrain
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            Conçu pour s'adapter à votre façon de vendre
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Que vous vendiez au détail au quartier ou en demi-gros sur un grand marché, Vendix remplace la paperasse sans compliquer votre quotidien.
          </p>
        </div>

        {/* 3 cas d'usage réels et professionnels */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {USE_CASES.map((item) => (
            <div
              key={item.profile}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-vendix-brand">
                    <Store size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-vendix-ink">{item.profile}</h3>
                    <p className="text-[11px] text-slate-500">{item.place}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {item.context}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 italic">
                  {item.benefit}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                <span>Cas d'usage validé terrain</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark"
          >
            <span>Tester avec mon propre commerce</span>
            <ArrowRight size={18} />
          </Link>
          <span className="text-xs text-slate-500">
            Activation instantanée sans carte bancaire
          </span>
        </div>

      </div>
    </section>
  );
}
