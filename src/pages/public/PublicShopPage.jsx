import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Store,
  Phone,
  Search,
  MessageCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";

import publicShopData from "../../mocks/modules/public-shop.json";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function PublicShopPage({ shopSlug: propSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = propSlug || routeSlug || "demo";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState({});

  const { shop, publicCategories, publicProducts } = publicShopData;

  const categories = useMemo(() => ["all", ...publicCategories], [publicCategories]);

  const filteredProducts = useMemo(() => {
    return publicProducts.filter((product) => {
      const matchesCat =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [publicProducts, selectedCategory, searchTerm]);

  const handleQuantityChange = (productId, delta) => {
    setSelectedItems((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(current + delta, 0);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const selectedCount = Object.values(selectedItems).reduce((a, b) => a + b, 0);

  // Construction du message WhatsApp de pré-commande
  const handleOrderWhatsApp = () => {
    const lines = Object.entries(selectedItems)
      .map(([id, qty]) => {
        const prod = publicProducts.find((p) => p.id === id);
        return prod ? `- ${prod.name} : ${qty} ${prod.baseUnit || "unité(s)"}` : null;
      })
      .filter(Boolean);

    const greeting = `Bonjour ${shop.name}, je souhaite commander depuis votre boutique en ligne (vendix.com) :\n\n`;
    const message = lines.length > 0
      ? greeting + lines.join("\n") + "\n\nMerci de me confirmer la disponibilité et le montant total."
      : `Bonjour ${shop.name}, je consulte votre boutique en ligne Vendix et souhaite avoir des renseignements.`;

    const cleanPhone = shop.whatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* En-tête Boutique */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Boutique en ligne vérifiée</span>
          </div>

          <Link
            to="/"
            className="text-xs font-extrabold tracking-tight text-vendix-brand hover:underline"
          >
            Propulsé par Vendix.com
          </Link>
        </div>

        {/* Bannière de la boutique */}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-vendix-brand text-white shadow-md sm:h-20 sm:w-20">
                <Store size={32} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {shop.name}
                  </h1>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-vendix-brand">
                    {slug}.vendix.com
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 max-w-xl text-xs text-slate-600 sm:text-sm">
                  {shop.description}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Phone size={13} />
                    {shop.whatsapp}
                  </span>
                  <span>•</span>
                  <span>Ouvert au public</span>
                </div>
              </div>
            </div>

            {/* Bouton Contact WhatsApp Direct */}
            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <MessageCircle size={17} />
              <span>Commander via WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Recherche et Filtres */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Rechercher un produit dans la boutique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-9 shrink-0 rounded-xl px-3 text-xs font-semibold transition ${
                    active
                      ? "bg-vendix-brand text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat === "all" ? "Tout voir" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille des produits publics */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredProducts.map((product) => {
            const count = selectedItems[product.id] || 0;

            return (
              <article
                key={product.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-32 bg-slate-100 sm:h-36">
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ShoppingBag size={28} />
                    </div>
                  )}

                  {shop.showViewsToPublic && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Eye size={11} />
                      <span>{product.viewsCount} vues</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <h3 className="line-clamp-2 mt-0.5 text-xs font-bold leading-snug text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-black text-vendix-brand">
                      {formatPrice(product.publicPrice)}
                      <span className="ml-1 text-[10px] font-medium text-slate-400">
                        / {product.baseUnit}
                      </span>
                    </p>
                  </div>

                  {/* Sélecteur de pré-commande */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    {count === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-vendix-brand/30 bg-blue-50/60 text-xs font-bold text-vendix-brand transition hover:bg-vendix-brand hover:text-white"
                      >
                        <span>Choisir</span>
                      </button>
                    ) : (
                      <div className="flex h-9 items-center justify-between rounded-xl bg-vendix-brand text-white px-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="h-6 w-6 rounded-lg text-sm font-bold hover:bg-white/20"
                        >
                          -
                        </button>
                        <span className="text-xs font-black">{count}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="h-6 w-6 rounded-lg text-sm font-bold hover:bg-white/20"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Barre d'action fixe en bas si des articles sont choisis */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3.5 backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-500">
                {selectedCount} article{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs font-extrabold text-emerald-800">
                Prêt pour WhatsApp
              </p>
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
            >
              <MessageCircle size={16} />
              <span>Envoyer la commande</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
