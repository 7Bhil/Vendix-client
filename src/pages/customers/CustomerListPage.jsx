import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Users,
  Wallet,
  UserPlus,
  Phone,
  Clock,
  ChevronRight,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import { loadCustomers, formatCurrency, getDebtAge } from '../../utils/customerDebtUtils.js';
import WhatsAppReminderButton from '../../components/customers/WhatsAppReminderButton.jsx';
import { customersService } from '../../api/services.js';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'DEBTORS' | 'UP_TO_DATE'
  const [sortBy, setSortBy] = useState('DEBT_DESC'); // 'DEBT_DESC' | 'NAME_ASC' | 'DEBT_ASC'
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchCustomers() {
      setIsLoading(true);
      setError('');
      try {
        const result = await customersService.getAll();
        if (isMounted) {
          if (Array.isArray(result)) {
            const mapped = result.map((c) => ({
              id: c.id,
              fullName: c.full_name,
              phone: c.phone,
              currentDebt: c.outstanding_debt || 0,
              oldestDebtDate: c.sales?.[0]?.created_at || null,
              statement: c.repayments || [],
            }));
            setCustomers(mapped);
          } else {
            setCustomers([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erreur chargement clients API:', err);
          setError(err?.message || 'Erreur lors de la récupération des clients depuis le serveur.');
          setCustomers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  const debtors = customers.filter((customer) => (customer.currentDebt || 0) > 0);
  const totalDebt = debtors.reduce((total, customer) => total + (customer.currentDebt || 0), 0);
  const normalizedQuery = query.trim().toLocaleLowerCase('fr');

  const filteredCustomers = useMemo(() => {
    const list = customers.filter((customer) => {
      const matchesSearch = `${customer.fullName || ''} ${customer.phone || ''}`
        .toLocaleLowerCase('fr')
        .includes(normalizedQuery);

      if (!matchesSearch) return false;

      if (filterMode === 'DEBTORS') return (customer.currentDebt || 0) > 0;
      if (filterMode === 'UP_TO_DATE') return (customer.currentDebt || 0) === 0;
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'DEBT_DESC') {
        const debtDiff = (b.currentDebt || 0) - (a.currentDebt || 0);
        if (debtDiff !== 0) return debtDiff;
        return (a.fullName || '').localeCompare(b.fullName || '', 'fr');
      }
      if (sortBy === 'DEBT_ASC') {
        const debtDiff = (a.currentDebt || 0) - (b.currentDebt || 0);
        if (debtDiff !== 0) return debtDiff;
        return (a.fullName || '').localeCompare(b.fullName || '', 'fr');
      }
      if (sortBy === 'NAME_ASC') {
        return (a.fullName || '').localeCompare(b.fullName || '', 'fr');
      }
      return 0;
    });
  }, [customers, normalizedQuery, filterMode, sortBy]);

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* En-tête de page moderne mobile-first */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
            Clients & Dettes
          </h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">
            Gestion du carnet et recouvrement WhatsApp.
          </p>
        </div>

        <Link
          to="/app/customers/new"
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-vendix-brand px-3.5 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-vendix-brand-dark active:scale-95"
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Nouveau client</span>
          <span className="sm:hidden">Ajouter</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 border border-amber-200">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Cartes métriques compactes et soignées sur mobile */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <article className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/70 sm:text-xs">
              Créances Dues
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-900 sm:h-8 sm:w-8 sm:rounded-xl">
              <Wallet size={15} />
            </span>
          </div>
          <p className="mt-1 text-base font-black text-amber-950 sm:text-2xl">
            {formatCurrency(totalDebt)} <span className="text-[10px] font-bold text-amber-700/60 sm:text-xs">FCFA</span>
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-amber-800 sm:text-xs">
            {debtors.length} client(s) endetté(s)
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
              Total Clients
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 sm:h-8 sm:w-8 sm:rounded-xl">
              <Users size={15} />
            </span>
          </div>
          <p className="mt-1 text-base font-black text-slate-900 sm:text-2xl">
            {customers.length}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-emerald-700 sm:text-xs">
            {customers.length - debtors.length} à jour
          </p>
        </article>
      </div>

      {/* Recherche et filtres épurés */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand shadow-2xs"
          />
        </div>

        {/* Pilules de filtres horizontales adaptées au pouce */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tous ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('DEBTORS')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'DEBTORS'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Débiteurs ({debtors.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('UP_TO_DATE')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'UP_TO_DATE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              À jour ({customers.length - debtors.length})
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-2xs">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              id="customer-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="DEBT_DESC">Dette</option>
              <option value="NAME_ASC">Nom</option>
              <option value="DEBT_ASC">Dette croissante</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des clients - Format carte tactile sur mobile */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50 border border-slate-100" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-2xs">
            <Users size={32} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-800">Aucun client trouvé</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Modifiez vos critères de recherche ou enregistrez un nouveau client.
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const hasDebt = (customer.currentDebt || 0) > 0;
            const age = getDebtAge(customer.oldestDebtDate);

            return (
              <div
                key={customer.id}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all duration-150 active:scale-[0.99] hover:shadow-sm"
              >
                {/* Ligne 1 : Avatar, Nom, Téléphone et Solde dû */}
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/app/customers/${customer.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-sm shadow-2xs ${
                        hasDebt ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {(customer.fullName || 'C')[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {customer.fullName}
                      </p>
                      {customer.phone && (
                        <p className="text-xs text-slate-500 font-medium">
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {hasDebt ? 'Reste dû' : 'Solde'}
                    </p>
                    <p
                      className={`text-sm font-black ${
                        hasDebt ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(customer.currentDebt)}{' '}
                      <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
                    </p>
                  </div>
                </div>

                {/* Ligne 2 (Séparateur & Actions rapides ergonomiques au pouce) */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <Clock size={13} className="text-slate-400" />
                    <span>{hasDebt ? `${age} j d'ancienneté` : 'À jour'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
                        aria-label={`Appeler ${customer.fullName}`}
                        title="Appeler"
                      >
                        <Phone size={15} />
                      </a>
                    )}

                    {hasDebt && (
                      <WhatsAppReminderButton customer={customer} compact />
                    )}

                    <Link
                      to={`/app/customers/${customer.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 active:scale-95"
                      aria-label={`Fiche de ${customer.fullName}`}
                    >
                      <ChevronRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
