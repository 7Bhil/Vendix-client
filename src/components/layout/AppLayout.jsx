import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Store,
  Boxes,
  LogOut,
} from "lucide-react";
import OfflineSyncBadge from "../dashboard/OfflineSyncBadge";
import { useAuth } from "../../context/AuthContext.jsx";

const NAVIGATION_ITEMS = [
  {
    name: "Tableau de bord",
    shortName: "Accueil",
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Caisse & Vente",
    shortName: "Caisse",
    path: "/app/sales/new",
    icon: ShoppingCart,
    isPrimary: true,
  },
  {
    name: "Clients & Dettes",
    shortName: "Clients",
    path: "/app/customers",
    icon: Users,
  },
  {
    name: "Catalogue Produits",
    shortName: "Produits",
    path: "/app/products",
    icon: Package,
  },
  {
    name: "Stock",
    shortName: "Stock",
    path: "/app/stock",
    icon: Boxes,
  },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isCurrent = (path) => {
    if (path === "/app/customers") {
      return location.pathname.startsWith("/app/customers");
    }

    if (path === "/app/products") {
      return location.pathname.startsWith("/app/products");
    }

    if (path === "/app/stock") {
      return location.pathname.startsWith("/app/stock");
    }

    return location.pathname === path;
  };

  const shopDisplayName = user?.shopName || "Ma boutique Vendix";

  return (
    <div className="flex min-h-screen bg-slate-50 text-vendix-ink">
      {/* Espace réservé desktop pour compenser la sidebar fixe */}
      <div className="hidden md:block w-20 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] print:hidden" />

      {/* Barre latérale desktop rétractable / extensible au survol avec transition fluide */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 bottom-0 left-0 z-50 flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] print:hidden ${
          isHovered ? "w-64 shadow-2xl ring-1 ring-slate-900/5" : "w-20 shadow-sm"
        }`}
      >
        {/* En-tête de la marque */}
        <div className="flex h-16 items-center border-b border-slate-100 px-5 overflow-hidden">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-vendix-brand rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vendix-brand text-white shadow-sm transition-transform duration-300 group-hover:scale-105 active:scale-95">
              <Store size={20} />
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
              }`}
            >
              Vendix<span className="text-vendix-accent">.</span>
            </span>
          </Link>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-hidden">
          <div className="h-5 px-2">
            <p
              className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              Espace Marchand
            </p>
          </div>

          <div className="mt-2 space-y-1">
            {NAVIGATION_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!isHovered ? item.name : undefined}
                  style={{
                    transitionDelay: isHovered ? `${index * 25}ms` : "0ms",
                  }}
                  className={`flex items-center gap-3.5 rounded-xl p-2.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-blue-50/80 text-vendix-brand font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-110">
                    <Icon
                      size={21}
                      className={active ? "text-vendix-brand" : "text-slate-400"}
                    />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Statut hors-ligne, compte et déconnexion */}
        <div className="border-t border-slate-100 p-3 overflow-hidden space-y-2">
          <div className="flex justify-center overflow-hidden">
            <div className="w-full">
              {isHovered ? (
                <div className="transition-opacity duration-300 animate-fade-in">
                  <OfflineSyncBadge />
                </div>
              ) : (
                <div className="flex justify-center" title="Statut de synchronisation">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl bg-slate-50 p-2.5 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Boutique connectée
            </p>
            <p className="truncate text-xs font-bold text-slate-800">
              {shopDisplayName}
            </p>
          </div>

          {/* Bouton de Déconnexion Desktop */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={!isHovered ? "Déconnexion" : undefined}
            className={`flex w-full items-center gap-3.5 rounded-xl p-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-110">
              <LogOut size={20} className="text-rose-600" />
            </div>
            <span
              className={`whitespace-nowrap font-medium transition-all duration-300 ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"
              }`}
            >
              {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
            </span>
          </button>
        </div>
      </aside>

      {/* Contenu principal avec transition fluide de page */}
      <div className="flex flex-1 flex-col pb-24 md:pb-0 min-w-0">
        {/* Barre du haut mobile */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sticky top-0 z-30 md:hidden print:hidden">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 text-base font-extrabold text-vendix-brand"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-vendix-brand text-white shadow-2xs">
              <Store size={15} />
            </div>
            <span>Vendix<span className="text-vendix-accent">.</span></span>
          </Link>

          <div className="flex items-center gap-2">
            <OfflineSyncBadge />
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Se déconnecter"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition active:scale-95 disabled:opacity-50"
              title="Déconnexion"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <main key={location.pathname} className="flex-1 overflow-x-hidden animate-fade-in">{children}</main>
      </div>

      {/* Barre de navigation basse flottante pour mobile (Floating Pill Nav) */}
      <div className="fixed bottom-3 left-0 right-0 z-40 px-3 md:hidden print:hidden pointer-events-none">
        <nav className="mx-auto max-w-md pointer-events-auto flex h-16 items-center justify-around rounded-2xl border border-slate-200/80 bg-white/95 px-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);

            if (item.isPrimary) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative -top-2 flex flex-col items-center group active:scale-95 transition-transform"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all duration-200 ${
                      active
                        ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-4 ring-emerald-100 scale-105"
                        : "bg-vendix-brand text-white shadow-blue-900/20 group-hover:bg-vendix-brand-dark"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-black tracking-tight ${
                      active ? "text-emerald-700" : "text-slate-600 font-bold"
                    }`}
                  >
                    {item.shortName}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 transition-all duration-200 active:scale-90 ${
                  active
                    ? "text-vendix-brand font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-vendix-brand scale-110 shadow-2xs ring-1 ring-blue-100"
                      : "text-slate-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[10px] leading-none transition-colors ${
                    active ? "font-black text-vendix-brand" : "font-semibold text-slate-500"
                  }`}
                >
                  {item.shortName}
                </span>

                {/* Micro-indicateur d'état actif (pastille lumineuse sous le texte) */}
                {active && (
                  <span className="absolute -bottom-1 h-1 w-3 rounded-full bg-vendix-brand animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
