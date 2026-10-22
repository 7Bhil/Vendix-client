
export default function Footer() {
  // Remplace ce numéro par le numéro WhatsApp officiel de Vendix.
  // Format international sans + ni espaces, par exemple pour le Bénin.
  const whatsappNumber = "229XXXXXXXX";

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Logo et description */}
          <div>
            <a
              href="/"
              aria-label="Vendix - Accueil"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-2xl font-extrabold text-white shadow-lg shadow-emerald-500/20">
                V
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                Vendix<span className="text-emerald-400">.</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              La solution pensée pour les commerçants qui souhaitent
              mieux gérer leurs ventes, suivre leur stock et développer
              leur activité en toute simplicité.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Grandissez avec Vendix
            </span>
          </div>

          {/* Liens utiles */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Liens utiles
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li>
                <a
                  href="/login"
                  className="transition-colors hover:text-emerald-400"
                >
                  Connexion
                </a>
              </li>

              <li>
                <a
                  href="/register"
                  className="transition-colors hover:text-emerald-400"
                >
                  Inscription
                </a>
              </li>

              <li>
                <a
                  href="/vitrines"
                  className="transition-colors hover:text-emerald-400"
                >
                  Vitrines publiques
                </a>
              </li>

              <li>
                <a
                  href="/conditions-utilisation"
                  className="transition-colors hover:text-emerald-400"
                >
                  Conditions d'utilisation
                </a>
              </li>

              <li>
                <a
                  href="/confidentialite"
                  className="transition-colors hover:text-emerald-400"
                >
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact WhatsApp */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Besoin d'assistance ?
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Une question ou besoin d'aide pour utiliser Vendix ?
              Notre équipe pourra vous accompagner via WhatsApp.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
              </svg>

              Contacter sur WhatsApp
            </a>

            <p className="mt-3 text-xs text-slate-500">
              Assistance et informations sur Vendix.
            </p>
          </div>
        </div>

        {/* Bas du pied de page */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Vendix. Tous droits réservés.
          </p>

          <a
            href="/"
            className="transition-colors hover:text-emerald-400"
          >
            Retour à l'accueil ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
