import { useEffect, useState } from "react";
import {
  Banknote,
  Building2,
  CircleDollarSign,
  Package,
  PackagePlus,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/dashboard/StatCard";
import LowStockAlertBanner from "../../components/dashboard/LowStockAlertBanner";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import OfflineSyncBadge from "../../components/dashboard/OfflineSyncBadge";

const PERIODS = [
  { id: "day", label: "Jour" },
  { id: "week", label: "Semaine" },
  { id: "month", label: "Mois" },
];

const initialDashboardData = {
  salesToday: 0,
  salesPeriod: 0,
  moneyCollected: 0,
  customerDebts: 0,
  supplierDebts: 0,
  estimatedProfit: 0,
  products: [],
  transactions: [],
};

function formatCurrency(amount) {
  return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
}

function validateDashboardData(data) {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    throw new Error("Les données du tableau de bord sont invalides.");
  }

  const numericFields = [
    "salesToday",
    "salesPeriod",
    "moneyCollected",
    "customerDebts",
    "supplierDebts",
    "estimatedProfit",
  ];

  for (const field of numericFields) {
    if (
      data[field] !== undefined &&
      (typeof data[field] !== "number" ||
        !Number.isFinite(data[field]) ||
        (field !== "estimatedProfit" && data[field] < 0))
    ) {
      throw new Error(`La valeur ${field} est invalide.`);
    }
  }

  if (data.products !== undefined && !Array.isArray(data.products)) {
    throw new Error("La liste des produits est invalide.");
  }

  if (data.transactions !== undefined && !Array.isArray(data.transactions)) {
    throw new Error("La liste des transactions est invalide.");
  }

  return {
    ...initialDashboardData,
    ...data,
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const timer = window.setTimeout(() => {
      try {
        const savedData = localStorage.getItem("vendix-dashboard-data");
        if (savedData) {
          setDashboardData(validateDashboardData(JSON.parse(savedData)));
        }
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function reloadDashboard() {
    setLoading(true);
    setError(false);
    setRefreshSuccess(false);

    try {
      const savedData = localStorage.getItem("vendix-dashboard-data");
      const nextData = savedData
        ? validateDashboardData(JSON.parse(savedData))
        : initialDashboardData;

      setDashboardData(nextData);
      setRefreshSuccess(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const currentPeriodSales =
    selectedPeriod === "day"
      ? dashboardData.salesToday
      : dashboardData.salesPeriod || dashboardData.salesToday;

  const stats = [
    {
      title:
        selectedPeriod === "day"
          ? "Ventes du jour"
          : selectedPeriod === "week"
            ? "Ventes de la semaine"
            : "Ventes du mois",
      value: formatCurrency(currentPeriodSales),
      icon: ShoppingBag,
      description: "Montant total des ventes réalisées",
    },
    {
      title: "Argent encaissé",
      value: formatCurrency(dashboardData.moneyCollected),
      icon: Banknote,
      description: "Paiements effectivement reçus",
    },
    {
      title: "Dettes clients",
      value: formatCurrency(dashboardData.customerDebts),
      icon: CircleDollarSign,
      description: "Montant restant dû par les clients",
    },
    {
      title: "Dettes fournisseurs",
      value: formatCurrency(dashboardData.supplierDebts),
      icon: Building2,
      description: "Montant dû aux fournisseurs",
    },
    {
      title: "Bénéfice estimé",
      value: formatCurrency(dashboardData.estimatedProfit),
      icon: TrendingUp,
      description: "Marge et résultat net estimé",
    },
  ];

  return (
    <main className="min-h-screen bg-vendix-surface px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* En-tête avec titre, statut réseau et actions */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-vendix-brand">
              Espace commerçant
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-3xl">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Voici le résumé de ton activité commerciale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <OfflineSyncBadge isOnline={isOnline} />

            <button
              type="button"
              onClick={() => navigate("/app/sales/new")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Nouvelle vente</span>
            </button>

            <button
              type="button"
              onClick={reloadDashboard}
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-vendix-ink transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
                aria-hidden="true"
              />
              <span>{loading ? "Actualisation..." : "Actualiser"}</span>
            </button>

            {refreshSuccess && !loading && !error && (
              <span
                role="status"
                aria-live="polite"
                className="text-xs font-semibold text-vendix-brand"
              >
                Données actualisées
              </span>
            )}
          </div>
        </header>

        {/* Accès rapides du vendeur selon front.md (vente, produit, client) */}
        <nav
          aria-label="Accès rapides"
          className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
            Accès rapides :
          </span>

          <button
            type="button"
            onClick={() => navigate("/app/sales/new")}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-vendix-surface px-3.5 py-2 text-xs font-semibold text-vendix-ink hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <Plus size={16} className="text-vendix-brand" aria-hidden="true" />
            <span>Nouvelle vente</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/app/products/new")}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-vendix-surface px-3.5 py-2 text-xs font-semibold text-vendix-ink hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <PackagePlus size={16} className="text-vendix-brand" aria-hidden="true" />
            <span>Nouveau produit</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/app/customers/new")}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-vendix-surface px-3.5 py-2 text-xs font-semibold text-vendix-ink hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <UserPlus size={16} className="text-vendix-brand" aria-hidden="true" />
            <span>Nouveau client</span>
          </button>
        </nav>

        {error ? (
          <section
            role="alert"
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-vendix-ink">
              Impossible de lire les données
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Les données locales semblent illisibles. Réessaie l’actualisation.
            </p>
            <button
              type="button"
              onClick={reloadDashboard}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-vendix-brand px-4 py-2 font-semibold text-white hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
            >
              <RefreshCw size={18} aria-hidden="true" />
              Réessayer
            </button>
          </section>
        ) : (
          <>
            {/* Vue d'ensemble avec filtre de période */}
            <section aria-labelledby="indicators-heading">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    id="indicators-heading"
                    className="text-lg font-bold text-vendix-ink"
                  >
                    Vue d’ensemble
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Les indicateurs clés de ton commerce.
                  </p>
                </div>

                {/* Filtre de période (Jour / Semaine / Mois) */}
                <div
                  role="group"
                  aria-label="Période des indicateurs"
                  className="inline-flex rounded-xl border border-slate-200 bg-white p-1"
                >
                  {PERIODS.map((period) => (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`min-h-12 rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand ${
                        selectedPeriod === period.id
                          ? "bg-vendix-brand text-white shadow-sm"
                          : "text-slate-600 hover:text-vendix-ink"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.title}
                    {...stat}
                    loading={loading}
                  />
                ))}
              </div>
            </section>

            {/* État vide si aucune donnée */}
            {!loading &&
              dashboardData.products.length === 0 &&
              dashboardData.transactions.length === 0 &&
              dashboardData.salesToday === 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vendix-surface text-vendix-brand">
                    <Package size={24} aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-vendix-ink">
                    Bienvenue sur ton tableau de bord
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Ton activité commencera à apparaître ici dès que tu auras
                    ajouté tes produits et enregistré tes premières ventes.
                    Pour le moment, tous les indicateurs sont à zéro.
                  </p>
                </section>
              )}

            {/* Alertes de stock et activité récente */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="min-w-0 space-y-6">
                <LowStockAlertBanner products={dashboardData.products} />
                <RecentTransactionsList
                  transactions={dashboardData.transactions}
                />
              </div>

              {/* Suivi financier détaillé */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vendix-surface text-vendix-brand">
                    <TrendingUp size={23} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-vendix-ink">
                      Suivi de ton activité
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Résumé financier et trésorerie
                    </p>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-slate-200">
                  <div className="flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="text-sm text-slate-600">
                      Ventes ({selectedPeriod === "day" ? "Jour" : selectedPeriod === "week" ? "Semaine" : "Mois"})
                    </span>
                    <span className="text-right text-sm font-semibold text-vendix-ink">
                      {formatCurrency(currentPeriodSales)}
                    </span>
                  </div>

                  <div className="flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="text-sm text-slate-600">
                      Encaissements réels
                    </span>
                    <span className="text-right text-sm font-semibold text-vendix-ink">
                      {formatCurrency(dashboardData.moneyCollected)}
                    </span>
                  </div>

                  <div className="flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="text-sm text-slate-600">
                      Créances clients
                    </span>
                    <span className="text-right text-sm font-semibold text-vendix-ink">
                      {formatCurrency(dashboardData.customerDebts)}
                    </span>
                  </div>

                  <div className="flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="text-sm text-slate-600">
                      Dettes fournisseurs
                    </span>
                    <span className="text-right text-sm font-semibold text-vendix-ink">
                      {formatCurrency(dashboardData.supplierDebts)}
                    </span>
                  </div>

                  <div className="flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="text-sm text-slate-600">
                      Bénéfice estimé
                    </span>
                    <span className="text-right text-sm font-semibold text-vendix-ink">
                      {formatCurrency(dashboardData.estimatedProfit)}
                    </span>
                  </div>
                </div>
              </section>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
