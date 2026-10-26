import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Palette,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

const BRAND_PALETTES = [
  { name: "Banque & Prospérité", primary: "#1e40af", secondary: "#f59e0b" },
  { name: "Émeraude & Forêt", primary: "#15803d", secondary: "#ca8a04" },
  { name: "Terre & Cuivre", primary: "#c2410c", secondary: "#eab308" },
  { name: "Ardoise & Argent", primary: "#0f172a", secondary: "#64748b" },
];

const DEMO_PRODUCTS = [
  {
    name: "Riz Parfumé Supérieur (Sac 25kg)",
    retailPrice: "12 500 FCFA",
    wholesalePrice: "11 800 FCFA (dès 5 sacs)",
    views: "142 vues",
  },
  {
    name: "Huile de Palme Raffinée (Bidon 5L)",
    retailPrice: "4 500 FCFA",
    wholesalePrice: "4 200 FCFA (carton de 4)",
    views: "89 vues",
  },
  {
    name: "Savon Liquide Multiusage (Lot 3x1L)",
    retailPrice: "1 500 FCFA",
    wholesalePrice: "1 250 FCFA (dès 10 lots)",
    views: "64 vues",
  },
];

export default function ShopDemoSection() {
  const [selectedPalette, setSelectedPalette] = useState(BRAND_PALETTES[0]);
  const [showViews, setShowViews] = useState(false);

  return (
    <section id="vitrine" className="border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Vitrine Publique Partageable
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-4xl">
            Une boutique en ligne à vos propres couleurs
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Vos clients accèdent à votre catalogue depuis leur navigateur sans créer de compte, consultent vos prix de gros et vous commandent directement sur WhatsApp.
          </p>
        </div>

        {/* Démonstrateur interactif réaliste */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Panneau de configuration commerçant (Gauche) */}
          <div className="rounded-2xl border border-slate-200 bg-vendix-surface p-6 sm:p-7 lg:col-span-5">
            <h3 className="text-base font-bold text-vendix-ink flex items-center gap-2">
              <Palette size={18} className="text-vendix-brand" />
              <span>Simulateur d'apparence de boutique</span>
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choisissez une palette pour voir l'adaptation immédiate du catalogue.
            </p>

            {/* Choix de palette */}
            <div className="mt-6 space-y-2.5">
              <label className="text-xs font-semibold text-slate-700">
                Palette de marque (2 couleurs) :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_PALETTES.map((p) => {
                  const isSelected = selectedPalette.name === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPalette(p)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                        isSelected
                          ? "border-vendix-brand bg-white ring-2 ring-vendix-brand/20 shadow-sm"
                          : "border-slate-200 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <span
                          className="h-5 w-5 rounded-full border border-white"
                          style={{ backgroundColor: p.primary }}
                        />
                        <span
                          className="h-5 w-5 rounded-full border border-white"
                          style={{ backgroundColor: p.secondary }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-vendix-ink">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confidentialité des vues */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-vendix-ink">Compteurs de vues publiques</p>
                  <p className="text-[11px] text-slate-500">
                    Option de confidentialité Vendix
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowViews((v) => !v)}
                  className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition ${
                    showViews
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {showViews ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{showViews ? "Affiché" : "Masqué"}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Le lien de votre vitrine : <span className="font-mono text-vendix-brand font-bold">vendix.bj/b/le-progres</span>
              </p>
            </div>
          </div>

          {/* Rendu aperçu du catalogue client (Droite) */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden lg:col-span-7">
            
            {/* Header de la boutique cliente */}
            <div
              className="p-4 text-white transition-colors duration-300 sm:p-5"
              style={{ backgroundColor: selectedPalette.primary }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold text-white backdrop-blur">
                    P
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold leading-none text-white">
                      Boutique Le Progrès
                    </h4>
                    <p className="mt-1 text-xs text-white/80">
                      Commerce général • Cotonou, Tokpa
                    </p>
                  </div>
                </div>

                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-sm"
                  style={{ backgroundColor: selectedPalette.secondary }}
                >
                  Vitrine active
                </span>
              </div>
            </div>

            {/* Liste des produits de la vitrine */}
            <div className="divide-y divide-slate-100 p-4 sm:p-5">
              {DEMO_PRODUCTS.map((prod) => (
                <div key={prod.name} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-vendix-ink">{prod.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-700">{prod.retailPrice}</span>
                      <span>•</span>
                      <span>En gros : {prod.wholesalePrice}</span>
                      {showViews && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400">{prod.views}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                      <MessageCircle size={13} />
                      Commander
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pied du catalogue */}
            <div className="border-t border-slate-100 bg-slate-50 p-3.5 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>Hébergé sans frais sur la plateforme Vendix</span>
              <span className="font-mono text-[11px] text-vendix-brand font-semibold">Catalogue WhatsApp prêt</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
