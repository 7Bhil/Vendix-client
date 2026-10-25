
import {
  Smartphone,
  Store,
  Rocket,
  Check,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Inscrivez-vous",
    description:
      "Créez votre compte en quelques secondes avec votre numéro de téléphone. Pas besoin de procédure compliquée pour commencer.",
    detail: "Votre numéro de téléphone suffit.",
  },
  {
    number: "02",
    icon: Store,
    title: "Personnalisez votre boutique",
    description:
      "Ajoutez vos produits, renseignez vos prix et choisissez les deux couleurs qui représenteront votre boutique.",
    detail: "Vos produits et vos couleurs, à votre image.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Lancez votre activité",
    description:
      "Enregistrez votre première vente et partagez le lien de votre vitrine pour faire découvrir vos produits à vos clients.",
    detail: "Vendez et partagez votre vitrine en ligne.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="comment-ca-marche"
      className="overflow-hidden bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-vendix-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-vendix-brand">
            Simple et rapide
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-vendix-ink sm:text-4xl lg:text-5xl">
            Comment ça marche ?
          </h2>

          <p className="mt-5 text-lg font-semibold text-vendix-brand sm:text-xl">
            Opérationnel en 2 minutes chrono.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Trois étapes simples pour prendre en main votre boutique
            et commencer à gérer votre activité avec Vendix.
          </p>
        </div>

        {/* Parcours en trois étapes */}
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Ligne reliant les étapes sur ordinateur */}
          <div
            className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-0.5 bg-blue-100 md:block"
            aria-hidden="true"
          />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Numéro et icône */}
                <div className="relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-emerald-600 text-white shadow-lg shadow-blue-900/20">
                  <Icon size={32} strokeWidth={1.8} aria-hidden="true" />

                  <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-vendix-accent text-xs font-extrabold text-vendix-ink">
                    {step.number}
                  </span>
                </div>

                {/* Contenu de l'étape */}
                <div className="w-full rounded-2xl border border-slate-200 bg-vendix-surface p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg sm:p-7">
                  <h3 className="mb-3 text-xl font-bold text-vendix-ink">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-slate-600 sm:text-base">
                    {step.description}
                  </p>

                  <div className="mt-5 flex items-start justify-center gap-2 border-t border-slate-200 pt-4">
                    <Check
                      size={18}
                      className="mt-1 shrink-0 text-vendix-brand"
                      aria-hidden="true"
                    />

                    <p className="text-sm font-medium leading-6 text-slate-700">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Appel à l'action */}
        <div className="mt-14 text-center">
          <a
            href="#inscription"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-vendix-brand px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition duration-300 hover:-translate-y-1 hover:bg-vendix-brand-dark focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Créer ma boutique
            <ArrowRight size={19} aria-hidden="true" />
          </a>

          <p className="mt-4 text-sm text-slate-500">
            Votre boutique commence ici.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
