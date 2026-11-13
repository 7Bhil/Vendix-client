import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Store,
  Phone,
  Search,
  MessageCircle,
  Eye,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  User,
  CheckCircle2,
  PackageX,
} from "lucide-react";
import { publicShopService } from "../../api/services.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

export default function PublicShopPage({ shopSlug: propSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = (propSlug || routeSlug || "").trim().toLowerCase();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState({});
  const [customerName, setCustomerName] = useState("");

  // Chargement des données de la boutique et des articles
  useEffect(() => {
    let isCancelled = false;

    async function loadShopData() {
      if (!slug) {
        setError("Aucun identifiant de boutique renseigné.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [shopRes, productsRes] = await Promise.all([
          publicShopService.getBySlug(slug),
          publicShopService.getProducts(slug),
        ]);

        if (isCancelled) return;

        setShop(shopRes);
        setProducts(Array.isArray(productsRes) ? productsRes : []);

        // Suivi discret de visite (sans impacter le rendu en cas d'erreur)
        publicShopService.trackVisit(slug, {
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }).catch(() => {});
      } catch (err) {
        if (isCancelled) return;
        setError(
          err.status === 404
            ? "Cette boutique est introuvable ou n'est plus accessible."
            : err.message || "Impossible de charger les données de la boutique."
        );
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadShopData();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // Liste des catégories extraite de la boutique ou des produits
  const categories = useMemo(() => {
    const set = new Set();
    if (shop?.categories && Array.isArray(shop.categories)) {
      shop.categories.forEach((c) => {
        if (c?.name) set.add(c.name);
      });
    }
    products.forEach((p) => {
      if (typeof p.category === "string" && p.category) {
        set.add(p.category);
      } else if (p.category?.name) {
        set.add(p.category.name);
      }
    });
    return ["all", ...Array.from(set)];
  }, [shop, products]);

  // Filtrage des articles selon recherche et catégorie
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const catName =
        typeof product.category === "string"
          ? product.category
          : product.category?.name || "";
      const matchesCat =
        selectedCategory === "all" || catName === selectedCategory;
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

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

  // Calculs financiers de la commande
  const orderDetails = useMemo(() => {
    let totalAmount = 0;
    let totalQuantity = 0;
    const lines = [];

    Object.entries(selectedItems).forEach(([id, qty]) => {
      if (qty <= 0) return;
      const product = products.find((p) => String(p.id) === String(id));
      if (!product) return;

      const baseUnitObj =
        product.product_units?.find((u) => u.is_base_unit) ||
        product.product_units?.[0];
      const unitLabel = baseUnitObj?.label || product.baseUnit || "unité";
      const unitPrice = Number(
        baseUnitObj?.retail_price ?? product.base_price ?? product.publicPrice ?? 0
      );
      const subtotal = unitPrice * qty;

      totalAmount += subtotal;
      totalQuantity += qty;

      lines.push({
        id,
        name: product.name,
        quantity: qty,
        unitLabel,
        unitPrice,
        subtotal,
      });
    });

    return { totalAmount, totalQuantity, lines };
  }, [selectedItems, products]);

  // Construction du message WhatsApp complet et transparent
  const handleOrderWhatsApp = () => {
    if (!shop) return;

    const shopName = shop.name || "la boutique";
    const shopWhatsapp = shop.whatsapp || shop.whatsapp_number || "";
    const cleanPhone = shopWhatsapp.replace(/[^0-9]/g, "");

    let message = "";

    if (orderDetails.lines.length > 0) {
      const header = customerName.trim()
        ? `Bonjour ${shopName}, je m'appelle ${customerName.trim()} et je souhaite passer une commande depuis votre boutique en ligne :\n\n`
        : `Bonjour ${shopName}, je souhaite passer une commande depuis votre boutique en ligne :\n\n`;

      const itemsText = orderDetails.lines
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.name}*\n` +
            `   - Quantité : ${item.quantity} ${item.unitLabel}\n` +
            `   - Prix unitaire : ${formatPrice(item.unitPrice)}\n` +
            `   - Sous-total : ${formatPrice(item.subtotal)}`
        )
        .join("\n\n");

      const summaryText =
        `\n\n------------------------------\n` +
        `*TOTAL ESTIMÉ : ${formatPrice(orderDetails.totalAmount)}*\n` +
        `------------------------------\n\n` +
        `Merci de me confirmer la disponibilité des articles ainsi que les modalités de livraison et de paiement.`;

      message = header + itemsText + summaryText;
    } else {
      message = customerName.trim()
        ? `Bonjour ${shopName}, je m'appelle ${customerName.trim()}. Je consulte votre boutique en ligne et souhaite avoir des renseignements.`
        : `Bonjour ${shopName}, je consulte votre boutique en ligne et souhaite avoir des renseignements.`;
    }

    if (!cleanPhone) {
      alert("Numéro WhatsApp de la boutique non disponible.");
      return;
    }

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // État 1 : Chargement (Skeleton UI)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-200 sm:h-20 sm:w-20" />
                <div className="space-y-2">
                  <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
              <div className="h-11 w-44 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-32 animate-pulse bg-slate-200 sm:h-36" />
                <div className="space-y-2 p-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-8 w-full animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // État 2 : Erreur ou Boutique introuvable (404)
  if (error || !shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">
            Boutique introuvable
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            {error || "Nous ne parvenons pas à charger la boutique demandée."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Retour à l'accueil
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shopWhatsapp = shop.whatsapp || shop.whatsapp_number || "";
  const shopLogo = shop.logoUrl || shop.logo_url;
  const brandColor = shop.primaryColor || shop.primary_color || "#2563eb";
  const secondaryColor = shop.secondaryColor || shop.secondary_color || "#ca8a04";

  // État 3 : Nominal
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-28"
      style={{ "--shop-primary": brandColor, "--shop-secondary": secondaryColor }}
    >
      {/* En-tête Boutique */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="h-1" style={{ backgroundColor: "var(--shop-secondary)" }} />
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Vitrine en ligne certifiée</span>
          </div>

          <Link
            to="/"
            className="text-xs font-extrabold tracking-tight text-slate-600 hover:text-slate-900 transition"
          >
            Propulsé par <span className="text-vendix-brand font-black">Vendix</span>
          </Link>
        </div>

        {/* Bannière de la boutique */}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white shadow-md sm:h-20 sm:w-20"
                style={{ backgroundColor: brandColor }}
              >
                {shopLogo ? (
                  <img
                    src={shopLogo}
                    alt={shop.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={32} />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                    {shop.name}
                  </h1>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                    {slug}.vendix.com
                  </span>
                </div>

                {shop.description && (
                  <p className="mt-1 line-clamp-2 max-w-xl text-xs text-slate-600 sm:text-sm">
                    {shop.description}
                  </p>
                )}

                {shop.tagline && <p className="mt-1 text-xs font-semibold text-slate-700">{shop.tagline}</p>}

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  {shopWhatsapp && (
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <Phone size={13} />
                      {shopWhatsapp}
                    </span>
                  )}
                  {shopWhatsapp && <span>•</span>}
                  <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Catalogue ouvert
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton Contact WhatsApp Direct */}
            {shopWhatsapp && (
              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                style={{ backgroundColor: "var(--shop-primary)" }}
              >
                <MessageCircle size={17} />
                <span>Contacter sur WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Zone de recherche, filtres et catalogue */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Rechercher un produit dans le catalogue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {categories.length > 1 && (
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
                        ? "text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                    style={active ? { backgroundColor: "var(--shop-primary)" } : undefined}
                  >
                    {cat === "all" ? "Tout voir" : cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grille des produits ou état vide */}
        {filteredProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <PackageX size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Aucun produit disponible
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              {searchTerm || selectedCategory !== "all"
                ? "Aucun article ne correspond à vos critères de recherche."
                : "La boutique n'a pas encore publié d'articles dans sa vitrine."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredProducts.map((product) => {
              const count = selectedItems[product.id] || 0;
              const photo =
                product.image_url || product.photoUrl || product.photo_url;
              const baseUnitObj =
                product.product_units?.find((u) => u.is_base_unit) ||
                product.product_units?.[0];
              const unitLabel =
                baseUnitObj?.label || product.baseUnit || "unité";
              const unitPrice = Number(
                baseUnitObj?.retail_price ??
                  product.base_price ??
                  product.publicPrice ??
                  0
              );
              const catName =
                typeof product.category === "string"
                  ? product.category
                  : product.category?.name || "";
              const showViews =
                (shop.showViewsToPublic ?? shop.show_views_public) &&
                product.views_count != null;

              return (
                <article
                  key={product.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-32 bg-slate-100 sm:h-36">
                    {photo ? (
                      <img
                        src={photo}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <ShoppingBag size={28} />
                      </div>
                    )}

                    {showViews && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        <Eye size={11} />
                        <span>{product.views_count} vues</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      {catName && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {catName}
                        </span>
                      )}
                      <h3 className="line-clamp-2 mt-0.5 text-xs font-bold leading-snug text-slate-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {formatPrice(unitPrice)}
                        <span className="ml-1 text-[10px] font-medium text-slate-400">
                          / {unitLabel}
                        </span>
                      </p>
                    </div>

                    {/* Sélecteur de commande */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      {count === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 transition hover:bg-slate-900 hover:border-slate-900 hover:text-white"
                        >
                          <span>Choisir</span>
                        </button>
                      ) : (
                        <div className="flex h-9 items-center justify-between rounded-xl bg-slate-900 text-white px-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="h-6 w-6 rounded-lg text-sm font-bold hover:bg-white/20"
                            aria-label="Diminuer la quantité"
                          >
                            -
                          </button>
                          <span className="text-xs font-black">{count}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="h-6 w-6 rounded-lg text-sm font-bold hover:bg-white/20"
                            aria-label="Augmenter la quantité"
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
        )}
      </main>

      {/* Barre d'action fixe en bas si des articles sont choisis */}
      {orderDetails.totalQuantity > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3.5 backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex max-w-2xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500">
                  {orderDetails.totalQuantity} article
                  {orderDetails.totalQuantity > 1 ? "s" : ""} sélectionné
                  {orderDetails.totalQuantity > 1 ? "s" : ""}
                </p>
                <p className="text-sm font-black text-slate-900">
                  Total : {formatPrice(orderDetails.totalAmount)}
                </p>
              </div>

              {/* Champ optionnel pour le nom du client */}
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Votre nom (optionnel)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-9 w-36 sm:w-48 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-xs outline-none transition focus:border-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
            >
              <MessageCircle size={16} />
              <span>Commander via WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
