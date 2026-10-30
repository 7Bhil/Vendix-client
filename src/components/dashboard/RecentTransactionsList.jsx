
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";

export default function RecentTransactionsList({ transactions = [] }) {
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-vendix-ink">
          Activité récente
        </h2>

        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vendix-surface text-vendix-brand">
            <ReceiptText size={26} aria-hidden="true" />
          </div>

          <p className="mt-4 font-semibold text-vendix-ink">
            Aucune opération pour le moment
          </p>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Tes ventes et tes encaissements apparaîtront ici dès ta première opération.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-vendix-ink">
          Activité récente
        </h2>

        <span className="text-sm text-slate-500">
          {recentTransactions.length} opération(s)
        </span>
      </div>

      <ul className="mt-4 divide-y divide-slate-200">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <li
              key={transaction.id}
              className="flex min-h-16 items-center gap-3 py-3"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vendix-surface text-vendix-brand"
              >
                {isIncome ? (
                  <ArrowDownLeft size={22} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={22} aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words font-medium text-vendix-ink">
                  {transaction.label}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {transaction.date}
                </p>
              </div>

              <p className="shrink-0 text-right font-semibold text-vendix-ink">
                {isIncome ? "+" : "−"}
                {Number(transaction.amount || 0).toLocaleString("fr-FR")} FCFA
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
