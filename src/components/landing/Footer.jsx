import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          
          {/* Identité Vendix */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vendix-brand text-sm font-bold text-white">
                V
              </span>
              <span>Vendix</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Plateforme de gestion commerciale tout-en-un pour les commerçants de marchandises physiques en Afrique de l'Ouest. Conçue pour simplifier la caisse, le stock, les dettes clients et la vitrine en ligne.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Données chiffrées & conformité RGPD</span>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#problemes" className="hover:text-white transition">
                  Le constat terrain
                </a>
              </li>
              <li>
                <a href="#comment-ca-marche" className="hover:text-white transition">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#vitrine" className="hover:text-white transition">
                  Vitrine en ligne
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Foire aux questions
                </a>
              </li>
            </ul>
          </div>

          {/* Espace & Accès */}
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Accès
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/connexion" className="hover:text-white transition">
                  Connexion Commerçant
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="hover:text-white transition">
                  Créer ma boutique
                </Link>
              </li>
              <li>
                <Link to="/recuperation-compte" className="hover:text-white transition">
                  Récupération de compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Assistance
            </p>
            <div className="mt-4">
              <a
                href="https://wa.me/22900000000?text=Bonjour%20Vendix%2C%20j%27ai%20besoin%20d%27assistance"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition"
              >
                <MessageCircle size={15} />
                <span>Support WhatsApp</span>
              </a>
              <p className="mt-2 text-[11px] text-slate-400">
                Réponse directe aux commerçants partenaires.
              </p>
            </div>
          </div>

        </div>

        {/* Ligne légale sobre */}
        <div className="mt-12 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {currentYear} Vendix Bénin. Tous droits réservés.</p>
          <div className="flex gap-4">
            <span>Marché initial : Bénin</span>
            <span>•</span>
            <span>Version MVP 1.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
