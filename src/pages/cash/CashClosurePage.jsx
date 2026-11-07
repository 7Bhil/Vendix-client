import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CircleAlert,
  ClipboardList,
  Smartphone,
  Wallet,
} from "lucide-react";
import salesData from "../../mocks/modules/sales.json";
import DailyReportCard from "../../components/cash/DailyReportCard.jsx";

const formatPrice = (amount) =>
  `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;

const getDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPaidAmount = (sale) => {
  const amount = Number(
    sale.paidAmount ??
      sale.receivedAmount ??
      (sale.status === "PAYEE" ? sale.totalAmount : 0),
  );
  return Number.isFinite(amount) ? Math.max(amount, 0) : 0;
};

const getPaymentCategory = (method) => {
  const normalizedMethod = String(method || "").toUpperCase();
  if (["CASH", "ESPECE", "ESPECES"].includes(normalizedMethod)) return "cash";
  if (["MOBILE_MONEY", "MOMO"].includes(normalizedMethod)) return "momo";
  return "other";
};

// Récupère toutes les ventes : mock initial + ventes créées localement dans localStorage
const getAllSales = () => {
  const baseSales = Array.isArray(salesData.sales) ? salesData.sales : [];
  try {
    const customSalesRaw =
      localStorage.getItem("vendix-custom-sales") ||
      localStorage.getItem("vendix_sales") ||
      "[]";
    const customSales = JSON.parse(customSalesRaw);
    if (!Array.isArray(customSales) || customSales.length === 0) {
      return baseSales;
    }

    const baseIds = new Set(baseSales.map((s) => String(s.id)));
    const uniqueCustom = customSales.filter((s) => !baseIds.has(String(s.id)));
    return [...baseSales, ...uniqueCustom];
  } catch {
    return baseSales;
  }
};

const getLatestSalesDate = (sales) =>
  sales.reduce((latest, sale) => {
    const dateKey = getDateKey(sale.createdAt);
    return dateKey > latest ? dateKey : latest;
  }, "");

const MetricCard = ({ icon: Icon, label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-vendix-brand",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
          <p className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
};

export default function CashClosurePage({ reportsOnly = false }) {
  const location = useLocation();
  const allSales = useMemo(() => getAllSales(), []);

  const [selectedDate, setSelectedDate] = useState(
    () => getLatestSalesDate(allSales) || getDateKey(new Date()),
  );
  const [countedCash, setCountedCash] = useState("");

  const report = useMemo(() => {
    const daySales = allSales.filter(
      (sale) => getDateKey(sale.createdAt) === selectedDate,
    );

    return daySales.reduce(
      (summary, sale) => {
        const totalAmount = Number(sale.totalAmount);
        const total = Number.isFinite(totalAmount) ? Math.max(totalAmount, 0) : 0;
        const paid = getPaidAmount(sale);
        const balance = Number(sale.balanceDue);

        summary.salesCount += 1;
        summary.totalSales += total;
        summary.totalCollected += paid;
        summary.balanceDue += Number.isFinite(balance)
          ? Math.max(balance, 0)
          : Math.max(total - paid, 0);

        const category = getPaymentCategory(sale.paymentMethod);
        if (category === "cash") summary.cashReceived += paid;
        else if (category === "momo") summary.momoReceived += paid;
        else summary.otherReceived += paid;

        return summary;
      },
      {
        sales: daySales,
        salesCount: 0,
        totalSales: 0,
        totalCollected: 0,
        cashReceived: 0,
        momoReceived: 0,
        otherReceived: 0,
        balanceDue: 0,
      },
    );
  }, [allSales, selectedDate]);

  const parsedCountedCash =
    countedCash !== "" && !Number.isNaN(Number(countedCash))
      ? Math.max(Number(countedCash), 0)
      : 0;
  const isCashCountEntered = countedCash !== "" && !Number.isNaN(Number(countedCash));
  const cashDifference = isCashCountEntered
    ? parsedCountedCash - report.cashReceived
    : 0;
  const dateLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const isReportsRoute = reportsOnly || location.pathname === "/app/reports";

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCountedCash("");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Caisse & pilotage
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isReportsRoute ? "Rapport journalier" : "Clôture de caisse"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Comparez les encaissements en espèces, Mobile Money et le comptage réel.
          </p>
        </div>

        <Link
          to={isReportsRoute ? "/app/cash-closure" : "/app/reports"}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand print:hidden"
        >
          {isReportsRoute ? <ArrowLeft size={17} /> : <ClipboardList size={17} />}
          {isReportsRoute ? "Retour à la clôture" : "Voir les rapports"}
        </Link>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="font-bold text-slate-900">Journée analysée</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Les chiffres sont calculés à partir des ventes enregistrées pour cette date.
          </p>
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 focus-within:ring-2 focus-within:ring-vendix-brand">
          <CalendarDays size={17} className="text-slate-400" aria-hidden="true" />
          <span className="sr-only">Choisir une journée</span>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="min-w-0 bg-transparent outline-none"
          />
        </label>
      </section>

      <section aria-label={`Statistiques du ${dateLabel}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Wallet}
          label="Ventes réalisées"
          value={formatPrice(report.totalSales)}
          tone="blue"
        />
        <MetricCard
          icon={ClipboardList}
          label="Nombre de ventes"
          value={report.salesCount}
          tone="slate"
        />
        <MetricCard
          icon={Banknote}
          label="Espèces encaissées"
          value={formatPrice(report.cashReceived)}
          tone="green"
        />
        <MetricCard
          icon={Smartphone}
          label="Mobile Money encaissé"
          value={formatPrice(report.momoReceived)}
          tone="orange"
        />
      </section>

      {!isReportsRoute && (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Banknote size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Comptage physique des espèces</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Montant attendu dans la caisse :{" "}
                  <strong className="text-slate-800">{formatPrice(report.cashReceived)}</strong>
                </p>
              </div>
            </div>

            <label htmlFor="counted-cash" className="mt-5 block text-sm font-semibold text-slate-700">
              Espèces réellement comptées
            </label>
            <div className="mt-2 flex rounded-xl border border-slate-200 focus-within:border-vendix-brand focus-within:ring-2 focus-within:ring-vendix-brand/20">
              <input
                id="counted-cash"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={countedCash}
                onChange={(event) => setCountedCash(event.target.value)}
                placeholder="Ex. 25000"
                className="min-w-0 flex-1 rounded-l-xl px-4 py-3 text-lg font-bold text-slate-900 outline-none"
              />
              <span className="flex items-center rounded-r-xl bg-slate-50 px-4 text-sm font-semibold text-slate-500">
                FCFA
              </span>
            </div>
          </div>

          <div
            className={`flex flex-col justify-center rounded-2xl border p-5 shadow-sm sm:p-6 ${
              !isCashCountEntered
                ? "border-slate-200 bg-slate-50"
                : cashDifference === 0
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
            }`}
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              {isCashCountEntered && cashDifference !== 0 ? (
                <CircleAlert size={18} className="text-amber-700" aria-hidden="true" />
              ) : (
                <Banknote
                  size={18}
                  className={cashDifference === 0 && isCashCountEntered ? "text-emerald-700" : "text-slate-500"}
                  aria-hidden="true"
                />
              )}
              <h2 className="text-sm font-bold text-slate-800">Écart de caisse</h2>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              {!isCashCountEntered
                ? "À renseigner"
                : `${cashDifference > 0 ? "+" : ""}${formatPrice(cashDifference)}`}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {!isCashCountEntered
                ? "Saisissez le montant compté pour calculer l’écart."
                : cashDifference === 0
                  ? "La caisse correspond exactement aux encaissements."
                  : cashDifference > 0
                    ? "Excédent par rapport au montant attendu."
                    : "Montant manquant par rapport au montant attendu."}
            </p>
          </div>
        </section>
      )}

      <DailyReportCard
        date={dateLabel}
        salesCount={report.salesCount}
        totalSales={report.totalSales}
        totalCollected={report.totalCollected}
        cashReceived={report.cashReceived}
        momoReceived={report.momoReceived}
        otherReceived={report.otherReceived}
        balanceDue={report.balanceDue}
        countedCash={isCashCountEntered ? parsedCountedCash : null}
        cashDifference={isCashCountEntered ? cashDifference : null}
      />

      {isReportsRoute && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Détail des ventes</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Liste des transactions enregistrées pour le {dateLabel}.
            </p>
          </div>

          {report.sales.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Aucune vente enregistrée pour cette journée.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {report.sales.map((sale) => {
                const paid = getPaidAmount(sale);
                const category = getPaymentCategory(sale.paymentMethod);
                return (
                  <div
                    key={sale.id || sale.reference}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {sale.reference || `Vente #${sale.id}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sale.customerName || "Client comptoir"} —{" "}
                        {category === "cash"
                          ? "Espèces"
                          : category === "momo"
                            ? "Mobile Money"
                            : "Autre"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900">
                          {formatPrice(sale.totalAmount || paid)}
                        </p>
                        {Number(sale.balanceDue) > 0 && (
                          <p className="text-xs font-semibold text-amber-700">
                            Reste {formatPrice(sale.balanceDue)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
