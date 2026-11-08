import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import PasswordInput from './PasswordInput.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  async function handleSubmit(event) {
    event.preventDefault()

    const newErrors = {}

    const cleanPhone = formData.phone.replace(/[\s.-]/g, '')

    if (!cleanPhone) {
      newErrors.phone = 'Veuillez saisir votre numéro de téléphone.'
    } else if (!/^(01\d{8}|\d{8})$/.test(cleanPhone)) {
      newErrors.phone = 'Le numéro doit contenir 8 chiffres ou 10 chiffres (avec le 01).'
    }

    if (!formData.password) {
      newErrors.password = 'Veuillez saisir votre mot de passe.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsLoading(true)

    try {
      const { user } = await login({
        phone: formData.phone,
        password: formData.password,
      })

      const destination = location.state?.from?.pathname || '/app/dashboard'
      navigate(destination, {
        replace: true,
        state: { user },
      })
    } catch (err) {
      const errorMessage =
        err?.message ||
        'Numéro de téléphone ou mot de passe incorrect. Vérifiez vos identifiants.'

      setErrors({ form: errorMessage })
    } finally {
      setIsLoading(false)
    }
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
          to="/forgot-password"
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
        disabled={isLoading}
        className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white shadow-md transition-all duration-150 ease-in-out hover:bg-teal-800 hover:shadow-lg active:scale-[0.98] active:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Vous n'avez pas encore de boutique ?{' '}
        <Link
          to="/signup"
          className="font-medium text-teal-700 hover:text-teal-900"
        >
          Créer une boutique
        </Link>
      </p>
    </form>
  )
}
