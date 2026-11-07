
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CalendarDays,
  Wallet,
  TrendingDown,
  Receipt,
  Filter,
  Trash2,
  ArrowDownRight,
  RotateCcw,
  Banknote,
  Smartphone,
  CreditCard,
  CircleDollarSign,
  Building2,
  Truck,
  Zap,
  Users,
  Package,
  CircleHelp,
  Image as ImageIcon,
} from "lucide-react";

import expensesData from "../../mocks/modules/expenses.json";

import {
  formatFCFA,
  EXPENSE_CATEGORIES,
  PAYMENT_LABELS,
} from "../../utils/expenses";

// ============================================
// CONFIGURATION DES ICÔNES
// ============================================

const CATEGORY_ICONS = {
  LOYER: Building2,
  TRANSPORT: Truck,
  ENERGIE: Zap,
  SALAIRES: Users,
  FOURNITURES: Package,
  AUTRE: CircleHelp,
};

const PAYMENT_ICONS = {
  CASH: Banknote,
  MOBILE_MONEY: Smartphone,
  CARD: CreditCard,
  OTHER: CircleDollarSign,
};

// ============================================
// PAGE HISTORIQUE DES DÉPENSES
// ============================================

export default function ExpensesListPage() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [period, setPeriod] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --------------------------------------------
  // Chargement des dépenses
  // --------------------------------------------

  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem("vendix_expenses");

      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        setExpenses(expensesData.expenses || []);
        localStorage.setItem(
          "vendix_expenses",
          JSON.stringify(expensesData.expenses || [])
        );
      }
    } catch (error) {
      console.error("Erreur de chargement des dépenses :", error);
      setExpenses(expensesData.expenses || []);
    }
  }, []);

  // --------------------------------------------
  // Dates utiles pour les filtres
  // --------------------------------------------

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  startOfWeek.setDate(today.getDate() + mondayOffset);

  const weekStart = [
    startOfWeek.getFullYear(),
    String(startOfWeek.getMonth() + 1).padStart(2, "0"),
    String(startOfWeek.getDate()).padStart(2, "0"),
  ].join("-");

  const monthStart = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-01`;

  // --------------------------------------------
  // Filtrage des dépenses
  // --------------------------------------------

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      let matchesPeriod = true;

      if (period === "TODAY") {
        matchesPeriod = expense.date === todayString;
      }

      if (period === "WEEK") {
        matchesPeriod =
          expense.date >= weekStart && expense.date <= todayString;
      }

      if (period === "MONTH") {
        matchesPeriod =
          expense.date >= monthStart && expense.date <= todayString;
      }

      if (period === "CUSTOM") {
        matchesPeriod =
          (!startDate || expense.date >= startDate) &&
          (!endDate || expense.date <= endDate);
      }

      const matchesCategory =
        selectedCategory === "ALL" ||
        expense.category === selectedCategory;

      return matchesPeriod && matchesCategory;
    });
  }, [
    expenses,
    period,
    selectedCategory,
    startDate,
    endDate,
    todayString,
    weekStart,
    monthStart,
  ]);

  // --------------------------------------------
  // Statistiques
  // --------------------------------------------

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const expenseCount = filteredExpenses.length;

  const averageExpense =
    expenseCount > 0 ? totalExpenses / expenseCount : 0;

  // --------------------------------------------
  // Suppression d'une dépense
  // --------------------------------------------

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette dépense ?"
    );

    if (!confirmed) return;

    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== id
    );

    setExpenses(updatedExpenses);

    localStorage.setItem(
      "vendix_expenses",
      JSON.stringify(updatedExpenses)
    );
  };

  // --------------------------------------------
  // Réinitialisation des filtres
  // --------------------------------------------

  const resetFilters = () => {
    setPeriod("ALL");
    setSelectedCategory("ALL");
    setStartDate("");
    setEndDate("");
  };

  // --------------------------------------------
  // Récupération du libellé de catégorie
  // --------------------------------------------

  const getCategoryLabel = (value) => {
    return (
      EXPENSE_CATEGORIES.find(
        (category) => category.value === value
      )?.label || "Autre"
    );
  };

  // --------------------------------------------
  // Affichage d'une dépense
  // --------------------------------------------

  const ExpenseCard = ({ expense }) => {
    const CategoryIcon = CATEGORY_ICONS[expense.category] || CircleHelp;
    const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod] || CircleDollarSign;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <CategoryIcon size={21} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900">
                {expense.description || getCategoryLabel(expense.category)}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {getCategoryLabel(expense.category)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDelete(expense.id)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Supprimer la dépense"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-500">
              {expense.date}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <PaymentIcon size={14} />
              {PAYMENT_LABELS[expense.paymentMethod] || "Autre"}
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-red-600">
              - {formatFCFA(expense.amount)}
            </p>

            {expense.receipt && (
              <a
                href={expense.receipt}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600"
              >
                <ImageIcon size={13} />
                Voir le reçu
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // INTERFACE
  // ============================================

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Receipt size={16} />
            Gestion financière
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Dépenses
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Suivez et contrôlez les dépenses de votre boutique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/app/expenses/new")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nouvelle dépense
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total des dépenses
            </span>
            <Wallet className="text-red-500" size={20} />
          </div>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {formatFCFA(totalExpenses)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Nombre de dépenses
            </span>
            <TrendingDown className="text-orange-500" size={20} />
          </div>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {expenseCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Dépense moyenne
            </span>
            <ArrowDownRight className="text-blue-500" size={20} />
          </div>

          <p className="mt-3 text-xl font-bold text-gray-900">
            {formatFCFA(averageExpense)}
          </p>
        </div>

      </div>

      {/* Filtres */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <Filter size={18} />
          Filtres
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Période
            </label>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">Toutes les dates</option>
              <option value="TODAY">Aujourd'hui</option>
              <option value="WEEK">Cette semaine</option>
              <option value="MONTH">Ce mois</option>
              <option value="CUSTOM">Période personnalisée</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Catégorie
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">Toutes les catégories</option>

              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {period === "CUSTOM" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date de début
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date de fin
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <RotateCcw size={15} />
          Réinitialiser les filtres
        </button>
      </div>

      {/* Historique */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900">
            Historique des dépenses
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {filteredExpenses.length} résultat(s)
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <Receipt size={42} className="text-gray-300" />

            <h3 className="mt-4 font-semibold text-gray-900">
              Aucune dépense trouvée
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Aucune dépense ne correspond aux filtres sélectionnés.
            </p>

            <button
              type="button"
              onClick={() => navigate("/app/expenses/new")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Ajouter une dépense
            </button>
          </div>
        ) : (
          <>
            {/* CARTES SUR MOBILE */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </div>

            {/* TABLEAU SUR ORDINATEUR */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Dépense</th>
                    <th className="px-5 py-4">Catégorie</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Paiement</th>
                    <th className="px-5 py-4 text-right">Montant</th>
                    <th className="px-5 py-4 text-center">Reçu</th>
                    <th className="px-5 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredExpenses.map((expense) => {
                    const PaymentIcon =
                      PAYMENT_ICONS[expense.paymentMethod] ||
                      CircleDollarSign;

                    return (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {expense.description || getCategoryLabel(expense.category)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getCategoryLabel(expense.category)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {expense.date}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <PaymentIcon size={16} />
                            {PAYMENT_LABELS[expense.paymentMethod] || "Autre"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-red-600">
                          - {formatFCFA(expense.amount)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          {expense.receipt ? (
                            <a
                              href={expense.receipt}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <ImageIcon size={16} />
                              Voir
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(expense.id)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Supprimer la dépense"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
