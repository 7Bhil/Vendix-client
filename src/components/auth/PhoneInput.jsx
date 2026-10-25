
import { useState } from 'react'

export default function PhoneInput({
  value = '',
  onChange,
  error = '',
  id = 'phone',
}) {
  const [touched, setTouched] = useState(false)

  // On s'assure que la valeur affichée est toujours une chaîne.
  const digits = String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 10)

  // Validation du numéro national béninois utilisé par le formulaire.
  let validationError = ''

  if (digits.length > 0 && touched) {
    if (digits.length !== 10) {
      validationError = 'Le numéro doit contenir exactement 10 chiffres.'
    } else if (!digits.startsWith('01')) {
      validationError = 'Le numéro doit commencer par 01.'
    }
  }

  const displayedError = error || validationError

  function handleChange(event) {
    // On transmet uniquement le numéro sous forme de texte,
    // jamais l'objet event ou un autre objet JavaScript.
    const nextDigits = event.target.value
      .replace(/\D/g, '')
      .slice(0, 10)

    onChange?.(nextDigits)
  }

  return (
    <div className="w-full">
     

      <div
        className={`flex h-12 w-full overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 ${
          displayedError
            ? 'border-red-500 focus-within:ring-red-100'
            : 'border-slate-300 focus-within:border-vendix-brand focus-within:ring-blue-100'
        }`}
      >
        <span
          className="flex shrink-0 items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-vendix-ink"
          aria-label="Indicatif du Bénin"
        >
          <span aria-hidden="true">BJ</span>
          +229
        </span>

        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="0197000001"
          value={digits}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          maxLength={10}
          required
          aria-invalid={Boolean(displayedError)}
          aria-describedby={displayedError ? `${id}-error` : `${id}-hint`}
          className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-vendix-ink outline-none placeholder:text-slate-400"
        />
      </div>

      {displayedError ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-red-600"
          role="alert"
        >
          {displayedError}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          Indicatif +229 inclus. Saisissez les 10 chiffres du numéro.
        </p>
      )}
    </div>
  )
}
