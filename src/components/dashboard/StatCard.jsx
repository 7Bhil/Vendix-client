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
        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
        aria-label={`Chargement de ${title}`}
        aria-busy="true"
      >
        <div className="h-3.5 w-24 rounded bg-slate-200" />
        <div className="mt-3 h-7 w-32 rounded bg-slate-200" />
        <div className="mt-2 h-2.5 w-20 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-semibold text-slate-500 sm:text-sm">
            {title}
          </h2>

          <p className="mt-2 break-words text-xl font-black tracking-tight text-vendix-ink sm:text-2xl lg:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-vendix-brand sm:h-11 sm:w-11">
          {Icon ? <Icon size={20} aria-hidden="true" /> : null}
        </div>
      </div>

      {description ? (
        <p className="mt-2 text-xs text-slate-500 line-clamp-1">
          {description}
        </p>
      ) : null}
    </article>
  );
}
