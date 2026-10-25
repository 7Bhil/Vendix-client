
import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "Qu'est-ce que Vendix ?",
    answer:
      "Vendix est une solution conçue pour aider les commerçants à gérer leurs ventes, suivre leur stock, organiser les crédits clients et présenter leurs produits en ligne.",
  },
  {
    question: "Est-ce que Vendix est gratuit ?",
    answer:
      "Vous pouvez commencer avec l'offre gratuite prévue par Vendix. Les fonctionnalités et les éventuelles limites dépendent de l'offre proposée sur la plateforme.",
  },
  {
    question: "Comment créer ma boutique sur Vendix ?",
    answer:
      "Cliquez sur « Créer ma boutique », accédez au formulaire d'inscription et renseignez les informations demandées pour commencer à configurer votre espace.",
  },
  {
    question: "Puis-je suivre mes ventes et mon stock ?",
    answer:
      "Oui, Vendix est conçu pour vous aider à suivre vos ventes et vos produits disponibles afin de mieux organiser votre activité commerciale.",
  },
  {
    question: "Puis-je vendre mes produits en ligne ?",
    answer:
      "Vendix prévoit des vitrines publiques pour présenter vos produits et faciliter leur découverte par vos clients, selon les fonctionnalités disponibles sur votre compte.",
  },
  {
    question: "Que faire si j'ai besoin d'aide ?",
    answer:
      "Vous pourrez contacter l'assistance Vendix via le canal de contact officiel indiqué sur la plateforme pour obtenir de l'aide.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleQuestion = (index) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? -1 : index
    );
  };

  return (
    <section
      id="faq"
      className="bg-white px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-vendix-surface px-4 py-2 text-sm font-semibold text-vendix-brand">
            Centre d'aide
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl lg:text-5xl">
            Vous avez des questions ?
            <span className="mt-2 block text-vendix-whatsapp">
              Nous avons les réponses.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Retrouvez les informations essentielles pour comprendre
            Vendix et découvrir comment la plateforme peut accompagner
            votre commerce au quotidien.
          </p>
        </div>

        {/* Liste des questions */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;
              const Icon = isOpen ? Minus : Plus;

              return (
                <div key={faq.question} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="group flex w-full items-center justify-between gap-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
                  >
                    <span
                      className={`text-base font-semibold transition-colors sm:text-lg ${
                        isOpen
                          ? "text-vendix-brand"
                          : "text-vendix-ink group-hover:text-vendix-brand"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-vendix-brand bg-vendix-brand text-white"
                          : "border-slate-200 bg-white text-slate-500 group-hover:border-vendix-brand group-hover:text-vendix-brand"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon size={19} strokeWidth={2} />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={answerId}
                      className="animate-fade-in pb-5 pr-10"
                    >
                      <p className="text-sm leading-7 text-slate-600 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Invitation à passer à l'action */}
          <div className="mt-10 rounded-2xl border border-slate-100 bg-vendix-surface p-6 text-center sm:p-8">
            <h3 className="text-lg font-bold text-vendix-ink">
              Vous êtes prêt à vous lancer ?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Faites le premier pas vers une gestion plus simple de votre commerce.
            </p>

            <a
              href="/register"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-vendix-brand-dark hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Créer ma boutique
              <ArrowRight size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
