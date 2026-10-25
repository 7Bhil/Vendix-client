
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from './PasswordInput.jsx'

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      form: '',
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newErrors = {}

    if (!formData.phone.trim()) {
      newErrors.phone = 'Veuillez saisir votre numéro de téléphone.'
    } else if (!/^01\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro doit commencer par 01 et contenir 10 chiffres.'
    }

    if (!formData.password) {
      newErrors.password = 'Veuillez saisir votre mot de passe.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Identifiants de test / Démo autorisés
    const isDemoUser =
      formData.phone === '0197000001' && formData.password === 'Vendix@2026'

    if (isDemoUser) {
      // Connexion réussie : un utilisateur existant va TOUJOURS au tableau de bord, JAMAIS à l'onboarding
      navigate('/app/tableau-de-bord', {
        state: {
          user: {
            phone: formData.phone,
            shopName: 'Boutique Le Progrès',
            role: 'MERCHANT',
          },
        },
      })
      return
    }

    setErrors({
      form: 'Numéro de téléphone ou mot de passe incorrect. Pour tester : 0197000001 / Vendix@2026',
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label
          htmlFor="login-phone"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Numéro de téléphone
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
          <span className="flex items-center border-r border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
            +229
          </span>

          <input
            id="login-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="01XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'login-phone-error' : undefined}
            className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
          />
        </div>

        {errors.phone && (
          <p id="login-phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="mb-3">
        <PasswordInput
          id="login-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div className="mb-6 flex justify-end">
      <Link
  to="/recuperation-compte"
  className="text-sm font-medium text-teal-700 hover:text-teal-900"
>
  Mot de passe oublié ?
</Link>
      </div>

      {errors.form && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
      >
        Se connecter
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Vous n'avez pas encore de boutique ?{' '}
        <a
          href="/inscription"
          className="font-medium text-teal-700 hover:text-teal-900"
        >
          Créer une boutique
        </a>
      </p>
    </form>
  )
}
