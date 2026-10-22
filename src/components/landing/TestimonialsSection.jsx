
const testimonials = [
  {
    initials: "AM",
    name: "Aïcha M.",
    activity: "Vendeuse de vêtements",
    title: "Mieux organiser mes ventes",
    message:
      "Avec un outil adapté à mon commerce, je pourrais suivre mes ventes plus facilement et mieux organiser mes journées.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    initials: "JK",
    name: "Jean K.",
    activity: "Commerçant en alimentation",
    title: "Garder un œil sur mon stock",
    message:
      "Suivre les produits disponibles et repérer les articles à renouveler est essentiel pour éviter les ruptures de stock.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    initials: "FD",
    name: "Fatou D.",
    activity: "Vendeuse indépendante",
    title: "Développer ma clientèle",
    message:
      "Une vitrine en ligne serait un excellent moyen de présenter mes produits et de permettre à davantage de clients de les découvrir.",
    color: "bg-sky-100 text-sky-700",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-200 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* En-tête de la section */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            Pensé pour les commerçants
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Votre commerce mérite de grandir
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Mieux suivre ses ventes, maîtriser son stock et gagner
            en visibilité : découvrez les besoins auxquels Vendix
            souhaite répondre au quotidien.
          </p>
        </div>

        {/* Cartes de témoignages illustratifs */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.initials}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icône de citation */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl font-bold text-emerald-700"
                aria-hidden="true"
              >
                “
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {testimonial.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                {testimonial.message}
              </p>

              {/* Profil illustratif */}
              <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${testimonial.color}`}
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {testimonial.activity}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Transparence sur les exemples */}
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Exemples illustratifs de besoins de commerçants, et non des
          témoignages de clients réels.
        </p>

        {/* Invitation à découvrir Vendix */}
        <div className="mt-10 text-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Découvrir Vendix
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
