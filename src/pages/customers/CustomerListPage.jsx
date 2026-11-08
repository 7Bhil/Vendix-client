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
          if (Array.isArray(result) && result.length > 0) {
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
            setCustomers(loadCustomers());
          }
        }
      } catch (err) {
        if (isMounted) {
          setCustomers(loadCustomers());
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Clients & Carnet de Dettes
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Consultez les encours clients, l'ancienneté des créances et envoyez des relances WhatsApp.
          </p>
        </div>

        <Link
          to="/app/customers/new"
          className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
        >
          <UserPlus size={16} />
          <span>Nouveau client</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 border border-amber-200">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Cartes métriques */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Total des créances clients</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Wallet size={16} />
            </span>
          </div>
          <p className="mt-2 text-xl font-black text-amber-800 sm:text-2xl">
            {formatCurrency(totalDebt)} <span className="text-xs font-bold text-slate-400">FCFA</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {debtors.length} client(s) ont un reste à payer
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Répertoire clients</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <Users size={16} />
            </span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
            {customers.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {customers.length - debtors.length} client(s) sont totalement à jour
          </p>
        </article>
      </div>

      {/* Recherche et filtres */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou numéro de téléphone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
              <ArrowUpDown size={14} className="text-slate-400" />
              <label htmlFor="customer-sort-select" className="text-[11px] font-semibold text-slate-500">
                Trier :
              </label>
              <select
                id="customer-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="DEBT_DESC">Dette décroissante (Recommandé)</option>
                <option value="NAME_ASC">Nom (A-Z)</option>
                <option value="DEBT_ASC">Dette croissante</option>
              </select>
            </div>

            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`rounded-lg px-3 py-1.5 transition ${
                  filterMode === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous ({customers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('DEBTORS')}
                className={`rounded-lg px-3 py-1.5 transition ${
                  filterMode === 'DEBTORS' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Débiteurs ({debtors.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('UP_TO_DATE')}
                className={`rounded-lg px-3 py-1.5 transition ${
                  filterMode === 'UP_TO_DATE' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                À jour ({customers.length - debtors.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50 border border-slate-100" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-800">Aucun client trouvé</p>
            <p className="mt-1 text-xs text-slate-500">
              Modifiez vos critères de recherche ou enregistrez un nouveau client.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => {
              const hasDebt = (customer.currentDebt || 0) > 0;
              const age = getDebtAge(customer.oldestDebtDate);

              return (
                <div
                  key={customer.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    to={`/app/customers/${customer.id}`}
                    className="flex items-center gap-3 min-w-0"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm ${
                        hasDebt ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {(customer.fullName || 'C')[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 hover:text-vendix-brand hover:underline">
                        {customer.fullName}
                      </p>
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-vendix-brand hover:underline"
                        >
                          <Phone size={11} className="text-slate-400" />
                          <span>{customer.phone}</span>
                        </a>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Solde dû
                      </p>
                      <p
                        className={`text-sm font-black ${
                          hasDebt ? 'text-amber-800' : 'text-emerald-700'
                        }`}
                      >
                        {formatCurrency(customer.currentDebt)} <span className="text-[11px] font-semibold text-slate-400">FCFA</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right min-w-[90px]">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Ancienneté
                      </p>
                      <p className="flex items-center gap-1 text-xs font-bold text-slate-700 sm:justify-end">
                        <Clock size={12} className="text-slate-400" />
                        <span>{hasDebt ? `${age} j` : '0 j'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasDebt && <WhatsAppReminderButton customer={customer} />}
                      <Link
                        to={`/app/customers/${customer.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Voir la fiche de ${customer.fullName}`}
                      >
                        <ChevronRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
