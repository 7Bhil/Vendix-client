
import { useState } from 'react'

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete = 'new-password',
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={8}
        placeholder="Au moins 8 caractères"
        className="h-12 w-full rounded-lg border border-slate-300 px-3 pr-24 text-sm text-vendix-ink outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="button"
        onClick={() => setVisible((previous) => !previous)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-3 flex items-center gap-1 text-sm font-medium text-vendix-brand hover:text-vendix-brand-dark"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          {visible ? (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 002.8 2.8" />
              <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9 7-.2 1.1-1 2.5-2.2 3.7" />
              <path d="M6.2 6.2C3.9 7.7 2.4 10 2 12c.5 2.5 4 7 10 7 1.2 0 2.3-.2 3.3-.6" />
            </>
          ) : (
            <>
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
        {visible ? 'Masquer' : 'Afficher'}
      </button>
    </div>
  )
}
