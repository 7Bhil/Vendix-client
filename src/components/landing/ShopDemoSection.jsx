
import { useState } from "react";
import {
  Store,
  LockKeyhole,
  Eye,
  Check,
} from "lucide-react";

const brandColors = [
  { name: "Bleu Vendix", value: "#1e40af" },
  { name: "Vert émeraude", value: "#059669" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rouge", value: "#e11d48" },
  { name: "Orange", value: "#ea580c" },
  { name: "Noir", value: "#1f2937" },
];

const demoProducts = [
  {
    name: "Riz parfumé",
    category: "Alimentation",
    price: "12 500 FCFA",
    image: "/images/products/riz.jpg",
    views: "320",
  },
  {
    name: "Huile végétale",
    category: "Épicerie",
    price: "2 000 FCFA",
    image: "/images/products/huile.jpg",
    views: "185",
  },
  {
    name: "Savon liquide",
    category: "Entretien",
    price: "1 500 FCFA",
    image: "/images/products/savon.jpg",
    views: "96",
  },
];

function ShopDemoSection() {
  const [primaryColor, setPrimaryColor] = useState("#1e40af");
  const [secondaryColor, setSecondaryColor] = useState("#059669");
  const [showViews, setShowViews] = useState(false);

  return (
    <section
      id="vitrine"
      className="overflow-hidden bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-blue-100 bg-vendix-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-vendix-brand">
            Votre identité, votre boutique
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-vendix-ink sm:text-4xl lg:text-5xl">
            Une boutique publique à vos{" "}
            <span className="text-vendix-brand">
              propres couleurs.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Personnalisez votre vitrine, mettez vos produits en
            valeur et partagez votre boutique avec vos clients.
            C'est vous qui choisissez votre identité visuelle.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Panneau de personnalisation */}
          <div className="rounded-3xl border border-slate-200 bg-vendix-surface p-6 sm:p-8 lg:col-span-2">
            <div className="mb-7">
              <span className="text-sm font-bold uppercase tracking-wider text-vendix-brand">
                Personnalisation
              </span>

              <h3 className="mt-2 text-2xl font-extrabold text-vendix-ink">
                Créez votre style
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choisissez vos deux couleurs et observez le résultat
                directement dans l'aperçu.
              </p>
            </div>

            {/* Couleur principale */}
            <div className="mb-6">
              <label
                htmlFor="primary-color"
                className="mb-3 block text-sm font-bold text-vendix-ink"
              >
                1. Couleur principale
              </label>

              <div className="flex items-center gap-3">
                <span
                  className="h-11 w-11 shrink-0 rounded-xl border border-black/10"
                  style={{ backgroundColor: primaryColor }}
                  aria-hidden="true"
                />

                <select
                  id="primary-color"
                  value={primaryColor}
                  onChange={(event) =>
                    setPrimaryColor(event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-vendix-ink outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                >
                  {brandColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Utilisée pour les boutons et les éléments principaux.
              </p>
            </div>

            {/* Couleur secondaire */}
            <div className="mb-7">
              <label
                htmlFor="secondary-color"
                className="mb-3 block text-sm font-bold text-vendix-ink"
              >
                2. Couleur secondaire
              </label>

              <div className="flex items-center gap-3">
                <span
                  className="h-11 w-11 shrink-0 rounded-xl border border-black/10"
                  style={{ backgroundColor: secondaryColor }}
                  aria-hidden="true"
                />

                <select
                  id="secondary-color"
                  value={secondaryColor}
                  onChange={(event) =>
                    setSecondaryColor(event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-vendix-ink outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                >
                  {brandColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Pour les accents visuels et les détails de votre vitrine.
              </p>
            </div>

            {/* Affichage des vues */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <input
                  id="show-views"
                  type="checkbox"
                  checked={showViews}
                  onChange={(event) =>
                    setShowViews(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-blue-700"
                />

                <div>
                  <label
                    htmlFor="show-views"
                    className="cursor-pointer text-sm font-bold text-vendix-ink"
                  >
                    Afficher le nombre de vues
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {showViews
                      ? "Le nombre de vues est visible dans l'aperçu public."
                      : "Le nombre de vues reste masqué dans l'aperçu public."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <LockKeyhole
                size={16}
                className="shrink-0 text-vendix-brand"
                aria-hidden="true"
              />
              Vous gardez le contrôle sur les informations affichées.
            </div>
          </div>

          {/* Aperçu de la boutique */}
          <div className="min-w-0 lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Aperçu en direct
                </span>
                <h3 className="mt-1 text-lg font-bold text-vendix-ink">
                  Votre vitrine publique
                </h3>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-vendix-surface px-3 py-2 text-xs font-semibold text-vendix-brand">
                <span
                  className="h-2 w-2 rounded-full bg-vendix-brand"
                  aria-hidden="true"
                />
                Démonstration
              </span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              {/* En-tête de la boutique */}
              <div
                className="p-6 text-white sm:p-8"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <Store
                        size={25}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-lg font-extrabold sm:text-xl">
                        Le Progrès
                      </p>
                      <p className="mt-1 text-xs text-white/80">
                        Votre boutique de proximité
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold">
                    En ligne
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-sm text-white/80">
                    Bienvenue chez nous !
                  </p>
                  <h4 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                    Nos produits
                  </h4>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                    Découvrez notre sélection et contactez-nous
                    pour passer commande.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                  <span
                    className="rounded-full px-3 py-2 font-semibold text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    Qualité & proximité
                  </span>

                  {showViews && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                      <Eye size={14} aria-hidden="true" />
                      Vues : 1 248
                    </span>
                  )}
                </div>
              </div>

              {/* Produits avec les vraies images */}
              <div className="p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h4 className="font-bold text-vendix-ink">
                    Nos articles
                  </h4>
                  <span className="text-xs text-slate-500">
                    3 produits
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {demoProducts.map((product) => (
                    <article
                      key={product.name}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
                    >
                      <div className="flex h-36 items-center justify-center overflow-hidden bg-vendix-surface sm:h-32">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-3">
                        <p className="text-xs text-slate-500">
                          {product.category}
                        </p>

                        <h5 className="mt-1 font-bold text-vendix-ink">
                          {product.name}
                        </h5>

                        <p
                          className="mt-2 text-sm font-extrabold"
                          style={{ color: primaryColor }}
                        >
                          {product.price}
                        </p>

                        {showViews && (
                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                            <Eye size={13} aria-hidden="true" />
                            {product.views} vues
                          </p>
                        )}

                        <button
                          type="button"
                          className="mt-3 w-full rounded-lg px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Voir le produit
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pied de la vitrine */}
                <div
                  className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
                  style={{
                    backgroundColor: `${secondaryColor}12`,
                    border: `1px solid ${secondaryColor}35`,
                  }}
                >
                  <div>
                    <p className="text-sm font-bold text-vendix-ink">
                      Le Progrès
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Vitrine créée avec Vendix
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Check size={15} aria-hidden="true" />
                    Contacter la boutique
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Aperçu fictif : les produits, les prix et les vues
              sont uniquement des exemples de démonstration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopDemoSection;
