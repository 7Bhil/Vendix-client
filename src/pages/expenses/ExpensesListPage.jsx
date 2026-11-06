import { useState, useEffect } from "react";
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
  ChartNoAxesColumn,
} from "lucide-react";

import expensesData from "../../mocks/modules/expenses.json";

const formatFCFA = (amount) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);

const categoryLabels = {
  LOYER: "Loyer",
  TRANSPORT: "Transport",
  ENERGIE: "Énergie",
};

const paymentLabels = {
  CASH: "Espèces",
  MOBILE_MONEY: "Mobile Money",
  CARD: "Carte bancaire",
  OTHER: "Autre",
};

const categoryStyles = {
  LOYER: "bg-violet-50 text-violet-700 ring-violet-100",
  TRANSPORT: "bg-amber-50 text-amber-700 ring-amber-100",
  ENERGIE: "bg-sky-50 text-sky-700 ring-sky-100",
};

const PaymentIcon = ({ method }) => {
  const icons = {
    CASH: Banknote,
    MOBILE_MONEY: Smartphone,
    CARD: CreditCard,
    OTHER: CircleDollarSign,
  };

  const Icon = icons[method] || CircleDollarSign;

  return <Icon size={16} />;
};

export default function ExpensesListPage() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Charger les dépenses enregistrées
  useEffect(() => {
    const savedExpenses = localStorage.getItem("vendix_expenses");

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch {
        setExpenses(expensesData.expenses);
      }
    } else {
      setExpenses(expensesData.expenses);
      localStorage.setItem(
        "vendix_expenses",
        JSON.stringify(expensesData.expenses)
      );
    }
  }, []);

  // Filtrer les dépenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesDate =
      !searchDate || expense.date === searchDate;

    const matchesCategory =
      selectedCategory === "ALL" ||
      expense.category === selectedCategory;

    return matchesDate && matchesCategory;
  });

  // Calculs statistiques
  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const numberOfExpenses = filteredExpenses.length;

  const averageExpense =
    numberOfExpenses > 0
      ? totalExpenses / numberOfExpenses
      : 0;

  // Supprimer une dépense
  const handleDeleteExpense = (id) => {
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

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchDate("");
    setSelectedCategory("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* EN-TÊTE */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
              <Receipt size={16} />
              <span>Gestion financière</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Suivi des dépenses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Gardez le contrôle sur les frais et les sorties d'argent
              de votre boutique.
            </p>
          </div>

          <button
            onClick={() => navigate("/app/expenses/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            <Plus size={19} />
            Nouvelle dépense
          </button>
        </div>

        {/* STATISTIQUES */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total des dépenses
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  {formatFCFA(totalExpenses)}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <ArrowDownRight size={14} />
                  Sorties d'argent
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-3.5 text-red-600">
                <TrendingDown size={24} />
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Nombre de dépenses
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  {numberOfExpenses}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Opérations affichées
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-3.5 text-blue-700">
                <Receipt size={24} />
              </div>
            </div>
          </div>

          {/* Moyenne */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Dépense moyenne
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  {formatFCFA(averageExpense)}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Par opération affichée
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-3.5 text-emerald-700">
                <ChartNoAxesColumn size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTRES */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <Filter size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Filtrer les dépenses
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Retrouvez rapidement une opération.
                </p>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-900"
            >
              <RotateCcw size={15} />
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="expense-date-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Date de la dépense
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="expense-date-filter"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="expense-category-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Catégorie
              </label>

              <select
                id="expense-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="ALL">Toutes les catégories</option>
                <option value="LOYER">Loyer</option>
                <option value="TRANSPORT">Transport</option>
                <option value="ENERGIE">Énergie</option>
              </select>
            </div>
          </div>
        </div>

        {/* HISTORIQUE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center md:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Historique des dépenses
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Consultez et gérez vos opérations.
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {numberOfExpenses} opération(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Catégorie</th>
                  <th className="px-6 py-4 font-semibold">Paiement</th>
                  <th className="px-6 py-4 text-right font-semibold">Montant</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {new Date(
                          expense.date + "T00:00:00"
                        ).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                          {expense.description || "Dépense de la boutique"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                            categoryStyles[expense.category] ||
                            "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {categoryLabels[expense.category] ||
                            expense.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-slate-400">
                            <PaymentIcon method={expense.paymentMethod} />
                          </span>
                          {paymentLabels[expense.paymentMethod] ||
                            expense.paymentMethod}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-red-600">
                        - {formatFCFA(expense.amount)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Supprimer cette dépense"
                          aria-label="Supprimer cette dépense"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Wallet size={26} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        Aucune dépense trouvée
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Modifiez vos filtres ou ajoutez une nouvelle dépense.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <span>
              Affichage de {filteredExpenses.length} dépense(s)
            </span>

            <span className="font-semibold text-slate-700">
              Total affiché : {formatFCFA(totalExpenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}