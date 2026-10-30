import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Search, Users, Wallet } from 'lucide-react';
import { loadCustomers, formatCurrency, getDebtAge } from '../../utils/customerDebtUtils.js';
import WhatsAppReminderButton from '../../components/customers/WhatsAppReminderButton.jsx';

export default function CustomerListPage() {
  const [customers] = useState(loadCustomers);
  const [query, setQuery] = useState('');
  const debtors = customers.filter((customer) => customer.currentDebt > 0);
  const totalDebt = debtors.reduce((total, customer) => total + customer.currentDebt, 0);
  const normalizedQuery = query.trim().toLocaleLowerCase('fr');
  const filteredCustomers = customers.filter((customer) =>
    `${customer.fullName} ${customer.phone}`.toLocaleLowerCase('fr').includes(normalizedQuery),
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-vendix-brand">
            Vendix<span className="text-vendix-accent">.</span>
          </Link>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-vendix-brand">
            Espace boutique · Démo
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-semibold text-vendix-brand">Gestion de la boutique</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Clients et suivi des dettes
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Retrouvez les soldes à recouvrer et relancez vos clients en un clic.
          </p>
        </div>

        <section className="mb-7 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Total des dettes clients</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Wallet size={20} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {formatCurrency(totalDebt)} <span className="text-sm font-semibold">FCFA</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{debtors.length} client{debtors.length === 1 ? '' : 's'} avec un solde</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Clients enregistrés</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand">
                <Users size={20} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{customers.length}</p>
            <p className="mt-1 text-xs text-slate-500">Tous les clients de la boutique</p>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">Liste des clients</h2>
              <p className="mt-1 text-sm text-slate-500">Le solde et l’ancienneté sont calculés à partir des données disponibles.</p>
            </div>
            <label className="relative block sm:w-72">
              <span className="sr-only">Rechercher un client</span>
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nom ou téléphone"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          {filteredCustomers.length ? (
            <div className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const hasDebt = customer.currentDebt > 0;
                const age = getDebtAge(customer.oldestDebtDate);
                return (
                  <article key={customer.id} className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <Link to={`/app/clients/${customer.id}`} className="group min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${hasDebt ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {customer.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900 group-hover:text-vendix-brand">
                            {customer.fullName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">{customer.phone}</p>
                          {customer.address && <p className="mt-1 truncate text-xs text-slate-400">{customer.address}</p>}
                        </div>
                      </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-3 sm:min-w-64">
                      <div>
                        <p className="text-xs text-slate-500">Solde restant dû</p>
                        <p className={`mt-1 font-bold ${hasDebt ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {formatCurrency(customer.currentDebt)} FCFA
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Ancienneté</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-700">
                          {hasDebt ? (
                            age >= 30 ? <ArrowUpRight size={16} className="text-red-600" aria-hidden="true" /> : <ArrowDownRight size={16} className="text-slate-400" aria-hidden="true" />
                          ) : null}
                          {hasDebt ? `${age} jour${age > 1 ? 's' : ''}` : 'Aucune dette'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                      {hasDebt && <WhatsAppReminderButton customer={customer} className="w-full sm:w-auto" />}
                      <Link
                        to={`/app/clients/${customer.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Voir la fiche
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">Aucun client ne correspond à cette recherche.</p>
          )}
        </section>
        <p className="mt-5 text-xs text-slate-500">
          Prototype local : les règlements sont conservés dans ce navigateur et ne sont pas encore synchronisés avec un serveur.
        </p>
      </div>
    </main>
  );
}
