
export default function PasswordStrengthMeter({ password = '' }) {
  if (!password) return null

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ]

  const score = checks.filter(Boolean).length

  let level = 'Faible'
  let activeSegments = 1
  let color = 'bg-red-500'
  let textColor = 'text-red-600'

  if (password.length >= 8 && score >= 4) {
    level = 'Fort'
    activeSegments = 3
    color = 'bg-green-500'
    textColor = 'text-green-600'
  } else if (password.length >= 8 && score >= 3) {
    level = 'Moyen'
    activeSegments = 2
    color = 'bg-amber-500'
    textColor = 'text-amber-600'
  }

  return (
    <div className="mt-3" aria-live="polite">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Robustesse du mot de passe
        </span>

        <span className={`text-sm font-semibold ${textColor}`}>
          {level}
        </span>
      </div>

      <div
        className="grid grid-cols-3 gap-2"
        role="meter"
        aria-label="Robustesse du mot de passe"
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={score}
        aria-valuetext={level}
      >
        {[0, 1, 2].map((segment) => (
          <div
            key={segment}
            className={`h-2 rounded-full ${
              segment < activeSegments ? color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
