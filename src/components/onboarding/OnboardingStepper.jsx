export default function OnboardingStepper({ currentStep, totalSteps = 2, onSkip }) {
  const steps = [
    { number: 1, label: "Identité de la boutique" },
    { number: 2, label: "Premier produit" },
  ];

  return (
    <div className="w-full">
      {/* Barre supérieure d'étapes et bouton passer */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
          Étape {currentStep} sur {totalSteps}
        </span>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-slate-500 transition hover:text-vendix-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            Configurer plus tard
          </button>
        )}
      </div>

      {/* Jauge de progression visuelle */}
      <div className="mt-3 grid grid-cols-2 gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        {steps.map((s) => {
          const isActive = s.number === currentStep;
          const isDone = s.number < currentStep;

          return (
            <div key={s.number} className="flex flex-col gap-1.5">
              <div
                className={`h-2 w-full rounded-full transition-all duration-300 ${
                  isDone || isActive ? "bg-vendix-brand" : "bg-slate-200"
                }`}
              />
              <p
                className={`text-[11px] font-medium transition-colors ${
                  isActive
                    ? "font-bold text-vendix-brand"
                    : isDone
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
