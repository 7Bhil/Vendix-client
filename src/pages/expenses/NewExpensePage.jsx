import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Receipt,
  Wallet,
  CalendarDays,
  FileText,
  Save,
  Building2,
  Truck,
  Zap,
  Banknote,
  Smartphone,
  CreditCard,
  CircleDollarSign,
  CheckCircle2,
  Info,
} from "lucide-react";

import expensesData from "../../mocks/modules/expenses.json";

const getTodayDate = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatFCFA = (amount) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const categories = [
  {
    value: "LOYER",
    label: "Loyer",
    description: "Local et location",
    icon: Building2,
    style: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    value: "TRANSPORT",
    label: "Transport",
    description: "Déplacements",
    icon: Truck,
    style: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    value: "ENERGIE",
    label: "Énergie",
    description: "Eau et électricité",
    icon: Zap,
    style: "border-sky-200 bg-sky-50 text-sky-700",
  },
];

const paymentMethods = [
  {
    value: "CASH",
    label: "Espèces",
    icon: Banknote,
  },
  {
    value: "MOBILE_MONEY",
    label: "Mobile Money",
    icon: Smartphone,
  },
  {
    value: "CARD",
    label: "Carte bancaire",
    icon: CreditCard,
  },
  {
    value: "OTHER",
    label: "Autre",
    icon: CircleDollarSign,
  },
];

export default function NewExpensePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    paymentMethod: "",
    date: getTodayDate(),
    description: "",
  });

  const [error, setError] = useState("");

  // Mettre à jour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // Enregistrer la dépense
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.amount ||
      Number(formData.amount) <= 0 ||
      !formData.category ||
      !formData.paymentMethod ||
      !formData.date
    ) {
      setError(
        "Veuillez renseigner le montant, la catégorie, le moyen de paiement et la date."
      );
      return;
    }

    let expenses = [];

    try {
      const savedExpenses = localStorage.getItem("vendix_expenses");

      expenses = savedExpenses
        ? JSON.parse(savedExpenses)
        : expensesData.expenses;

      if (!Array.isArray(expenses)) {
        expenses = expensesData.expenses;
      }
    } catch {
      expenses = expensesData.expenses;
    }

    const newExpense = {
      id: Date.now(),
      amount: Number(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      description:
        formData.description.trim() || "Dépense de la boutique",
    };

    const updatedExpenses = [newExpense, ...expenses];

    localStorage.setItem(
      "vendix_expenses",
      JSON.stringify(updatedExpenses)
    );

    navigate("/app/expenses");
  };

  const selectedCategory = categories.find(
    (category) => category.value === formData.category
  );

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* RETOUR */}
        <button
          type="button"
          onClick={() => navigate("/app/expenses")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Retour aux dépenses
        </button>

        {/* EN-TÊTE */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
            <Receipt size={26} />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              Gestion financière
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Nouvelle dépense
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Renseignez les informations relatives à votre dépense.
            </p>
          </div>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* MONTANT */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 md:px-6">
              <Wallet size={19} className="text-blue-700" />
              <h2 className="font-semibold text-slate-900">
                Montant de la dépense
              </h2>
              <span className="text-red-500">*</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-white p-5 md:p-7">
              <label
                htmlFor="amount"
                className="mb-3 block text-sm font-medium text-slate-600"
              >
                Combien avez-vous dépensé ?
              </label>

              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  min="1"
                  step="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="w-full rounded-xl border border-blue-100 bg-white py-5 pl-5 pr-24 text-3xl font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:text-4xl"
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-700">
                  FCFA
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Saisissez le montant en francs CFA.
              </p>
            </div>
          </div>

          {/* CATÉGORIE */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Receipt size={19} className="text-blue-700" />
                <h2 className="font-semibold text-slate-900">
                  Catégorie de dépense
                </h2>
                <span className="text-red-500">*</span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Choisissez le type de dépense à enregistrer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected =
                  formData.category === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      setFormData((previousData) => ({
                        ...previousData,
                        category: category.value,
                      }))
                    }
                    className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`rounded-xl border p-2.5 ${category.style}`}
                    >
                      <Icon size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {category.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {category.description}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        size={18}
                        className="absolute right-3 top-3 text-blue-700"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MOYEN DE PAIEMENT */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <CreditCard size={19} className="text-blue-700" />
                <h2 className="font-semibold text-slate-900">
                  Moyen de paiement
                </h2>
                <span className="text-red-500">*</span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Comment cette dépense a-t-elle été réglée ?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected =
                  formData.paymentMethod === method.value;

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() =>
                      setFormData((previousData) => ({
                        ...previousData,
                        paymentMethod: method.value,
                      }))
                    }
                    className={`flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
                        : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-semibold">
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DATE ET DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 font-semibold text-slate-900">
              Informations complémentaires
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Date de la dépense <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (facultatif)
                  </span>
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    maxLength={250}
                    placeholder="Exemple : paiement de la facture d'électricité..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.description.length}/250 caractères
                </p>
              </div>
            </div>
          </div>

          {/* RÉCAPITULATIF */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Info size={19} className="mt-0.5 shrink-0 text-blue-700" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  Récapitulatif
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-blue-700">
                      {selectedCategory
                        ? selectedCategory.label
                        : "Catégorie non sélectionnée"}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-950">
                      {formatFCFA(formData.amount)}
                    </p>
                  </div>

                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700">
                    {formData.paymentMethod
                      ? paymentMethods.find(
                          (method) =>
                            method.value === formData.paymentMethod
                        )?.label
                      : "Paiement non sélectionné"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ERREUR */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/app/expenses")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              <Save size={18} />
              Enregistrer la dépense
            </button>
          </div>
        </form>

        <p className="pb-4 text-center text-xs text-slate-400">
          <Wallet size={13} className="mr-1 inline" />
          Vos dépenses sont enregistrées localement sur cet appareil.
        </p>
      </div>
    </div>
  );
}