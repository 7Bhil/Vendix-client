import { Link } from "react-router-dom";
import { UserCheck, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      icon: UserCheck,
      title: "Inscription en 30 secondes",
      description:
        "Saisissez uniquement votre numéro de téléphone et le nom de votre commerce. Zéro validation SMS payante, vous êtes prêt immédiatement.",
    },
    {
      step: "2",
      icon: Sparkles,
      title: "Personnalisation & Premiers articles",
      description:
        "Choisissez vos deux couleurs de marque et enregistrez vos premiers produits avec prix en gros et au détail.",
    },
    {
      step: "3",
      icon: ShoppingBag,
      title: "Première vente & Partage vitrine",
      description:
        "Encaissez vos clients au comptoir et envoyez votre lien de vitrine sur votre statut WhatsApp pour attirer de nouvelles commandes.",
    },
  ];

  return (
    <section id="comment-ca-marche" className="border-b border-slate-200/80 bg-vendix-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Prise en main express
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            Opérationnel en 2 minutes chrono
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Aucune formation complexe, aucun équipement coûteux à acheter. Tout se passe sur votre smartphone.
          </p>
        </div>

        {/* 3 étapes séquentielles nettes */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <Icon size={20} className="text-vendix-brand" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-vendix-ink">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-3 text-right">
                  <span className="font-mono text-[11px] text-slate-600">
                    Étape {index + 1} / 3
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div className="mt-12 text-center">
          <Link
            to="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark"
          >
            <span>Créer ma boutique maintenant</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
