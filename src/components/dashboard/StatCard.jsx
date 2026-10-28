
import { LoaderCircle } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        aria-label={`Chargement de ${title}`}
        aria-busy="true"
      >
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-36 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-slate-600">
            {title}
          </h2>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-vendix-ink sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vendix-surface text-vendix-brand">
          {Icon ? <Icon size={24} aria-hidden="true" /> : null}
        </div>
      </div>

      {description ? (
        <p className="mt-3 text-sm text-slate-500">
          {description}
        </p>
      ) : null}
    </article>
  );
}
