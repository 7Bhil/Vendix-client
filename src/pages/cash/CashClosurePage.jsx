import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Loader2,
  Lock,
  Smartphone,
  TrendingDown,
  Wallet,
} from "lucide-react";
import salesData from "../../mocks/modules/sales.json";
import expensesData from "../../mocks/modules/expenses.json";
import DailyReportCard from "../../components/cash/DailyReportCard.jsx";
import { cashService, expensesService } from "../../api/services.js";

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

// Récupère les dépenses locales
const getAllExpenses = () => {
  const baseExpenses = Array.isArray(expensesData.expenses) ? expensesData.expenses : [];
  try {
    const raw = localStorage.getItem("vendix_expenses") || "[]";
    const customExpenses = JSON.parse(raw);
    if (!Array.isArray(customExpenses) || customExpenses.length === 0) {
      return baseExpenses;
    }
    const baseIds = new Set(baseExpenses.map((e) => String(e.id)));
    const uniqueCustom = customExpenses.filter((e) => !baseIds.has(String(e.id)));
    return [...baseExpenses, ...uniqueCustom];
  } catch {
    return baseExpenses;
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
    red: "bg-red-50 text-red-600",
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
  const allExpenses = useMemo(() => getAllExpenses(), []);

  const [selectedDate, setSelectedDate] = useState(
    () => getLatestSalesDate(allSales) || getDateKey(new Date()),
  );
  const [openingAmountInput, setOpeningAmountInput] = useState("0");
  const [countedCash, setCountedCash] = useState("");
  const [closureNotes, setClosureNotes] = useState("");
  const [isSubmittingClosure, setIsSubmittingClosure] = useState(false);
  const [closureSuccessMessage, setClosureSuccessMessage] = useState("");
  const [closureError, setClosureError] = useState("");

  // État des données réelles issues de l'API cashService.getDailySummary
  const [apiSummary, setApiSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Charger le résumé réel de la journée depuis cashService.getDailySummary
  const fetchDailySummary = useCallback(async (date) => {
    setIsLoadingSummary(true);
    setClosureSuccessMessage("");
    setClosureError("");
    try {
      const summary = await cashService.getDailySummary({ date });
      if (summary) {
        setApiSummary(summary);
        if (summary.opening_amount !== undefined) {
          setOpeningAmountInput(String(summary.opening_amount));
        }
      }
    } catch (err) {
      console.warn("Échec de récupération cashService.getDailySummary, repli sur calculs locaux :", err);
      setApiSummary(null);
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDailySummary(selectedDate);
    }
  }, [selectedDate, fetchDailySummary]);

  // Calcul local (fallback ou complément)
  const report = useMemo(() => {
    const daySales = allSales.filter(
      (sale) => getDateKey(sale.createdAt) === selectedDate,
    );

    const salesSummary = daySales.reduce(
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

    // Calcul des dépenses espèces du jour (fallback local)
    const dayExpenses = allExpenses.filter((exp) => {
      const expDate = exp.date ? String(exp.date).split("T")[0] : "";
      return expDate === selectedDate;
    });

    let localCashExpenses = 0;
    for (const exp of dayExpenses) {
      const method = (exp.paymentMethod || exp.payment_method || exp.mode || "CASH").toUpperCase();
      if (method === "CASH" || method === "ESPECES") {
        localCashExpenses += Number(exp.amount || 0);
      }
    }

    return {
      ...salesSummary,
      cashExpenses: localCashExpenses,
    };
  }, [allSales, allExpenses, selectedDate]);

  // Si l'API retourne des totaux réels de la journée, les utiliser en priorité
  const effectiveCashReceived =
    apiSummary?.cash_sales !== undefined
      ? Number(apiSummary.cash_sales)
      : report.cashReceived;

  const effectiveMomoReceived =
    apiSummary?.non_cash_summary?.momo_sales !== undefined
      ? Number(apiSummary.non_cash_summary.momo_sales)
      : report.momoReceived;

  const effectiveCashExpenses =
    apiSummary?.cash_expenses !== undefined
      ? Number(apiSummary.cash_expenses)
      : report.cashExpenses;

  const effectiveOpeningAmount =
    !Number.isNaN(Number(openingAmountInput)) && Number(openingAmountInput) >= 0
      ? Math.round(Number(openingAmountInput))
      : apiSummary?.opening_amount !== undefined
        ? Number(apiSummary.opening_amount)
        : 0;

  // Règle comptable :
  // Solde théorique = Fond de caisse initial + Espèces encaissées (Ventes CASH) - Dépenses en espèces
  const theoreticalCash = Math.max(
    0,
    effectiveOpeningAmount + effectiveCashReceived - effectiveCashExpenses,
  );

  const parsedCountedCash =
    countedCash !== "" && !Number.isNaN(Number(countedCash))
      ? Math.max(Number(countedCash), 0)
      : 0;
  const isCashCountEntered = countedCash !== "" && !Number.isNaN(Number(countedCash));
  const cashDifference = isCashCountEntered
    ? parsedCountedCash - theoreticalCash
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
    setClosureSuccessMessage("");
    setClosureError("");
  };

  // Enregistrement et archivage de la clôture de caisse via cashService.recordClosure
  const handleRecordClosure = async (e) => {
    if (e) e.preventDefault();

    if (!isCashCountEntered) {
      setClosureError("Veuillez renseigner le montant physique réellement compté.");
      return;
    }

    if (cashDifference !== 0 && !closureNotes.trim()) {
      setClosureError("Un commentaire explicatif est obligatoire en cas d’écart de caisse (surplus ou manquant).");
      return;
    }

    setIsSubmittingClosure(true);
    setClosureError("");
    setClosureSuccessMessage("");

    try {
      const payload = {
        openingAmount: effectiveOpeningAmount,
        opening_amount: effectiveOpeningAmount,
        countedCash: parsedCountedCash,
        actual_cash_counted: parsedCountedCash,
        notes: closureNotes.trim() || undefined,
        comment: closureNotes.trim() || undefined,
        date: selectedDate,
      };

      await cashService.recordClosure(payload);

      setClosureSuccessMessage(
        `Clôture de caisse du ${dateLabel} enregistrée et archivée avec succès ! (Solde théorique : ${formatPrice(theoreticalCash)}, Compté : ${formatPrice(parsedCountedCash)}, Écart : ${cashDifference > 0 ? "+" : ""}${formatPrice(cashDifference)})`,
      );

      // Rafraîchir le sommaire
      await fetchDailySummary(selectedDate);
    } catch (err) {
      console.error("Erreur lors de la clôture de caisse :", err);
      const errMsg =
        err?.message ||
        "Impossible d'enregistrer la clôture de caisse. Vérifiez vos données ou votre connexion.";
      setClosureError(errMsg);
    } finally {
      setIsSubmittingClosure(false);
    }
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

      <section aria-label={`Statistiques du ${dateLabel}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          icon={Wallet}
          label="Ventes réalisées"
          value={formatPrice(report.totalSales)}
          tone="blue"
        />
        <MetricCard
          icon={Banknote}
          label="Espèces encaissées"
          value={formatPrice(effectiveCashReceived)}
          tone="green"
        />
        <MetricCard
          icon={Smartphone}
          label="Mobile Money encaissé"
          value={formatPrice(effectiveMomoReceived)}
          tone="orange"
        />
        <MetricCard
          icon={TrendingDown}
          label="Dépenses en espèces"
          value={formatPrice(effectiveCashExpenses)}
          tone="red"
        />
        <MetricCard
          icon={Lock}
          label="Solde théorique caisse"
          value={formatPrice(theoreticalCash)}
          tone="blue"
        />
      </section>

      {!isReportsRoute && (
        <section className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* FOND DE CAISSE INITIAL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
                  <Wallet size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Fond de caisse initial</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Montant présent à l'ouverture de la session.
                  </p>
                </div>
              </div>

              <label htmlFor="opening-amount" className="mt-4 block text-xs font-semibold text-slate-700">
                Fond initial (FCFA)
              </label>
              <div className="mt-1 flex rounded-xl border border-slate-200 focus-within:border-vendix-brand focus-within:ring-2 focus-within:ring-vendix-brand/20">
                <input
                  id="opening-amount"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={openingAmountInput}
                  onChange={(e) => setOpeningAmountInput(e.target.value)}
                  placeholder="0"
                  className="min-w-0 flex-1 rounded-l-xl px-3 py-2 text-base font-bold text-slate-900 outline-none"
                />
                <span className="flex items-center rounded-r-xl bg-slate-50 px-3 text-xs font-semibold text-slate-500">
                  FCFA
                </span>
              </div>
            </div>

            {/* COMPTAGE PHYSIQUE DES ESPÈCES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Banknote size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Comptage physique</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Attendu : <strong className="text-slate-800">{formatPrice(theoreticalCash)}</strong>
                  </p>
                </div>
              </div>

              <label htmlFor="counted-cash" className="mt-4 block text-xs font-semibold text-slate-700">
                Espèces réellement comptées
              </label>
              <div className="mt-1 flex rounded-xl border border-slate-200 focus-within:border-vendix-brand focus-within:ring-2 focus-within:ring-vendix-brand/20">
                <input
                  id="counted-cash"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={countedCash}
                  onChange={(event) => setCountedCash(event.target.value)}
                  placeholder="Ex. 25000"
                  className="min-w-0 flex-1 rounded-l-xl px-3 py-2 text-base font-bold text-slate-900 outline-none"
                />
                <span className="flex items-center rounded-r-xl bg-slate-50 px-3 text-xs font-semibold text-slate-500">
                  FCFA
                </span>
              </div>
            </div>

            {/* ÉCART DE CAISSE */}
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
                    ? "La caisse correspond exactement au solde théorique."
                    : cashDifference > 0
                      ? "Excédent par rapport au solde théorique attendu."
                      : "Montant manquant par rapport au solde théorique attendu."}
              </p>
            </div>
          </div>

          {/* ACTION DE CLÔTURE ET ARCHIVAGE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-bold text-slate-900">Archivage formel de la caisse journalière</h3>
            <p className="mt-1 text-xs text-slate-500">
              Enregistre le fond initial, le comptage physique réel et archive formellement la session côté NestJS.
            </p>

            {isCashCountEntered && cashDifference !== 0 && (
              <div className="mt-4">
                <label htmlFor="closure-notes" className="block text-xs font-semibold text-amber-900">
                  Commentaire explicatif obligatoire (Écart constaté : {cashDifference > 0 ? "+" : ""}{formatPrice(cashDifference)})
                </label>
                <textarea
                  id="closure-notes"
                  rows={2}
                  value={closureNotes}
                  onChange={(e) => setClosureNotes(e.target.value)}
                  placeholder="Justification de l'écart (ex: monnaie manquante, pourboire non enregistré, etc.)..."
                  className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50/50 p-3 text-sm text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}

            {closureError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {closureError}
              </div>
            )}

            {closureSuccessMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{closureSuccessMessage}</span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                onClick={handleRecordClosure}
                disabled={isSubmittingClosure || !isCashCountEntered}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingClosure ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Archivage en cours...
                  </>
                ) : (
                  <>
                    <Lock size={17} />
                    Clôturer la caisse
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      <DailyReportCard
        date={dateLabel}
        salesCount={report.salesCount}
        totalSales={report.totalSales}
        totalCollected={report.totalCollected}
        cashReceived={effectiveCashReceived}
        momoReceived={effectiveMomoReceived}
        otherReceived={report.otherReceived}
        balanceDue={report.balanceDue}
        countedCash={isCashCountEntered ? parsedCountedCash : null}
        cashDifference={isCashCountEntered ? cashDifference : null}
        openingAmount={effectiveOpeningAmount}
        cashExpenses={effectiveCashExpenses}
        theoreticalCash={theoreticalCash}
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
