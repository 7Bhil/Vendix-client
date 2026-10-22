
const steps = [
  {
    number: "01",
    icon: "📱",
    title: "Inscrivez-vous",
    description:
      "Créez votre compte en quelques secondes avec votre numéro de téléphone. Pas besoin de procédure compliquée pour commencer.",
    detail: "Votre numéro de téléphone suffit.",
  },
  {
    number: "02",
    icon: "🏪",
    title: "Personnalisez votre boutique",
    description:
      "Ajoutez vos produits, renseignez vos prix et choisissez les deux couleurs qui représenteront votre boutique.",
    detail: "Vos produits et vos couleurs, à votre image.",
  },
  {
    number: "03",
    icon: "🚀",
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
      className="overflow-hidden bg-gray-50 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
            Simple et rapide
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Comment ça marche ?
          </h2>

          <p className="mt-5 text-lg font-semibold text-emerald-600 sm:text-xl">
            Opérationnel en 2 minutes chrono.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Trois étapes simples pour prendre en main votre boutique
            et commencer à gérer votre activité avec Vendix.
          </p>
        </div>

        {/* Parcours en trois étapes */}
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Ligne reliant les étapes sur ordinateur */}
          <div
            className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-0.5 bg-emerald-200 md:block"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <article
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              {/* Numéro et icône */}
              <div className="relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-emerald-600 text-3xl shadow-lg shadow-emerald-600/20">
                <span aria-hidden="true">{step.icon}</span>

                <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-xs font-extrabold text-white">
                  {step.number}
                </span>
              </div>

              {/* Contenu de l'étape */}
              <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600 sm:text-base">
                  {step.description}
                </p>

                <div className="mt-5 flex items-start justify-center gap-2 border-t border-gray-100 pt-4">
                  <span
                    className="font-bold text-emerald-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p className="text-sm font-medium leading-6 text-gray-700">
                    {step.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Appel à l'action */}
        <div className="mt-14 text-center">
          <a
            href="#inscription"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Créer ma boutique
            <span aria-hidden="true">→</span>
          </a>

          <p className="mt-4 text-sm text-gray-500">
            Votre boutique commence ici.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
