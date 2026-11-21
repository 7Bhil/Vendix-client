import { useEffect, useState } from 'react';
import {
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Package,
  ReceiptText,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { expensesService, salesService } from '../../api/services.js';

const PERIODS = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'week', label: '7 derniers jours' },
  { id: 'month', label: 'Ce mois-ci' },
];

const INITIAL_REPORT = {
  revenue: 0,
  costOfGoodsSold: 0,
  grossProfit: 0,
  expenses: 0,
  netProfit: 0,
  topProducts: [],
};

function getDateRange(period, currentDate = new Date()) {
  const start = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  if (period === 'week') {
    start.setDate(start.getDate() - 6);
  } else if (period === 'month') {
    start.setDate(1);
  }

  start.setHours(0, 0, 0, 0);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

function formatCurrency(amount) {
  return `${Number(amount).toLocaleString('fr-FR')} FCFA`;
}

function parseAmount(value, label) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    throw new Error(`Le montant « ${label} » reçu du serveur est invalide.`);
  }
  return amount;
}

function MetricCard({ icon: Icon, label, value, tone, loading }) {
  const tones = {
    blue: 'bg-blue-50 text-vendix-brand',
    green: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
          {loading ? (
            <div
              aria-hidden="true"
              className="mt-2 h-7 w-32 animate-pulse rounded-lg bg-slate-200 sm:h-8"
            />
          ) : (
            <p className="mt-2 break-words text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {formatCurrency(value)}
            </p>
          )}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [reloadKey, setReloadKey] = useState(0);
  const [report, setReport] = useState(INITIAL_REPORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;
    const period = getDateRange(selectedPeriod);

    async function loadReport() {
      setLoading(true);
      setError('');

      try {
        const [sales, expenses] = await Promise.all([
          salesService.getSummary(period),
          expensesService.getSummary(period),
        ]);
        const expenseTotal = expenses?.summary?.total_amount ?? expenses?.total_amount;

        if (!Array.isArray(sales?.top_products)) {
          throw new Error('La liste des meilleures ventes reçue du serveur est invalide.');
        }

        const grossProfit = parseAmount(sales.gross_profit, 'marge brute');
        const expenseAmount = parseAmount(expenseTotal, 'dépenses');
        const topProducts = sales.top_products.map((product) => ({
          product_id: product.product_id,
          name: product.name,
          quantity: parseAmount(product.quantity, 'quantité vendue'),
          revenue: parseAmount(product.revenue, 'ventes produit'),
        }));

        const nextReport = {
          revenue: parseAmount(sales.total_revenue, "chiffre d'affaires"),
          costOfGoodsSold: parseAmount(sales.cost_of_goods_sold, 'coût des marchandises'),
          grossProfit,
          expenses: expenseAmount,
          netProfit: grossProfit - expenseAmount,
          topProducts,
        };

        if (isCurrentRequest) setReport(nextReport);
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError.message || 'Impossible de charger le rapport financier.');
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    }

    loadReport();
    return () => {
      isCurrentRequest = false;
    };
  }, [selectedPeriod, reloadKey]);

  const metrics = [
    { label: "Chiffre d'affaires", value: report.revenue, icon: Banknote, tone: 'blue' },
    {
      label: 'Coût des marchandises vendues',
      value: report.costOfGoodsSold,
      icon: Package,
      tone: 'slate',
    },
    { label: 'Marge brute', value: report.grossProfit, icon: TrendingUp, tone: 'green' },
    {
      label: "Dépenses d'exploitation",
      value: report.expenses,
      icon: ReceiptText,
      tone: 'orange',
    },
    {
      label: 'Bénéfice net estimé',
      value: report.netProfit,
      icon: report.netProfit >= 0 ? CircleDollarSign : TrendingDown,
      tone: report.netProfit >= 0 ? 'green' : 'red',
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Pilotage financier
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Rapports & rentabilité
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chiffre d'affaires, coût des ventes et résultat après dépenses.
          </p>
        </div>
        <div
          role="group"
          aria-label="Période du rapport"
          className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1"
        >
          {PERIODS.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => setSelectedPeriod(period.id)}
              aria-pressed={selectedPeriod === period.id}
              className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand ${
                selectedPeriod === period.id
                  ? 'bg-vendix-brand text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </header>

      <section
        aria-label="Indicateurs financiers"
        aria-busy={loading}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} loading={loading} />
        ))}
      </section>

      {loading && (
        <section
          role="status"
          aria-label="Chargement des meilleures ventes"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="space-y-3">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
          <span className="sr-only">Chargement du rapport...</span>
        </section>
      )}

      {error && (
        <section
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="font-bold text-rose-900">Rapport indisponible</h2>
            <p className="mt-1 text-sm text-rose-800">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Réessayer
          </button>
        </section>
      )}

      {!loading && !error && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <ChartNoAxesCombined size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Meilleures ventes</h2>
              <p className="mt-1 text-sm text-slate-500">
                Produits classés par chiffre d'affaires sur la période.
              </p>
            </div>
          </div>

          {report.topProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Aucune vente enregistrée sur cette période.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Produit</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Quantité vendue</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Chiffre d'affaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.topProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td className="px-5 py-3 font-semibold text-slate-800">{product.name}</td>
                      <td className="px-5 py-3 text-right text-slate-600">
                        {product.quantity.toLocaleString('fr-FR')}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-bold text-slate-800">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={15} aria-hidden="true" />
        Marge brute = chiffre d'affaires - coût d'achat saisi au moment de la vente.
        Le bénéfice net estimé déduit les dépenses d'exploitation.
      </p>
    </div>
  );
}
