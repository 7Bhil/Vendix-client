
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="w-full bg-vendix-whatsapp px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl text-center">
        {/* Message principal */}
        <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          Prêt à faire grandir votre commerce dès aujourd'hui ?
        </h2>

        {/* Promesse de Vendix */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-vendix-ink sm:text-lg">
          Développez vos ventes, gérez mieux votre commerce et améliorez
          votre rentabilité grâce à Vendix. Créez votre boutique
          gratuitement et commencez à développer votre activité dès aujourd'hui.
        </p>

        {/* Bouton contrasté */}
        <a
          href="/register"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-vendix-accent px-8 py-4 text-base font-bold text-vendix-ink shadow-lg transition duration-300 hover:-translate-y-1 hover:brightness-95 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-200"
        >
          Créer ma boutique maintenant
          <ArrowRight size={21} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
