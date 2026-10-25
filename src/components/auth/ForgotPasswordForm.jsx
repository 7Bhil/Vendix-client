
import { useState } from 'react'
import { Link } from 'react-router-dom'

const SUPPORT_WHATSAPP_NUMBER = '2290144242964'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const whatsappMessage =
    'Bonjour, je souhaite récupérer mon compte vendeur Vendix. ' +
    'Je n’ai pas renseigné d’adresse e-mail lors de mon inscription. ' +
    'Pouvez-vous m’indiquer la procédure de vérification de mon identité ?'

  const whatsappLink =
    `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const normalizedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!normalizedEmail) {
      setError('Veuillez saisir votre adresse e-mail.')
      return
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError('Veuillez saisir une adresse e-mail valide.')
      return
    }

    setMessage(
      'Votre adresse e-mail est valide. L’envoi du lien de réinitialisation ' +
      'sera disponible lorsque le service de récupération sera connecté.'
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-vendix-ink">
          Vous avez renseigné un e-mail ?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Saisissez l’adresse e-mail associée à votre boutique pour
          demander un lien de réinitialisation de votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="recovery-email"
            className="mb-2 block text-sm font-medium text-vendix-ink"
          >
            Adresse e-mail
          </label>

          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
              setMessage('')
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'recovery-email-error' : undefined}
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-vendix-ink outline-none transition focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
          />

          {error && (
            <p
              id="recovery-email-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-vendix-brand px-4 py-3 font-semibold text-white transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
        >
          Demander un lien de réinitialisation
        </button>

        {message && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-5 text-blue-800"
          >
            {message}
          </p>
        )}
      </form>

      <div className="border-t border-slate-200 pt-5">
        <h2 className="font-semibold text-vendix-ink">
          Vous n’avez pas renseigné d’e-mail ?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Contactez l’assistance Vendix sur WhatsApp. Un membre de
          l’équipe pourra vous guider dans la vérification de votre identité.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border border-green-600 px-4 py-3 text-center font-semibold text-green-700 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          Contacter l’assistance sur WhatsApp
        </a>
      </div>

      <p className="text-center text-sm text-slate-600">
        Vous vous souvenez de votre mot de passe ?{' '}
        <Link
          to="/connexion"
          className="font-medium text-vendix-brand hover:text-vendix-brand-dark"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
