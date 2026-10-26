import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Zap,
  BookOpen,
  Boxes,
  Share2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useGSAP(
    () => {
      // Animation douce d'apparition sans laisser d'opacité à 0 si le trigger est manqué
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      if (cardsRef.current?.children) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    },
    { scope: sectionRef }
  );

  const pillars = [
    {
      number: "01",
      icon: Zap,
      title: "Vente express au comptoir (< 30s)",
      description:
        "Sélection tactile des articles, gestion automatique gros / demi-gros / détail, calcul immédiat de la monnaie et reçu PDF partageable.",
      bullets: ["Compatible tactile d'une main", "Calcul monnaie automatique", "Reçu numérique sans imprimante"],
    },
    {
      number: "02",
      icon: BookOpen,
      title: "Carnet de crédit & Relances WhatsApp",
      description:
        "Historique immuable de chaque dette client. Un bouton direct ouvre WhatsApp avec un rappel courtois prérempli sans aucun frais SMS pour vous.",
      bullets: ["Règle FIFO des remboursements", "Zéro frais SMS imposé", "Solde restant dû en direct"],
    },
    {
      number: "03",
      icon: Boxes,
      title: "Stock sans blocage au comptoir",
      description:
        "Traçabilité intégrale des entrées, sorties et pertes. Règle métier Vendix : autorisation formelle de vendre même en rupture de stock avec régularisation ultérieure.",
      bullets: ["Unités multiples (carton, paquet, pièce)", "Alerte seuil critique", "Jamais de blocage devant le client"],
    },
    {
      number: "04",
      icon: Share2,
      title: "Boutique en ligne prête à partager",
      description:
        "Un lien unique personnalisé (vendix.bj/b/votre-boutique) à vos couleurs pour exposer vos produits sur WhatsApp sans frais d'hébergement.",
      bullets: ["Catalogue web sans installation", "Commandes reçues sur WhatsApp", "Personnalisation aux couleurs de votre marque"],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="fonctionnalites"
      className="border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Les 4 Piliers Vendix
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            L'essentiel pour faire tourner un commerce physique
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Débarrassé du superflu. Chaque fonctionnalité répond à une situation concrète vécue derrière le comptoir.
          </p>
        </div>

        {/* Grille 2x2 propre */}
        <div ref={cardsRef} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-vendix-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vendix-brand text-white shadow-sm">
                      <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      PILIER {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-vendix-ink">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200/80 pt-4">
                  <ul className="space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action direct vers l'essai */}
        <div className="mt-12 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-sm font-bold text-vendix-brand hover:underline"
          >
            <span>Démarrer sans frais avec ces fonctionnalités</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
