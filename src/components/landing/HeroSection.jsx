import { Link } from "react-router-dom";
import {
  Store,
  WifiOff,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Minus,
  Banknote,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: "100% Gratuit au départ",
      detail: "Zéro carte bancaire, sans engagement",
    },
    {
      icon: WifiOff,
      title: "Fonctionne hors-ligne",
      detail: "Vendez même sans connexion Internet",
    },
    {
      icon: Smartphone,
      title: "Taillé pour mobile",
      detail: "Utilisable d'une main au comptoir",
    },
  ];

  return (
    <section className="relative border-b border-slate-200/80 bg-white">
      {/* Grille de fond subtile d'ingénierie */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Colonne gauche : Titre & Proposition de valeur */}
          <div className="lg:col-span-7">
            {/* Tag métier sobre */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1.5 text-xs font-semibold text-vendix-brand">
              <Store size={14} aria-hidden="true" />
              <span>Plateforme de gestion pour grossistes et détaillants</span>
            </div>

            {/* H1 direct et ancré dans le marché */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-vendix-ink sm:text-5xl sm:leading-[1.15]">
              Gérez votre commerce{" "}
              <span className="text-vendix-brand underline decoration-vendix-accent decoration-wavy decoration-2 underline-offset-8">
                plus vite
              </span>{" "}
              que sur un cahier.
            </h1>

            {/* Sous-titre orienté bénéfices terrain */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Ventes rapides au comptoir, relances des dettes sur WhatsApp et vitrine en ligne prête à partager.
              Conçu pour le terrain, opérationnel même sans réseau.
            </p>

            {/* 3 piliers de réassurance concrets */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200/80 bg-vendix-surface p-3.5"
                  >
                    <div className="flex items-center gap-2 text-vendix-brand">
                      <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                      <span className="text-xs font-bold text-vendix-ink">{item.title}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions principales */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/inscription"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
              >
                <span>Créer ma boutique gratuitement</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                to="/connexion"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-vendix-ink transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Accéder à ma caisse
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Prêt en 2 minutes • Sans frais SMS • 100% sécurisé
            </p>
          </div>

          {/* Colonne droite : Vraie interface UI réaliste du produit (Comptoir mobile) */}
          <div className="lg:col-span-5">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-300 bg-slate-900 p-3 shadow-2xl shadow-slate-900/10">
              {/* Cadre smartphone épuré */}
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-white">
                
                {/* En-tête de caisse */}
                <div className="bg-slate-900 px-4 py-3 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Caisse ouverte
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                      Session #042
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Total panier</p>
                      <p className="text-xl font-extrabold text-white">
                        18 500 <span className="text-xs font-semibold text-vendix-accent">FCFA</span>
                      </p>
                    </div>
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      3 articles
                    </span>
                  </div>
                </div>

                {/* Articles du panier en direct */}
                <div className="divide-y divide-slate-100 p-3">
                  <div className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-semibold text-vendix-ink">Riz Parfumé (Sac 25kg)</p>
                      <p className="text-[11px] text-slate-500">12 500 FCFA × 1</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                      <Minus size={11} className="text-slate-500" />
                      <span className="font-bold text-vendix-ink">1</span>
                      <Plus size={11} className="text-slate-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-semibold text-vendix-ink">Huile végétale (Bidon 5L)</p>
                      <p className="text-[11px] text-slate-500">4 500 FCFA × 1</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                      <Minus size={11} className="text-slate-500" />
                      <span className="font-bold text-vendix-ink">1</span>
                      <Plus size={11} className="text-slate-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-semibold text-vendix-ink">Savon de Marseille (Lot)</p>
                      <p className="text-[11px] text-slate-500">1 500 FCFA × 1</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                      <Minus size={11} className="text-slate-500" />
                      <span className="font-bold text-vendix-ink">1</span>
                      <Plus size={11} className="text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Sélection mode de paiement & Encaissement */}
                <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                  <div className="mb-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-semibold">
                    <span className="rounded-lg border border-vendix-brand bg-blue-50 py-1.5 text-vendix-brand font-bold">
                      Espèces
                    </span>
                    <span className="rounded-lg border border-slate-200 bg-white py-1.5 text-slate-600">
                      MTN / Moov
                    </span>
                    <span className="rounded-lg border border-amber-300 bg-amber-50 py-1.5 text-amber-800">
                      Crédit client
                    </span>
                  </div>

                  <div className="flex h-11 items-center justify-between rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white shadow-sm">
                    <span className="flex items-center gap-1.5">
                      <Banknote size={15} />
                      Valider et imprimer reçu
                    </span>
                    <span className="font-mono">18 500 F</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
