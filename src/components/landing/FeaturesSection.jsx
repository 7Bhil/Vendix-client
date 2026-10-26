
import { Link } from "react-router-dom";
import {
  Zap,
  BookOpen,
  Package,
  Store,
  Check,
  ArrowRight,
  ReceiptText,
  MessageCircle,
  History,
  ShoppingBag,
  Link as LinkIcon,
  Globe,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Zap,
    title: "Vente express en moins de 30 secondes",
    description:
      "Sélectionnez vos articles en quelques gestes, gérez les prix de gros et de détail, calculez automatiquement la monnaie à rendre et générez un reçu PDF.",
    benefits: [
      { label: "Caisse rapide", icon: ReceiptText },
      { label: "Reçus PDF", icon: Check },
    ],
    iconStyle: "bg-amber-100 text-amber-700",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Carnet de crédit et relances",
    description:
      "Retrouvez précisément qui vous doit quoi et combien. Envoyez un rappel courtois à vos clients directement sur WhatsApp.",
    benefits: [
      { label: "Suivi des dettes", icon: BookOpen },
      { label: "Rappels WhatsApp", icon: MessageCircle },
    ],
    iconStyle: "bg-blue-100 text-vendix-brand",
  },
  {
    number: "03",
    icon: Package,
    title: "Un stock géré sans blocage",
    description:
      "Suivez chaque mouvement de stock. Même en cas de rupture, vous pouvez autoriser une vente et vos quantités sont actualisées automatiquement.",
    benefits: [
      { label: "Historique des mouvements", icon: History },
      { label: "Ventes flexibles", icon: ShoppingBag },
    ],
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    number: "04",
    icon: Store,
    title: "Votre vitrine publique",
    description:
      "Créez une vitrine personnalisée aux couleurs de votre boutique et partagez un lien unique pour présenter vos produits à vos clients.",
    benefits: [
      { label: "Lien personnalisé", icon: LinkIcon },
      { label: "Produits visibles en ligne", icon: Globe },
    ],
    iconStyle: "bg-amber-100 text-amber-700",
  },
];

function FeaturesSection() {
  return (
    <section
      id="fonctionnalites"
      className="bg-slate-200 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-vendix-brand">
            Les 4 piliers de Vendix
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-vendix-ink sm:text-4xl lg:text-5xl">
            Tout ce dont votre boutique a besoin,
            <span className="text-vendix-brand">
              {" "}dans votre poche.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            De l'encaissement à la gestion du stock, en passant
            par les crédits clients et votre présence en ligne,
            Vendix simplifie votre quotidien.
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-9"
              >
                {/* Numéro décoratif */}
                <span className="absolute right-6 top-5 text-5xl font-black text-slate-500 transition-colors group-hover:text-blue-50">
                  {feature.number}
                </span>

                <div className="relative">
                  {/* Icône principale */}
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconStyle}`}
                    aria-hidden="true"
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Titre et description */}
                  <h3 className="mb-4 max-w-md text-xl font-bold leading-snug text-vendix-ink sm:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-slate-600 sm:text-base">
                    {feature.description}
                  </p>

                  {/* Avantages */}
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit) => {
                      const BenefitIcon = benefit.icon;

                      return (
                        <span
                          key={benefit.label}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-vendix-surface px-3 py-2 text-xs font-semibold text-vendix-ink sm:text-sm"
                        >
                          <BenefitIcon
                            size={15}
                            className="shrink-0 text-vendix-brand"
                            aria-hidden="true"
                          />
                          {benefit.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Appel à l'action */}
        <div className="mt-12 text-center">
          <Link
            to="/inscription"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-vendix-brand px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-vendix-brand-dark hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Découvrir la caisse
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            Toutes les fonctionnalités essentielles pour votre boutique.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
