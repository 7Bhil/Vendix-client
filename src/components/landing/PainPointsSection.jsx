import {
  FileText,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

export default function PainPointsSection() {
  const problems = [
    {
      icon: FileText,
      badge: "Perte de traçabilité",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      title: "Dettes oubliées sur le cahier",
      problem:
        "Les pages de cahier s'abîment, les clients contestent les montants ou tardent à payer, et vous perdez le fil de qui vous doit quoi.",
      solution:
        "Solde débiteur exact par client et relance courtoise en un clic sur WhatsApp avec montant prérempli.",
    },
    {
      icon: AlertTriangle,
      badge: "Rupture au comptoir",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      title: "Stock épuisé au moment de la vente",
      problem:
        "Découvrir que le stock est vide quand le client est déjà devant le comptoir fait perdre la vente au profit du voisin.",
      solution:
        "Alertes de stock critique en direct et liberté d'enregistrer la vente même en rupture avec régularisation ultérieure.",
    },
    {
      icon: TrendingDown,
      badge: "Incertitude financière",
      badgeColor: "bg-blue-50 text-vendix-brand border-blue-200",
      title: "Bénéfice flou en fin de mois",
      problem:
        "Entre le chiffre d'affaires brut, les frais de transport, le magasin et les crédits dehors, vous ignorez ce qu'il vous reste réellement en poche.",
      solution:
        "Distinction automatique entre CA encaissé, créances dehors et marge nette journalière estimée.",
    },
  ];

  return (
    <section id="problemes" className="border-b border-slate-200/80 bg-vendix-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section sobre */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Le constat du terrain
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            Pourquoi le cahier et la mémoire ne suffisent plus
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            La gestion manuelle ralentit le service, génère des erreurs de caisse et laisse s'envoler vos bénéfices.
          </p>
        </div>

        {/* Grille de 3 cartes orientées problème -> solution */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-vendix-ink">
                      <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-vendix-ink">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {item.problem}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-vendix-brand">
                    Réponse Vendix :
                  </p>
                  <p className="mt-1 text-xs leading-normal text-slate-600">
                    {item.solution}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
