import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from './PhoneInput.jsx'
import PasswordInput from './PasswordInput.jsx'
import PasswordStrengthMeter from './PasswordStrengthMeter.jsx'


const initialFormData = {
  shopName: '',
  phone: '',
  email: '',
  activityType: 'DETAILLANT',
  password: '',
  acceptTerms: false,
}

export default function SignupForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      form: '',
    }))
  }

  function validateForm() {
    const newErrors = {}

    if (formData.shopName.trim().length < 3) {
      newErrors.shopName =
        'Le nom de la boutique doit contenir au moins 3 caractères.'
    }

    if (!/^01\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        'Saisissez un numéro valide de 10 chiffres commençant par 01.'
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Veuillez saisir une adresse e-mail valide.'
    }

    if (formData.password.length < 8) {
      newErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        'Vous devez accepter les conditions pour continuer.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormReady =
    formData.shopName.trim().length >= 3 &&
    /^01\d{8}$/.test(formData.phone) &&
    (!formData.email.trim() ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) &&
    formData.password.length >= 8 &&
    formData.acceptTerms

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting || !validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopName: formData.shopName.trim(),
          phone: formData.phone,
          email: formData.email.trim() || undefined,
          activityType: formData.activityType,
          password: formData.password,
          termsAccepted: formData.acceptTerms,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        const serverMessage = Array.isArray(result.message)
          ? result.message.join(' ')
          : result.message

        setErrors({
          form:
            response.status === 409
              ? 'Ce numéro ou cet e-mail possède déjà un compte. Vérifiez vos informations.'
              : serverMessage ||
                'Impossible de créer le compte. Veuillez réessayer.',
        })
        return
      }

      navigate('/demarrage', {
        state: { user: result.user },
      })
    } catch {
      setErrors({
        form:
          "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Nom de la boutique */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="shopName"
            className="text-sm font-medium text-vendix-ink"
          >
            Nom de votre commerce
          </label>
          <span className="text-xs font-medium text-emerald-600">Obligatoire</span>
        </div>

        <input
          id="shopName"
          name="shopName"
          type="text"
          value={formData.shopName}
          onChange={handleChange}
          autoComplete="organization"
          placeholder="Ex: Boutique Le Progrès ou Tokpa Mode"
          minLength={3}
          aria-invalid={Boolean(errors.shopName)}
          aria-describedby={errors.shopName ? 'shopName-error' : undefined}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
        />

        {errors.shopName && (
          <p id="shopName-error" className="mt-1.5 text-xs text-red-600">
            {errors.shopName}
          </p>
        )}
      </div>

      {/* Téléphone béninois */}
      <div>
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
          <label className="text-sm font-medium text-vendix-ink">
            Numéro de téléphone
          </label>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            💬 Pour vos alertes SMS & WhatsApp
          </span>
        </div>

        <PhoneInput
          value={formData.phone}
          onChange={(phone) => {
            setFormData((previous) => ({ ...previous, phone }))
            setErrors((previous) => ({
              ...previous,
              phone: '',
              form: '',
            }))
          }}
          error={errors.phone}
        />
        <p className="mt-1.5 text-xs text-slate-500">
          🟢 Compatible MTN MoMo, Moov Money et Celtiis Cash
        </p>
      </div>

      {/* Type d'activité : Cartes de sélection visuelles */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-vendix-ink">
          Type d'activité commerciale
        </legend>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: 'DETAILLANT',
              title: 'Détaillant',
              desc: 'Boutique, vente...',
              icon: (
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              ),
            },
            {
              value: 'GROSSISTE',
              title: 'Grossiste',
              desc: 'Demi-gros, cartons,...',
              icon: (
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            },
          ].map((option) => {
            const selected = formData.activityType === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFormData((previous) => ({
                    ...previous,
                    activityType: option.value,
                  }))
                }}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition relative ${
                  selected
                    ? 'border-vendix-brand bg-blue-50/40 ring-2 ring-vendix-brand/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-xl ${selected ? 'bg-blue-100 text-vendix-brand' : 'bg-slate-100'}`}>
                    {option.icon}
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-vendix-brand bg-vendix-brand text-white' : 'border-slate-300'}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <span className="font-semibold text-sm text-vendix-ink">{option.title}</span>
                <span className="text-xs text-slate-500 truncate mt-0.5">{option.desc}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* E-mail facultatif */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="email" className="text-sm font-medium text-vendix-ink">
            Adresse e-mail
          </label>
          <span className="text-xs text-slate-400">Facultatif</span>
        </div>

        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="contact@maboutique.bj"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
        />

        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-vendix-ink"
        >
          Mot de passe sécurisé (min. 8 caractères)
        </label>

        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <PasswordStrengthMeter password={formData.password} />

        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {/* Acceptation obligatoire des conditions */}
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            aria-invalid={Boolean(errors.acceptTerms)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-vendix-brand"
          />
          <span>
            J’accepte les{' '}
            <span className="font-medium text-slate-900 underline">
              conditions d'utilisation
            </span>{' '}
            et la{' '}
            <span className="font-medium text-slate-900 underline">
              politique de confidentialité
            </span>{' '}
            de Vendix Bénin.
          </span>
        </label>

        {errors.acceptTerms && (
          <p className="mt-1 text-xs text-red-600">
            {errors.acceptTerms}
          </p>
        )}
      </div>

      {/* Erreur générale */}
      {errors.form && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200"
        >
          {errors.form}
        </p>
      )}

      {/* Bouton principal */}
      <button
        type="submit"
        disabled={!isFormReady || isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-vendix-brand px-4 text-sm font-bold text-white shadow-md transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        <span>
          {isSubmitting ? 'Création du compte…' : 'Créer ma boutique gratuitement'}
        </span>
        {!isSubmitting && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  )
}