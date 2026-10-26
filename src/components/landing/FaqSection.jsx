import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Est-ce que Vendix est vraiment gratuit au démarrage ?",
    answer:
      "Oui. Le démarrage sur Vendix ne requiert aucune carte bancaire ni aucun frais fixe. La création de compte, la caisse et la vitrine en ligne sont utilisables immédiatement sans abonnement payant imposé.",
  },
  {
    question: "Puis-je enregistrer des ventes si la connexion Internet est coupée ?",
    answer:
      "Absolument. Vendix est une PWA (Progressive Web App) conçue pour fonctionner hors-ligne. Vos tickets de caisse sont enregistrés localement sur votre téléphone et se synchronisent automatiquement dès que le réseau revient.",
  },
  {
    question: "Que se passe-t-il si je vends un article qui affiche zéro en stock ?",
    answer:
      "La règle métier de Vendix est formelle : on ne bloque jamais une vente devant un client au comptoir. Vous pouvez valider la vente. Le stock passe temporairement en négatif et se régularisera lors de votre prochain bon d'achat.",
  },
  {
    question: "Mes relances de dettes aux clients entraînent-elles des frais SMS ?",
    answer:
      "Non, aucun frais de SMS n'est facturé. Vendix génère un lien direct WhatsApp préformaté avec le nom du client et le montant exact restant dû, que vous envoyez gratuitement en un clic.",
  },
  {
    question: "Comment mes clients accèdent-ils à ma vitrine en ligne ?",
    answer:
      "Vous disposez d'un lien unique (ex. vendix.bj/b/votre-boutique) que vous pouvez copier sur votre statut WhatsApp ou envoyer par message. Vos clients voient vos produits et vous commandent directement sur WhatsApp sans rien avoir à installer.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleFaq(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section id="faq" className="border-b border-slate-200/80 bg-vendix-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Foire aux questions
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            Questions fréquentes des commerçants
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Tout ce que vous devez savoir sur le fonctionnement au quotidien, le stock et l'absence de frais cachés.
          </p>
        </div>

        {/* Accordéon FAQ épuré */}
        <div className="mt-12 max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-start justify-between text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-vendix-ink">
                    {item.question}
                  </span>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 max-w-3xl rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <HelpCircle size={18} className="text-vendix-brand" />
            <span className="text-xs text-slate-600">Une autre question sur votre activité ?</span>
          </div>
          <Link to="/inscription" className="text-xs font-bold text-vendix-brand hover:underline">
            Créer ma boutique pour tester directement
          </Link>
        </div>

      </div>
    </section>
  );
}
