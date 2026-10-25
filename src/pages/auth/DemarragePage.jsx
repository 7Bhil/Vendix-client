
import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

const COLOR_OPTIONS = [
  { name: 'Bleu Vendix', value: '#1e40af' },
  { name: 'Vert', value: '#15803d' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Noir', value: '#0f172a' },
  { name: 'Rose', value: '#db2777' },
  { name: 'Orange', value: '#ea580c' },
]

const STEPS = [
  'Personnalisation',
  'Logo',
  'Premier produit',
]

export default function DemarragePage() {
  const location = useLocation()
  const user = location.state?.user

  const [step, setStep] = useState(0)
  const [primaryColor, setPrimaryColor] = useState('#1e40af')
  const [secondaryColor, setSecondaryColor] = useState('#15803d')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview('')
      return
    }

    const previewUrl = URL.createObjectURL(logoFile)
    setLogoPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [logoFile])

  function updateProduct(event) {
    const { name, value } = event.target

    setProduct((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function nextStep() {
    setMessage('')
    setStep((previous) => Math.min(previous + 1, STEPS.length - 1))
  }

  function previousStep() {
    setMessage('')
    setStep((previous) => Math.max(previous - 1, 0))
  }

  function finishOnboarding(event) {
    event.preventDefault()

    if (!product.name.trim()) {
      setMessage('Saisissez le nom de votre premier produit.')
      return
    }

    const price = Number(product.price)

    if (!product.price || !Number.isFinite(price) || price <= 0) {
      setMessage('Saisissez un prix valide supérieur à zéro.')
      return
    }

    setMessage(
      'Votre configuration est prête sur cette page. ' +
      'L’enregistrement définitif sera ajouté lorsque ' +
      'l’intégration avec le serveur sera disponible.'
    )
  }

  return (
    <main className="min-h-screen bg-vendix-surface px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <Link to="/connexion" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vendix-brand text-xl font-bold text-white">
              V
            </span>
            <span className="text-xl font-bold text-vendix-ink">
              Vendix
            </span>
          </Link>

          <span className="text-sm text-slate-500">
            Configuration de la boutique
          </span>
        </header>

        <section className="mb-6">
          <p className="text-sm font-semibold text-vendix-brand">
            ÉTAPE {step + 1} SUR {STEPS.length}
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-vendix-ink sm:text-3xl">
            {step === 0 && 'Personnalisez votre boutique'}
            {step === 1 && 'Ajoutez votre logo'}
            {step === 2 && 'Ajoutez votre premier produit'}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {user?.shopName
              ? `Préparons ensemble ${user.shopName}.`
              : 'Quelques étapes pour préparer votre boutique.'}
          </p>
        </section>

        <nav
          aria-label="Progression de la configuration"
          className="mb-8 grid grid-cols-3 gap-2"
        >
          {STEPS.map((label, index) => (
            <div key={label}>
              <div
                className={`h-1.5 rounded-full ${
                  index <= step ? 'bg-vendix-brand' : 'bg-slate-200'
                }`}
              />
              <p
                className={`mt-2 text-xs ${
                  index === step
                    ? 'font-semibold text-vendix-brand'
                    : 'text-slate-500'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-vendix-ink">
                  Couleur principale
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Elle sera utilisée pour les éléments importants.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={`primary-${color.value}`}
                      type="button"
                      aria-pressed={primaryColor === color.value}
                      onClick={() => setPrimaryColor(color.value)}
                      className={`flex min-h-12 items-center gap-2 rounded-xl border p-3 text-left text-sm ${
                        primaryColor === color.value
                          ? 'border-vendix-brand ring-2 ring-blue-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-vendix-ink">
                  Couleur secondaire
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choisissez une couleur complémentaire.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={`secondary-${color.value}`}
                      type="button"
                      aria-pressed={secondaryColor === color.value}
                      onClick={() => setSecondaryColor(color.value)}
                      className={`flex min-h-12 items-center gap-2 rounded-xl border p-3 text-left text-sm ${
                        secondaryColor === color.value
                          ? 'border-vendix-brand ring-2 ring-blue-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-sm font-medium text-slate-600">
                  Aperçu de votre boutique
                </p>
                <div
                  className="rounded-lg p-4 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <p className="font-bold">
                    {user?.shopName || 'Ma boutique'}
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Bienvenue dans notre boutique !
                  </p>
                  <span
                    className="mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    Découvrir nos produits
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-semibold text-vendix-ink">
                  Le logo de votre commerce
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Sélectionnez une image depuis votre appareil.
                  Vous pourrez la modifier plus tard.
                </p>
              </div>

              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-5 text-center transition hover:border-vendix-brand">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Aperçu du logo sélectionné"
                    className="h-28 max-w-full object-contain"
                  />
                ) : (
                  <>
                    <span className="text-3xl" aria-hidden="true">
                      +
                    </span>
                    <span className="mt-2 text-sm font-semibold text-vendix-ink">
                      Choisir une image
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      PNG, JPG ou WebP
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]

                    if (!file) return

                    if (!file.type.startsWith('image/')) {
                      setMessage('Sélectionnez un fichier image valide.')
                      return
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      setMessage('L’image doit peser au maximum 5 Mo.')
                      return
                    }

                    setMessage('')
                    setLogoFile(file)
                  }}
                />
              </label>

              {logoFile && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null)
                    setMessage('')
                  }}
                  className="min-h-12 text-sm font-medium text-red-600"
                >
                  Retirer le logo
                </button>
              )}

              <p className="text-xs leading-5 text-slate-500">
                Pour le moment, le logo est seulement prévisualisé dans
                cette page. Il n’est pas encore envoyé sur un serveur.
              </p>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={finishOnboarding} className="space-y-5">
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-1.5 block text-sm font-medium text-vendix-ink"
                >
                  Nom du produit
                </label>
                <input
                  id="product-name"
                  name="name"
                  value={product.name}
                  onChange={updateProduct}
                  placeholder="Ex. Sac à main"
                  maxLength={100}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-price"
                  className="mb-1.5 block text-sm font-medium text-vendix-ink"
                >
                  Prix de vente (FCFA)
                </label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={product.price}
                  onChange={updateProduct}
                  placeholder="Ex. 5000"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="mb-1.5 block text-sm font-medium text-vendix-ink"
                >
                  Description (facultative)
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={product.description}
                  onChange={updateProduct}
                  placeholder="Décrivez brièvement votre produit..."
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-vendix-ink">
                  Récapitulatif
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Boutique : {user?.shopName || 'Ma boutique'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Couleurs : {primaryColor} et {secondaryColor}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Logo : {logoFile ? logoFile.name : 'Aucun logo sélectionné'}
                </p>
              </div>

              {message && (
                <p
                  role="status"
                  className="rounded-xl bg-blue-50 p-3 text-sm leading-5 text-blue-800"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="min-h-12 w-full rounded-xl bg-vendix-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-vendix-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
              >
                Terminer la configuration
              </button>
            </form>
          )}

          {message && step !== 2 && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {message}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0}
              className="min-h-12 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Retour
            </button>

            {step < STEPS.length - 1 && (
              <button
                type="button"
                onClick={nextStep}
                className="min-h-12 flex-1 rounded-xl bg-vendix-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-vendix-brand-dark"
              >
                Continuer
              </button>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          Vous pourrez compléter votre boutique plus tard.
        </p>
      </div>
    </main>
  )
}
