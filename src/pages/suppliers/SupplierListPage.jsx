import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Truck,
  Phone,
  MapPin,
  ChevronRight,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-react';
import {
  formatCurrency,
  loadSuppliers,
  saveSuppliers,
} from '../../utils/supplierUtils.js';
import SupplierPaymentModal from '../../components/suppliers/SupplierPaymentModal.jsx';

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'WITH_DEBT' | 'SETTLED'
  const [activePaymentSupplier, setActivePaymentSupplier] = useState(null);

  // Statistiques financières du carnet fournisseurs
  const stats = useMemo(() => {
    return suppliers.reduce(
      (acc, s) => {
        acc.totalSuppliers += 1;
        acc.totalDebt += s.currentDebt || 0;
        acc.totalPurchases += s.totalPurchases || 0;
        if ((s.currentDebt || 0) > 0) acc.suppliersWithDebt += 1;
        return acc;
      },
      { totalSuppliers: 0, totalDebt: 0, totalPurchases: 0, suppliersWithDebt: 0 },
    );
  }, [suppliers]);

  // Filtrage
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchSearch =
        supplier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm);

      if (!matchSearch) return false;

      const debt = supplier.currentDebt || 0;
      if (filterMode === 'WITH_DEBT') return debt > 0;
      if (filterMode === 'SETTLED') return debt === 0;
      return true;
    });
  }, [suppliers, searchTerm, filterMode]);

  const handleRecordPayment = (paymentData) => {
    if (!activePaymentSupplier) return;

    const updated = suppliers.map((s) => {
      if (s.id !== activePaymentSupplier.id) return s;

      const newDebt = Math.max(0, (s.currentDebt || 0) - paymentData.amount);
      const newPaid = (s.totalPaid || 0) + paymentData.amount;
      const newStatementEntry = {
        id: `reg-${Date.now()}`,
        date: paymentData.date,
        type: 'REGLEMENT_FOURNISSEUR',
        ref: `REG-${Date.now().toString().slice(-4)}`,
        totalCost: 0,
        amountPaid: paymentData.amount,
        debtAmount: newDebt,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes,
      };

      return {
        ...s,
        currentDebt: newDebt,
        totalPaid: newPaid,
        statement: [newStatementEntry, ...(s.statement || [])],
      };
    });

    setSuppliers(updated);
    saveSuppliers(updated);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vendix-brand">
            <Truck size={15} />
            <span>Approvisionnements</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Fournisseurs & Dettes
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Répertoire de vos fournisseurs, historique des achats et suivi des dettes fournisseurs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/app/purchases/new"
            className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <Plus size={16} />
            <span>Nouvel achat de stock</span>
          </Link>
        </div>
      </div>

      {/* Barre de synthèse mobile et métriques */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Dette totale due :</span>
          <span className="font-extrabold text-amber-800">
            {formatCurrency(stats.totalDebt)} FCFA
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
          <span>{stats.suppliersWithDebt} en attente de règlement</span>
          <span>{stats.totalSuppliers} fournisseurs actifs</span>
        </div>
      </div>

      {/* Cartes métriques desktop */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Dette totale due</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Wallet size={16} />
            </span>
          </div>
          <p className="mt-2 text-xl font-black text-amber-800 sm:text-2xl">
            {formatCurrency(stats.totalDebt)}{' '}
            <span className="text-xs font-bold text-slate-400">FCFA</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {stats.suppliersWithDebt} fournisseur(s) en attente de règlement
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Volume total d'achats</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <Truck size={16} />
            </span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
            {formatCurrency(stats.totalPurchases)}{' '}
            <span className="text-xs font-bold text-slate-400">FCFA</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Cumul de tous les achats enregistrés</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Fournisseurs actifs</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Building2 size={16} />
            </span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
            {stats.totalSuppliers}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Partenaires et grossistes répertoriés</p>
        </article>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, enseigne ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-[11px] font-bold sm:flex sm:text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({suppliers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('WITH_DEBT')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'WITH_DEBT'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Avec dettes ({stats.suppliersWithDebt})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('SETTLED')}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterMode === 'SETTLED'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              À jour ({suppliers.length - stats.suppliersWithDebt})
            </button>
          </div>
        </div>
      </div>

      {/* Liste des fournisseurs */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center">
            <Truck size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-800">Aucun fournisseur trouvé</p>
            <p className="mt-1 text-xs text-slate-500">
              Modifiez vos critères de recherche ou enregistrez un nouvel achat.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSuppliers.map((supplier) => {
              const hasDebt = (supplier.currentDebt || 0) > 0;
              return (
                <div
                  key={supplier.id}
                  className="flex flex-col gap-2.5 p-3.5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-4"
                >
                  {/* Identité */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app/suppliers/${supplier.id}`}
                        className="truncate text-xs sm:text-sm font-bold text-slate-900 hover:text-vendix-brand hover:underline"
                      >
                        {supplier.fullName}
                      </Link>
                      {supplier.companyName && (
                        <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 md:inline">
                          {supplier.companyName}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        <a href={`tel:${supplier.phone}`} className="hover:underline">
                          {supplier.phone}
                        </a>
                      </span>
                      {supplier.address && (
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{supplier.address}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Situation financière & Actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 sm:border-0 sm:pt-0 sm:gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Dette due
                      </p>
                      <p
                        className={`text-xs sm:text-sm font-black ${
                          hasDebt ? 'text-amber-800' : 'text-emerald-700'
                        }`}
                      >
                        {formatCurrency(supplier.currentDebt)}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasDebt && (
                        <button
                          type="button"
                          onClick={() => setActivePaymentSupplier(supplier)}
                          className="flex h-8 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-900 transition hover:bg-amber-100 active:scale-95"
                        >
                          <CreditCard size={13} />
                          <span>Régler</span>
                        </button>
                      )}
                      <Link
                        to={`/app/suppliers/${supplier.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                        aria-label={`Voir la fiche de ${supplier.fullName}`}
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de versement / règlement */}
      <SupplierPaymentModal
        isOpen={Boolean(activePaymentSupplier)}
        onClose={() => setActivePaymentSupplier(null)}
        supplier={activePaymentSupplier}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  );
}
