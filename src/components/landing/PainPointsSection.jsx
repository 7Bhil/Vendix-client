
import {
  BookOpen,
  Package,
  Wallet,
  AlertCircle,
} from "lucide-react";

const painPoints = [
  {
    number: "01",
    icon: BookOpen,
    title: "Dettes oubliées",
    description:
      "Les clients tardent à payer et vous ne savez plus exactement qui vous doit combien.",
    consequence: "Un historique des dettes difficile à suivre.",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    number: "02",
    icon: Package,
    title: "Ruptures surprises",
    description:
      "Un client passe commande, mais vous découvrez au dernier moment que votre stock est épuisé.",
    consequence: "Des ventes perdues et des clients déçus.",
    iconBg: "bg-red-100 text-red-700",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Bénéfice flou",
    description:
      "Entre les achats, le transport et les frais du magasin, vous ignorez parfois ce que vous gagnez réellement.",
    consequence: "Une rentabilité difficile à mesurer.",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
];

function PainPointsSection() {
  return (
    <section
      id="problemes"
      className="bg-vendix-surface px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête de la section */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-vendix-brand">
            Le constat
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-vendix-ink sm:text-4xl lg:text-5xl">
            Vous gérez encore votre boutique
            <span className="text-vendix-brand">
              {" "}avec un cahier et WhatsApp ?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Gérer une boutique au quotidien ne devrait pas être
            une source permanente de stress. Pourtant, certaines
            difficultés freinent encore votre activité.
          </p>
        </div>

        {/* Les trois problèmes métier */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point) => {
            const Icon = point.icon;

            return (
              <article
                key={point.number}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl sm:p-8"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${point.iconBg}`}
                    aria-hidden="true"
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold tracking-widest text-slate-300">
                    {point.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-vendix-ink transition-colors group-hover:text-vendix-brand">
                  {point.title}
                </h3>

                <p className="mb-7 flex-1 text-sm leading-7 text-slate-600 sm:text-base">
                  {point.description}
                </p>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-5">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                    aria-hidden="true"
                  >
                    <AlertCircle size={17} strokeWidth={2} />
                  </span>

                  <p className="text-sm font-medium leading-6 text-slate-700">
                    {point.consequence}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PainPointsSection;
