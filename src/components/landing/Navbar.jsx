import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Constat terrain", href: "#problemes" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Vitrine", href: "#vitrine" },
    { label: "FAQ", href: "#faq" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo Vendix sobre */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-vendix-ink flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vendix-brand text-sm font-bold text-white shadow-sm">
            V
          </span>
          <span className="text-xl font-extrabold tracking-tight text-vendix-ink">
            Vendix<span className="text-vendix-brand">.</span>
          </span>
        </Link>

        {/* Navigation desktop sobre */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-slate-600 transition hover:text-vendix-brand"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions d'accès */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            Connexion
          </Link>

          <Link
            to="/signup"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-vendix-brand px-4 text-xs font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark"
          >
            <span>Créer ma boutique</span>
            <ArrowRight size={14} />
          </Link>

          {/* Bouton burger mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Connexion Commerçant
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
