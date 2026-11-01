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
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Caisse / Vente",
    path: "/app/sales/new",
    icon: ShoppingCart,
  },
  {
    name: "Clients & Dettes",
    path: "/app/customers",
    icon: Users,
  },
  {
    name: "Nouveau produit",
    path: "/app/products/new",
    icon: Package,
  },
];

export default function AppLayout({ children }) {
  const location = useLocation();

  const isCurrent = (path) => {
    if (path === "/app/customers") {
      return location.pathname.startsWith("/app/customers");
    }
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-vendix-ink">
      {/* Barre latérale desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        {/* En-tête de la marque */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-vendix-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vendix-brand text-white shadow-sm">
              <Store size={19} />
            </div>
            <span>
              Vendix<span className="text-vendix-accent">.</span>
            </span>
          </Link>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 space-y-1.5 p-4">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Espace Marchand
          </p>

          <div className="mt-2 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-vendix-brand font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand`}
                >
                  <Icon
                    size={19}
                    className={active ? "text-vendix-brand" : "text-slate-400"}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Statut hors-ligne et compte */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3">
            <OfflineSyncBadge />
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">Boutique connectée</p>
            <p className="truncate text-sm font-bold text-slate-900">
              Ma boutique Vendix
            </p>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        {/* Barre du haut mobile */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 text-lg font-extrabold text-vendix-brand"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vendix-brand text-white">
              <Store size={17} />
            </div>
            <span>Vendix<span className="text-vendix-accent">.</span></span>
          </Link>

          <OfflineSyncBadge />
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
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
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition ${
                active ? "text-vendix-brand font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={20} className={active ? "text-vendix-brand" : "text-slate-400"} />
              <span className="text-[11px] leading-tight">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
