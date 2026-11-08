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
    <div className="p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6 max-w-4xl mx-auto">
      {/* En-tête sobre et direct */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 sm:text-xl">
            Clients & Dettes
          </h1>
          <p className="text-[11px] text-slate-500">
            {customers.length} client(s) • {debtors.length} avec créance ({formatCurrency(totalDebt)} FCFA)
          </p>
        </div>

        <Link
          to="/app/customers/new"
          className="flex h-9 items-center gap-1.5 rounded-xl bg-vendix-brand px-3 text-xs font-bold text-white shadow-2xs transition active:scale-95"
        >
          <UserPlus size={15} />
          <span>Nouveau</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs font-semibold text-amber-800 border border-amber-200">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Barre de recherche unique et discrète */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand shadow-2xs"
        />
      </div>

      {/* Filtres discrets en texte/onglets légers */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 text-xs">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('ALL')}
            className={`pb-1 font-bold transition border-b-2 ${
              filterMode === 'ALL'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tous ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('DEBTORS')}
            className={`pb-1 font-bold transition border-b-2 ${
              filterMode === 'DEBTORS'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Dettes ({debtors.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('UP_TO_DATE')}
            className={`pb-1 font-bold transition border-b-2 ${
              filterMode === 'UP_TO_DATE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            À jour
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <ArrowUpDown size={12} className="text-slate-400" />
          <select
            id="customer-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="DEBT_DESC">Dette max</option>
            <option value="NAME_ASC">Nom A-Z</option>
            <option value="DEBT_ASC">Dette min</option>
          </select>
        </div>
      </div>

      {/* Liste des clients - Format épuré, fluide et non surchargé */}
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Chargement...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs font-semibold text-slate-500">Aucun client trouvé</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const hasDebt = (customer.currentDebt || 0) > 0;
            const age = getDebtAge(customer.oldestDebtDate);

            return (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 transition hover:bg-slate-50/80 active:bg-slate-100"
              >
                {/* Info client & clic vers fiche */}
                <Link
                  to={`/app/customers/${customer.id}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 mr-2"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      hasDebt ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {(customer.fullName || 'C')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {customer.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {customer.phone || 'Sans numéro'}
                    </p>
                  </div>
                </Link>

                {/* Montant dû & action contextuelle */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p
                      className={`text-xs font-black ${
                        hasDebt ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(customer.currentDebt)}{' '}
                      <span className="text-[10px] font-normal text-slate-400">F</span>
                    </p>
                    {hasDebt && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {age} j
                      </p>
                    )}
                  </div>

                  {hasDebt ? (
                    <WhatsAppReminderButton customer={customer} compact />
                  ) : (
                    <Link
                      to={`/app/customers/${customer.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      aria-label="Fiche"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
