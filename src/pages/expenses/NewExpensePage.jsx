
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
  Users,
  Package,
  CircleHelp,
  Banknote,
  Smartphone,
  CreditCard,
  CircleDollarSign,
  CheckCircle2,
  Info,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

import expensesData from "../../mocks/modules/expenses.json";

import {
  formatFCFA,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "../../utils/expenses";

// ============================================
// DATE DU JOUR
// ============================================

const getTodayDate = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

// ============================================
// ICÔNES DES CATÉGORIES
// ============================================

const categoryIcons = {
  LOYER: Building2,
  TRANSPORT: Truck,
  ENERGIE: Zap,
  SALAIRES: Users,
  FOURNITURES: Package,
  AUTRE: CircleHelp,
};

// Styles des catégories
const categoryStyles = {
  LOYER: "border-violet-200 bg-violet-50 text-violet-700",
  TRANSPORT: "border-amber-200 bg-amber-50 text-amber-700",
  ENERGIE: "border-sky-200 bg-sky-50 text-sky-700",
  SALAIRES: "border-blue-200 bg-blue-50 text-blue-700",
  FOURNITURES: "border-emerald-200 bg-emerald-50 text-emerald-700",
  AUTRE: "border-slate-200 bg-slate-50 text-slate-700",
};

// ============================================
// ICÔNES DES MOYENS DE PAIEMENT
// ============================================

const paymentIcons = {
  CASH: Banknote,
  MOBILE_MONEY: Smartphone,
  CARD: CreditCard,
  OTHER: CircleDollarSign,
};

// ============================================
// PAGE NOUVELLE DÉPENSE
// ============================================

export default function NewExpensePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    paymentMethod: "",
    date: getTodayDate(),
    description: "",
    receipt: "",
  });

  const [error, setError] = useState("");
  const [isReadingReceipt, setIsReadingReceipt] = useState(false);

  // Catégorie sélectionnée
  const selectedCategory = EXPENSE_CATEGORIES.find(
    (category) => category.value === formData.category
  );

  // ============================================
  // MODIFICATION DES CHAMPS
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // ============================================
  // SÉLECTION DE LA CATÉGORIE
  // ============================================

  const handleCategorySelect = (value) => {
    setFormData((previousData) => ({
      ...previousData,
      category: value,
    }));

    setError("");
  };

  // ============================================
  // SÉLECTION DU MOYEN DE PAIEMENT
  // ============================================

  const handlePaymentSelect = (value) => {
    setFormData((previousData) => ({
      ...previousData,
      paymentMethod: value,
    }));

    setError("");
  };

  // ============================================
  // AJOUT D'UNE PHOTO DE REÇU
  // ============================================

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Vérifier le format du fichier
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide.");
      e.target.value = "";
      return;
    }

    // Limiter la taille à 1,5 Mo
    if (file.size > 1.5 * 1024 * 1024) {
      setError(
        "La photo est trop volumineuse. Choisissez une image de 1,5 Mo maximum."
      );
      e.target.value = "";
      return;
    }

    setError("");
    setIsReadingReceipt(true);

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((previousData) => ({
        ...previousData,
        receipt: reader.result,
      }));

      setIsReadingReceipt(false);
    };

    reader.onerror = () => {
      setError("Impossible de lire cette image. Veuillez réessayer.");
      setIsReadingReceipt(false);
    };

    reader.readAsDataURL(file);
  };

  // ============================================
  // SUPPRESSION DE LA PHOTO
  // ============================================

  const removeReceipt = () => {
    setFormData((previousData) => ({
      ...previousData,
      receipt: "",
    }));

    const input = document.getElementById("receipt");

    if (input) {
      input.value = "";
    }
  };

  // ============================================
  // ENREGISTREMENT DE LA DÉPENSE
  // ============================================

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

    if (isReadingReceipt) {
      setError("Veuillez patienter pendant le chargement de la photo.");
      return;
    }

    let expenses = [];

    try {
      const savedExpenses = localStorage.getItem("vendix_expenses");

      expenses = savedExpenses
        ? JSON.parse(savedExpenses)
        : expensesData.expenses || [];

      if (!Array.isArray(expenses)) {
        expenses = expensesData.expenses || [];
      }
    } catch (error) {
      console.error("Erreur de lecture des dépenses :", error);
      expenses = expensesData.expenses || [];
    }

    const newExpense = {
      id: Date.now(),
      amount: Number(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      description:
        formData.description.trim() || "Dépense de la boutique",
      receipt: formData.receipt || null,
    };

    const updatedExpenses = [newExpense, ...expenses];

    try {
      localStorage.setItem(
        "vendix_expenses",
        JSON.stringify(updatedExpenses)
      );

      navigate("/app/expenses");
    } catch (storageError) {
      console.error("Erreur d'enregistrement :", storageError);

      setError(
        "Impossible d'enregistrer cette dépense. Le stockage de votre navigateur est peut-être plein. Essayez une photo plus légère."
      );
    }
  };

  // ============================================
  // INTERFACE
  // ============================================

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

          {/* CATÉGORIES */}
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {EXPENSE_CATEGORIES.map((category) => {
                const Icon =
                  categoryIcons[category.value] || CircleHelp;

                const isSelected =
                  formData.category === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategorySelect(category.value)}
                    className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`rounded-xl border p-2.5 ${
                        categoryStyles[category.value] ||
                        categoryStyles.AUTRE
                      }`}
                    >
                      <Icon size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {category.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {category.value === "LOYER" &&
                          "Local et location"}

                        {category.value === "TRANSPORT" &&
                          "Déplacements"}

                        {category.value === "ENERGIE" &&
                          "Eau et électricité"}

                        {category.value === "SALAIRES" &&
                          "Rémunération du personnel"}

                        {category.value === "FOURNITURES" &&
                          "Emballages et matériel"}

                        {category.value === "AUTRE" &&
                          "Autres dépenses"}
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
              {PAYMENT_METHODS.map((method) => {
                const Icon =
                  paymentIcons[method.value] || CircleDollarSign;

                const isSelected =
                  formData.paymentMethod === method.value;

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handlePaymentSelect(method.value)}
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

              {/* DATE */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Date de la dépense{" "}
                  <span className="text-red-500">*</span>
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

              {/* DESCRIPTION */}
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

          {/* PHOTO DU REÇU */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-700" />

              <h2 className="font-semibold text-slate-900">
                Justificatif de dépense
              </h2>

              <span className="text-xs text-slate-400">
                (facultatif)
              </span>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              Ajoutez une photo de votre facture ou de votre reçu de caisse.
            </p>

            {!formData.receipt ? (
              <label
                htmlFor="receipt"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-7 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Upload size={23} />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {isReadingReceipt
                    ? "Chargement de la photo..."
                    : "Joindre une photo"}
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG ou autre image (1,5 Mo maximum)
                </span>

                <input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle2
                      size={17}
                      className="text-emerald-600"
                    />
                    Photo ajoutée
                  </div>

                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <X size={15} />
                    Retirer
                  </button>
                </div>

                <img
                  src={formData.receipt}
                  alt="Aperçu du justificatif de dépense"
                  className="max-h-72 w-full bg-slate-100 object-contain"
                />
              </div>
            )}
          </div>

          {/* RÉCAPITULATIF */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Info
                size={19}
                className="mt-0.5 shrink-0 text-blue-700"
              />

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
                    {PAYMENT_METHODS.find(
                      (method) =>
                        method.value === formData.paymentMethod
                    )?.label || "Paiement non sélectionné"}
                  </span>
                </div>

                {formData.receipt && (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    <CheckCircle2
                      size={14}
                      className="mr-1 inline"
                    />
                    Un justificatif sera enregistré.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* MESSAGE D'ERREUR */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* BOUTONS */}
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
              disabled={isReadingReceipt}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
