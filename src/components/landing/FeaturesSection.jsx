
const features = [
  {
    number: "01",
    icon: "⚡",
    title: "Vente express en moins de 30 secondes",
    description:
      "Sélectionnez vos articles en quelques gestes, gérez les prix de gros et de détail, calculez automatiquement la monnaie à rendre et générez un reçu PDF.",
    benefits: ["Caisse rapide", "Reçus PDF"],
    iconStyle: "bg-amber-100 text-amber-700",
  },
  {
    number: "02",
    icon: "📒",
    title: "Carnet de crédit et relances",
    description:
      "Retrouvez précisément qui vous doit quoi et combien. Envoyez un rappel courtois à vos clients directement sur WhatsApp.",
    benefits: ["Suivi des dettes", "Rappels WhatsApp"],
    iconStyle: "bg-blue-100 text-blue-700",
  },
  {
    number: "03",
    icon: "📦",
    title: "Un stock géré sans blocage",
    description:
      "Suivez chaque mouvement de stock. Même en cas de rupture, vous pouvez autoriser une vente et vos quantités sont actualisées automatiquement.",
    benefits: ["Historique des mouvements", "Ventes flexibles"],
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    number: "04",
    icon: "🛍️",
    title: "Votre vitrine publique",
    description:
      "Créez une vitrine personnalisée aux couleurs de votre boutique et partagez un lien unique pour présenter vos produits à vos clients.",
    benefits: ["Lien personnalisé", "Produits visibles en ligne"],
    iconStyle: "bg-purple-100 text-purple-700",
  },
];

function FeaturesSection() {
  return (
    <section
      id="fonctionnalites"
      className="bg-slate-300 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
            Les 4 piliers de Vendix
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Tout ce dont votre boutique a besoin,
            <span className="text-emerald-600">
              {" "}dans votre poche.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            De l'encaissement à la gestion du stock, en passant
            par les crédits clients et votre présence en ligne,
            Vendix simplifie votre quotidien.
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-xl sm:p-9"
            >
              {/* Numéro décoratif */}
              <span className="absolute right-6 top-5 text-5xl font-black text-gray-100 transition-colors group-hover:text-emerald-50">
                {feature.number}
              </span>

              <div className="relative">
                {/* Icône */}
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.iconStyle}`}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                {/* Titre et description */}
                <h3 className="mb-4 max-w-md text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="mb-6 text-sm leading-7 text-gray-600 sm:text-base">
                  {feature.description}
                </p>

                {/* Avantages */}
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 sm:text-sm"
                    >
                      <span className="text-emerald-600" aria-hidden="true">
                        ✓
                      </span>
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Appel à l'action */}
        <div className="mt-12 text-center">
          <a
            href="#caisse"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Découvrir la caisse
            <span aria-hidden="true">→</span>
          </a>

          <p className="mt-4 text-sm text-gray-500">
            Toutes les fonctionnalités essentielles pour votre boutique.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
