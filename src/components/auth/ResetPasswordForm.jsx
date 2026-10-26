
import { useState } from 'react'
import PasswordInput from './PasswordInput.jsx'
import PasswordStrengthMeter from './PasswordStrengthMeter.jsx'

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

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

    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newErrors = {}

    if (formData.password.length < 8) {
      newErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword =
        'Les deux mots de passe ne correspondent pas.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setMessage(
      "La validation est réussie. La modification réelle sera disponible lorsque l'API de réinitialisation sera connectée.",
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <PasswordInput
          id="reset-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <PasswordStrengthMeter password={formData.password} />

        {errors.password && (
          <p className="mt-2 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div className="mb-6">
        <PasswordInput
          id="reset-confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <label
          htmlFor="reset-confirm-password"
          className="mt-1 block text-xs text-slate-500"
        >
          Confirmez votre nouveau mot de passe.
        </label>

        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {message && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
      >
        Réinitialiser mon mot de passe
      </button>
    </form>
  )
}
