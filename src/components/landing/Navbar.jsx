import { useState } from "react";

function Navbar() {
  // Permet d'ouvrir et de fermer le menu sur téléphone
  const [menuOpen, setMenuOpen] = useState(false);

  // Liens de navigation vers les différentes sections de la page
  const navLinks = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Témoignages", href: "#temoignages" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo Vendix */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight text-vendix-brand"
          aria-label="Vendix - Accueil"
        >
          Vendix<span className="text-vendix-accent">.</span>
        </a>

        {/* Liens de navigation sur ordinateur */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-vendix-ink transition-colors hover:text-vendix-brand"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Boutons et menu mobile */}
        <div className="flex items-center gap-3">
          {/* Bouton Connexion */}
          <a
            href="/connexion"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-vendix-ink transition-colors hover:bg-slate-100 sm:inline-flex"
          >
            Connexion
          </a>

          {/* Bouton principal */}
          <a
            href="/inscription"
            className="hidden rounded-lg bg-vendix-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vendix-brand-dark sm:inline-flex"
          >
            Créer ma boutique
          </a>

          {/* Bouton d'ouverture du menu sur téléphone */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-vendix-ink hover:bg-slate-100 md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              // Icône de fermeture
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              // Icône du menu
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menu déroulant sur téléphone */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-vendix-ink hover:text-vendix-brand"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/connexion"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-center text-sm font-semibold text-vendix-ink hover:bg-slate-100"
            >
              Connexion
            </a>

            <a
              href="/inscription"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-vendix-brand px-4 py-3 text-center text-sm font-semibold text-white hover:bg-vendix-brand-dark"
            >
              Créer ma boutique
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
