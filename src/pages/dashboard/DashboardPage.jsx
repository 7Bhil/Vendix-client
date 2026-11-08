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
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* En-tête épuré et compact */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
            Tableau de bord
          </h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">
            Synthèse de votre activité commerciale
          </p>
        </div>

        <div className="flex items-center gap-2">
          <OfflineSyncBadge isOnline={isOnline} />
          <button
            type="button"
            onClick={() => navigate("/app/sales/new")}
            className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-2xs transition-all duration-150 hover:bg-emerald-700 active:scale-95"
          >
            <Plus size={16} />
            <span>Vente</span>
          </button>
        </div>
      </header>

      {error ? (
        <section
          role="alert"
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xs"
        >
          <p className="text-xs font-bold text-slate-800">Impossible de charger les données</p>
          <button
            type="button"
            onClick={reloadDashboard}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-vendix-brand px-3.5 py-2 text-xs font-bold text-white transition active:scale-95"
          >
            <RefreshCw size={14} />
            Réessayer
          </button>
        </section>
      ) : (
        <>
          {/* Sélecteur de période discret */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Période
            </span>
            <div className="flex gap-1">
              {PERIODS.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    selectedPeriod === period.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grille métrique compacte 2 colonnes sur mobile */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3">
            {stats.map((stat, idx) => (
              <StatCard
                key={stat.title}
                {...stat}
                loading={loading}
                featured={idx === 0}
              />
            ))}
          </div>

          {/* Alertes de stock et Dernières transactions */}
          <section className="space-y-4 pt-1">
            <LowStockAlertBanner products={dashboardData.products} />
            <RecentTransactionsList
              transactions={dashboardData.transactions}
            />
          </section>
        </>
      )}
    </div>
  );
}
