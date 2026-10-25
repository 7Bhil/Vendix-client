
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  // Ouvrir et fermer le menu sur téléphone
  const [menuOpen, setMenuOpen] = useState(false);

  // Liens vers les sections de la page d'accueil
  const navLinks = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Témoignages", href: "#temoignages" },
  ];

  // Fermer le menu mobile après un clic sur un lien
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo Vendix */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight text-vendix-brand"
          aria-label="Vendix - Accueil"
          onClick={closeMenu}
        >
          Vendix<span className="text-vendix-accent">.</span>
        </a>

        {/* Navigation sur ordinateur */}
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

        {/* Actions et bouton du menu mobile */}
        <div className="flex items-center gap-3">
          <a
            href="/connexion"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-vendix-ink transition-colors hover:bg-slate-100 sm:inline-flex"
          >
            Connexion
          </a>

          <a
            href="/inscription"
            className="hidden rounded-lg bg-vendix-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vendix-brand-dark sm:inline-flex"
          >
            Créer ma boutique
          </a>

          {/* Bouton du menu mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-vendix-ink transition-colors hover:bg-slate-100 md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Navigation sur téléphone */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-sm font-medium text-vendix-ink transition-colors hover:text-vendix-brand"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/connexion"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-center text-sm font-semibold text-vendix-ink transition-colors hover:bg-slate-100"
            >
              Connexion
            </a>

            <a
              href="/inscription"
              onClick={closeMenu}
              className="rounded-lg bg-vendix-brand px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-vendix-brand-dark"
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
