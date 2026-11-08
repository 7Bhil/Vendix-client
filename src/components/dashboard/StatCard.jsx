export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
  featured = false,
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

  if (featured) {
    return (
      <article className="col-span-2 sm:col-span-1 min-w-0 rounded-2xl bg-slate-900 p-3.5 sm:p-5 text-white shadow-2xs transition-all duration-150">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 truncate">
              {title}
            </h2>
          </div>
          {Icon ? <Icon size={16} className="text-emerald-400 shrink-0" /> : null}
        </div>

        <p className="mt-1.5 font-money text-lg sm:text-2xl font-black tracking-tight text-white">
          {value}
        </p>
      </article>
    );
  }

  return (
    <article className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3.5 sm:p-5 shadow-2xs transition-all duration-150">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </h2>
        {Icon ? <Icon size={16} className="text-slate-400 shrink-0" /> : null}
      </div>

      <p className="mt-1.5 font-money text-base sm:text-2xl font-black tracking-tight text-slate-900 truncate">
        {value}
      </p>
    </article>
  );
}
