import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  Search,
  Users,
  Wallet,
  UserPlus,
  Phone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { loadCustomers, formatCurrency, getDebtAge } from '../../utils/customerDebtUtils.js';
import WhatsAppReminderButton from '../../components/customers/WhatsAppReminderButton.jsx';

export default function CustomerListPage() {
  const [customers] = useState(loadCustomers);
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'DEBTORS' | 'UP_TO_DATE'

  const debtors = customers.filter((customer) => customer.currentDebt > 0);
  const totalDebt = debtors.reduce((total, customer) => total + customer.currentDebt, 0);
  const normalizedQuery = query.trim().toLocaleLowerCase('fr');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = `${customer.fullName} ${customer.phone}`
      .toLocaleLowerCase('fr')
      .includes(normalizedQuery);

    if (!matchesSearch) return false;

    if (filterMode === 'DEBTORS') return customer.currentDebt > 0;
    if (filterMode === 'UP_TO_DATE') return customer.currentDebt === 0;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* En-tête de page intégré (sans header doublon) */}
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
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <UserPlus size={16} />
          <span>Nouveau client</span>
        </Link>
      </div>

      {/* Cartes métriques compactes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total des créances</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Wallet size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {formatCurrency(totalDebt)} <span className="text-xs font-bold text-slate-500">FCFA</span>
          </p>
          <p className="mt-1 text-xs text-amber-700 font-medium">
            {debtors.length} client{debtors.length > 1 ? 's' : ''} en attente de règlement
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Clients enregistrés</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {customers.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Portefeuille actif de la boutique
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Taux de recouvrement</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-emerald-700">
            {customers.length > 0 ? Math.round(((customers.length - debtors.length) / customers.length) * 100) : 100}%
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Clients entièrement à jour
          </p>
        </div>
      </div>

      {/* Zone de tableau et filtrage pro */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Barre d'outils : recherche & onglets */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom ou téléphone..."
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-4 text-xs font-medium outline-none transition focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
            />
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

        {/* Liste des clients au format liste pro */}
        {filteredCustomers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => {
              const hasDebt = customer.currentDebt > 0;
              const age = getDebtAge(customer.oldestDebtDate);
              const initials = customer.fullName
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('');

              return (
                <div
                  key={customer.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Identité client */}
                  <Link
                    to={`/app/customers/${customer.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3.5 group"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black transition ${
                        hasDebt
                          ? 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                          : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-vendix-brand">
                          {customer.fullName}
                        </h3>
                        {hasDebt && (
                          <span className="hidden sm:inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Dette en cours
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Phone size={12} className="text-slate-400" />
                          {customer.phone}
                        </span>
                        {customer.address && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{customer.address}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Données financières */}
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

                    {/* Actions directes */}
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
        ) : (
          <div className="p-10 text-center">
            <Users size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-800">Aucun client trouvé</p>
            <p className="mt-1 text-xs text-slate-500">
              Aucun dossier ne correspond à vos filtres actuels.
            </p>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-xs font-bold text-vendix-brand hover:underline"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
