import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Store,
} from "lucide-react";
import OfflineSyncBadge from "../dashboard/OfflineSyncBadge";

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
  },
  {
    name: "Clients & Dettes",
    shortName: "Clients",
    path: "/app/customers",
    icon: Users,
  },
  {
    name: "Ajout Produit",
    shortName: "Produits",
    path: "/app/products/new",
    icon: Package,
  },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = (path) => {
    if (path === "/app/customers") {
      return location.pathname.startsWith("/app/customers");
    }
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-vendix-ink">
      {/* Espace réservé desktop pour compenser la sidebar fixe */}
      <div className="hidden md:block w-20 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />

      {/* Barre latérale desktop rétractable / extensible au survol avec transition fluide */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 bottom-0 left-0 z-50 flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

        {/* Statut hors-ligne et compte */}
        <div className="border-t border-slate-100 p-3 overflow-hidden">
          <div className="mb-3 flex justify-center overflow-hidden">
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
              Ma boutique Vendix
            </p>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col pb-20 md:pb-0 min-w-0">
        {/* Barre du haut mobile */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 text-base font-extrabold text-vendix-brand"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-vendix-brand text-white">
              <Store size={15} />
            </div>
            <span>Vendix<span className="text-vendix-accent">.</span></span>
          </Link>

          <OfflineSyncBadge />
        </header>

        <main className="flex-1 overflow-x-hidden animate-fade-in">{children}</main>
      </div>

      {/* Barre de navigation basse pour mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md md:hidden">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition active:scale-95 ${
                active ? "text-vendix-brand font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={19} className={active ? "text-vendix-brand" : "text-slate-400"} />
              <span className="text-[11px] font-medium leading-tight">{item.shortName}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
