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
      <article className="min-w-0 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-card-elevated sm:p-6 transition-all duration-200">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {title}
              </h2>
            </div>

            <p className="mt-2.5 break-words font-money text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {value}
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400 backdrop-blur-xs">
            {Icon ? <Icon size={24} aria-hidden="true" /> : null}
          </div>
        </div>

        {description ? (
          <p className="mt-3 text-xs text-slate-300 font-medium">
            {description}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card-subtle sm:p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {title}
          </h2>

          <p className="mt-2 break-words font-money text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
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
