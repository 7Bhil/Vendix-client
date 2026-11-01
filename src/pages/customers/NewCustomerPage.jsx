import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { loadCustomers, saveCustomers } from "../../utils/customerDebtUtils";

export default function NewCustomerPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError("Le nom complet et le numéro de téléphone sont requis.");
      return;
    }

    try {
      const customers = loadCustomers();
      const newCustomer = {
        id: `c-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        currentDebt: 0,
        oldestDebtDate: null,
        totalPurchases: 0,
        totalPaid: 0,
        statement: [],
        paymentHistory: [],
      };

      saveCustomers([newCustomer, ...customers]);
      setSuccess(true);
      setTimeout(() => {
        navigate("/app/customers");
      }, 1000);
    } catch (err) {
      setError("Impossible d'enregistrer le client : " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/app/customers"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
            aria-label="Retour"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Nouveau Client
            </h1>
            <p className="text-xs text-slate-500">
              Enregistrez une fiche client pour le suivi des créances et des relances.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              <CheckCircle2 size={16} />
              <span>Client enregistré avec succès ! Redirection...</span>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nom complet *
            </label>
            <input
              type="text"
              required
              placeholder="Ex : Mme Clarisse Dossou"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Téléphone ou WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="Ex : +22996112233"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Adresse ou localisation
            </label>
            <input
              type="text"
              placeholder="Ex : Dantokpa, Allée 4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Notes complémentaires
            </label>
            <textarea
              rows="3"
              placeholder="Ex : Règle généralement le vendredi en fin de journée."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <button
            type="submit"
            disabled={success}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white transition hover:bg-vendix-brand-dark disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <UserPlus size={16} />
            <span>Enregistrer le client</span>
          </button>
        </form>
      </div>
    </div>
  );
}
