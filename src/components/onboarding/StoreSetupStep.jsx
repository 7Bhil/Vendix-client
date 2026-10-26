import { useState } from "react";
import { Store, MessageCircle, Palette, Check, ArrowRight } from "lucide-react";

const PRESET_PALETTES = [
  { name: "Bleu Vendix & Ambre", primary: "#1e40af", secondary: "#f59e0b" },
  { name: "Vert Forêt & Ocre", primary: "#15803d", secondary: "#ca8a04" },
  { name: "Terre & Ambre Foncé", primary: "#c2410c", secondary: "#eab308" },
  { name: "Ardoise & Argent", primary: "#0f172a", secondary: "#64748b" },
  { name: "Bordeaux & Sable", primary: "#881337", secondary: "#f59e0b" },
  { name: "Indigo & Ciel", primary: "#3730a3", secondary: "#0284c7" },
];

export default function StoreSetupStep({ initialData, onNext }) {
  const [shopName, setShopName] = useState(initialData?.shopName || "");
  const [whatsappPhone, setWhatsappPhone] = useState(initialData?.whatsappPhone || "");
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || PRESET_PALETTES[0].primary);
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || PRESET_PALETTES[0].secondary);
  const [error, setError] = useState("");

  function handleSelectPalette(palette) {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    // Application dynamique directe dans les variables CSS
    document.documentElement.style.setProperty("--shop-primary", palette.primary);
    document.documentElement.style.setProperty("--shop-secondary", palette.secondary);
  }

  function handlePrimaryChange(color) {
    setPrimaryColor(color);
    document.documentElement.style.setProperty("--shop-primary", color);
  }

  function handleSecondaryChange(color) {
    setSecondaryColor(color);
    document.documentElement.style.setProperty("--shop-secondary", color);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!shopName.trim()) {
      setError("Veuillez renseigner le nom de votre commerce.");
      return;
    }

    if (!whatsappPhone.trim()) {
      setError("Veuillez renseigner votre numéro WhatsApp professionnel.");
      return;
    }

    // Sauvegarde et passage à l'étape suivante
    onNext({
      shopName: shopName.trim(),
      whatsappPhone: whatsappPhone.trim(),
      primaryColor,
      secondaryColor,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Nom du commerce */}
      <div>
        <label htmlFor="shopName" className="block text-xs font-bold text-vendix-ink">
          Nom du commerce <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Store size={18} aria-hidden="true" />
          </div>
          <input
            id="shopName"
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Ex : Établissement Le Progrès"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Ce nom sera affiché en en-tête de vos reçus et sur votre vitrine web.
        </p>
      </div>

      {/* Numéro WhatsApp */}
      <div>
        <label htmlFor="whatsappPhone" className="block text-xs font-bold text-vendix-ink">
          Numéro WhatsApp client <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
            <MessageCircle size={18} aria-hidden="true" />
          </div>
          <input
            id="whatsappPhone"
            type="tel"
            required
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder="Ex : 0197000000"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Les commandes de vos clients et les relances arriveront sur ce numéro.
        </p>
      </div>

      {/* Choix des couleurs & Prévisualisation */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-vendix-ink">
          <Palette size={16} className="text-vendix-brand" />
          <span>Couleurs de votre marque</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Choisissez une harmonie recommandée ou personnalisez librement votre teinte principale et secondaire.
        </p>

        {/* Palettes préconfigurées */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRESET_PALETTES.map((p) => {
            const isSelected = p.primary === primaryColor && p.secondary === secondaryColor;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelectPalette(p)}
                className={`flex h-12 items-center justify-between rounded-xl border p-2 text-left transition ${
                  isSelected
                    ? "border-vendix-brand bg-white shadow-sm ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-6 w-6 rounded-lg border border-black/10 shadow-xs"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="h-6 w-6 rounded-lg border border-black/10 shadow-xs"
                    style={{ backgroundColor: p.secondary }}
                  />
                </div>
                {isSelected && <Check size={16} className="text-vendix-brand" />}
              </button>
            );
          })}
        </div>

        {/* Sélecteurs individuels */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold text-slate-700">Couleur Principale</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500 uppercase">{primaryColor}</span>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border border-slate-300 bg-transparent p-0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-semibold text-slate-700">Couleur Secondaire</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500 uppercase">{secondaryColor}</span>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => handleSecondaryChange(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border border-slate-300 bg-transparent p-0"
              />
            </div>
          </div>
        </div>

        {/* Aperçu en direct de la bannière boutique */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="p-3 text-white" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs font-bold">
                  {shopName ? shopName.charAt(0).toUpperCase() : "V"}
                </div>
                <span className="text-xs font-bold tracking-tight">
                  {shopName || "Nom de votre boutique"}
                </span>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold text-slate-900"
                style={{ backgroundColor: secondaryColor }}
              >
                Catalogue Web
              </span>
            </div>
          </div>
          <div className="p-2.5 text-center text-[11px] text-slate-500">
            Aperçu en temps réel de votre identité visuelle
          </div>
        </div>
      </div>

      {/* Bouton Suivant */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
      >
        <span>Continuer vers le premier produit</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
