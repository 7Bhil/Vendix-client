
const painPoints = [
  {
    number: "01",
    icon: "📒",
    title: "Dettes oubliées",
    description:
      "Les clients tardent à payer et vous ne savez plus exactement qui vous doit combien.",
    consequence: "Un historique des dettes difficile à suivre.",
    iconBg: "bg-amber-100",
  },
  {
    number: "02",
    icon: "📦",
    title: "Ruptures surprises",
    description:
      "Un client passe commande, mais vous découvrez au dernier moment que votre stock est épuisé.",
    consequence: "Des ventes perdues et des clients déçus.",
    iconBg: "bg-red-100",
  },
  {
    number: "03",
    icon: "💸",
    title: "Bénéfice flou",
    description:
      "Entre les achats, le transport et les frais du magasin, vous ignorez parfois ce que vous gagnez réellement.",
    consequence: "Une rentabilité difficile à mesurer.",
    iconBg: "bg-emerald-100",
  },
];

function PainPointsSection() {
  return (
    <section
      id="problemes"
      className="bg-gray-50 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête de la section */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
            Le constat
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Vous gérez encore votre boutique
            <span className="text-emerald-600">
              {" "}avec un cahier et WhatsApp ?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Gérer une boutique au quotidien ne devrait pas être
            une source permanente de stress. Pourtant, certaines
            difficultés freinent encore votre activité.
          </p>
        </div>

        {/* Les trois problèmes métier */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point) => (
            <article
              key={point.number}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl sm:p-8"
            >
              <div className="mb-7 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${point.iconBg} text-2xl`}
                  aria-hidden="true"
                >
                  {point.icon}
                </div>

                <span className="text-sm font-bold tracking-widest text-gray-300">
                  {point.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-emerald-700">
                {point.title}
              </h3>

              <p className="mb-7 flex-1 text-sm leading-7 text-gray-600 sm:text-base">
                {point.description}
              </p>

              <div className="flex items-start gap-3 border-t border-gray-100 pt-5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                  !
                </span>

                <p className="text-sm font-medium leading-6 text-gray-700">
                  {point.consequence}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PainPointsSection;
