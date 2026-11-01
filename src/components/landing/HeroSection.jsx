import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  WifiOff,
  Smartphone,
  Check,
  ArrowRight,
  Plus,
  Minus,
  ShoppingCart,
  BookOpen,
  Package,
  Store,
  Menu,
  Search,
  Droplets,
  Croissant,
  GlassWater,
  Cookie,
} from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const highlightsRef = useRef(null);
  const ctaRef = useRef(null);
  const phoneContainerRef = useRef(null);
  const badgeRef = useRef(null);

  useGSAP(
    () => {
      // Timeline d'entrée séquentielle avec GSAP
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 35,
        opacity: 0,
        duration: 0.9,
      })
        .from(
          subtitleRef.current,
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          highlightsRef.current.children,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
          },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          phoneContainerRef.current,
          {
            scale: 0.92,
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.7"
        )
        .from(
          badgeRef.current,
          {
            scale: 0.6,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.8)",
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  const highlights = [
    {
      icon: Check,
      title: "100% Gratuit",
      subtitle: "au départ",
      color: "bg-vendix-whatsapp",
    },
    {
      icon: WifiOff,
      title: "Fonctionne",
      subtitle: "hors-ligne",
      color: "bg-vendix-brand",
    },
    {
      icon: Smartphone,
      title: "Sur",
      subtitle: "smartphone",
      color: "bg-vendix-accent",
    },
  ];

  const demoProducts = [
    { icon: Droplets, name: "Eau minérale 50cl", price: 300 },
    { icon: Croissant, name: "Pain", price: 200 },
    { icon: GlassWater, name: "Jus naturel", price: 500 },
    { icon: Cookie, name: "Chips", price: 300 },
  ];

  const total = demoProducts.reduce((sum, item) => sum + item.price, 0);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-65px)] flex-col justify-center overflow-hidden border-b border-slate-200/80 bg-vendix-surface"
    >
      {/* Grille de fond technique & halos d'ambiance */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-60"
        aria-hidden="true"
      />
      <div
        className="animate-glow pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-glow pointer-events-none absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Colonne gauche : Titre & Proposition de valeur */}
          <div className="lg:col-span-7">
            {/* H1 direct et ancré dans le marché */}
            <h1
              ref={headlineRef}
              className="text-3xl font-extrabold tracking-tight text-vendix-ink sm:text-5xl lg:text-6xl sm:leading-[1.12]"
            >
              Gérez votre commerce{" "}
              <span className="text-vendix-brand">
                plus vite
              </span>{" "}
              que sur un cahier.
            </h1>

            {/* Sous-titre orienté bénéfices terrain */}
            <p
              ref={subtitleRef}
              className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
            >
              Ventes rapides au comptoir, suivi automatique des dettes et boutique en ligne gratuite.
              <span className="mt-1 block font-bold text-vendix-brand">
                Même sans connexion Internet.
              </span>
            </p>

            {/* 3 piliers de réassurance visuels */}
            <div ref={highlightsRef} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${item.color}`}
                    >
                      <Icon size={20} strokeWidth={2.4} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vendix-ink">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions principales */}
            <div ref={ctaRef} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/signup"
                  className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-vendix-brand px-7 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-vendix-brand-dark hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
                >
                  <span>Commencer gratuitement</span>
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-vendix-ink transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Accéder à ma caisse
                </Link>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Prêt en 2 minutes • Sans carte bancaire • 100% sécurisé
              </p>
            </div>
          </div>

          {/* Colonne droite : Smartphone interactif vivant & badge flottant */}
          <div
            ref={phoneContainerRef}
            className="relative mx-auto flex w-full max-w-lg items-center justify-center py-4 lg:col-span-5"
          >
            {/* Halo lumineux de fond */}
            <div
              className="absolute h-72 w-72 rounded-full bg-blue-100/80 blur-2xl sm:h-96 sm:w-96"
              aria-hidden="true"
            />
            <div
              className="absolute h-64 w-64 rounded-full bg-vendix-brand/10 blur-xl sm:h-80 sm:w-80"
              aria-hidden="true"
            />

            {/* Smartphone avec animation flottante douce */}
            <div className="animate-float-phone relative z-10 w-64 rounded-[2.5rem] border-[7px] border-slate-800 bg-slate-800 p-2 shadow-2xl shadow-slate-900/25 sm:w-72">
              {/* Écran */}
              <div className="overflow-hidden rounded-[1.8rem] bg-white">
                
                {/* En-tête smartphone Vendix */}
                <div className="bg-vendix-brand px-4 pb-4 pt-4 text-white">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-base font-extrabold tracking-tight">
                      <Menu size={18} aria-hidden="true" />
                      Vendix
                    </span>
                    <Search size={18} aria-hidden="true" />
                  </div>

                  <p className="flex items-center gap-2 text-sm font-bold">
                    <ShoppingCart size={16} aria-hidden="true" />
                    Vente au comptoir
                  </p>
                </div>

                {/* Onglets rapides */}
                <div className="flex gap-2 bg-slate-50 px-3 py-2.5 text-xs font-semibold">
                  <span className="flex-1 rounded-full bg-vendix-brand px-3 py-1.5 text-center text-white shadow-xs">
                    Produits
                  </span>
                  <span className="flex-1 rounded-full bg-slate-200 px-3 py-1.5 text-center text-slate-600">
                    Catégories
                  </span>
                </div>

                {/* Liste des articles avec icônes et boutons de quantité */}
                <div className="space-y-0.5 px-3 py-1.5">
                  {demoProducts.map((produit) => {
                    const Icon = produit.icon;
                    return (
                      <div
                        key={produit.name}
                        className="flex items-center gap-2 border-b border-slate-100 py-2.5 last:border-0"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-vendix-surface text-vendix-brand">
                          <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-vendix-ink">
                            {produit.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {produit.price} FCFA
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full bg-vendix-surface px-2 py-0.5 text-xs font-bold text-vendix-brand">
                          <Minus size={11} aria-hidden="true" />
                          <span>1</span>
                          <Plus size={11} aria-hidden="true" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total de la vente */}
                <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">Total</span>
                    <span className="text-base font-extrabold text-vendix-ink">
                      {total.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-vendix-brand-dark"
                  >
                    <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                    Encaisser
                  </button>
                </div>

                {/* Barre de navigation basse */}
                <div className="grid grid-cols-4 border-t border-slate-200 bg-white px-1 py-2 text-center text-[10px] text-slate-500">
                  <div className="flex flex-col items-center gap-0.5 font-bold text-vendix-brand">
                    <ShoppingCart size={15} aria-hidden="true" />
                    <p>Vente</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <BookOpen size={15} aria-hidden="true" />
                    <p>Dettes</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Package size={15} aria-hidden="true" />
                    <p>Stock</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Store size={15} aria-hidden="true" />
                    <p>Boutique</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Badge flottant "Vente validée en 12s" */}
            <div
              ref={badgeRef}
              className="absolute right-2 top-10 z-20 flex items-center gap-2 rounded-full bg-vendix-whatsapp px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-green-900/20 sm:-right-4 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-vendix-whatsapp">
                <Check size={13} strokeWidth={3} aria-hidden="true" />
              </span>
              <span>Vente validée en 12s</span>
            </div>

            {/* Éléments géométriques ambre subtils */}
            <div
              className="absolute right-4 top-2 h-7 w-2 rotate-12 rounded-full bg-vendix-accent"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-10 left-2 h-2 w-10 rotate-12 rounded-full bg-vendix-accent"
              aria-hidden="true"
            />

          </div>

        </div>
      </div>
    </section>
  );
}
