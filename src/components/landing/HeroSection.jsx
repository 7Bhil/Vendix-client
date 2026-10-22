function HeroSection() {
  const assurances = [
    {
      icon: "✓",
      title: "100% Gratuit",
      subtitle: "au départ",
      color: "bg-green-500",
    },
    {
      icon: "⌁",
      title: "Fonctionne",
      subtitle: "hors-ligne",
      color: "bg-vendix-brand",
    },
    {
      icon: "▯",
      title: "Sur",
      subtitle: "smartphone",
      color: "bg-vendix-accent",
    },
  ];

  const produits = [
    { emoji: "💧", nom: "Eau minérale 50cl", prix: 300 },
    { emoji: "🥖", nom: "Pain", prix: 200 },
    { emoji: "🧃", nom: "Jus naturel", prix: 500 },
    { emoji: "🍟", nom: "Chips", prix: 300 },
  ];

  const total = produits.reduce((somme, produit) => somme + produit.prix, 0);

  return (
    <section className="overflow-hidden bg-vendix-whatsapp">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-10 lg:py-24">

        {/* PARTIE GAUCHE : TITRE ET ARGUMENTS */}
        <div className="relative z-10">
          {/* Petit badge d'introduction */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-vendix-brand">
            <span aria-hidden="true">🏪</span>
            La solution tout-en-un pour les commerçants
          </div>

          {/* Titre principal */}
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-vendix-ink sm:text-5xl lg:text-6xl">
            Gérez votre commerce{" "}
            <span className="text-vendix-brand">
              plus vite
            </span>{" "}
            que sur un cahier.
          </h1>

          {/* Sous-titre */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            Ventes rapides au comptoir, suivi automatique des dettes et
            boutique en ligne gratuite.
            <span className="mt-1 block font-bold text-vendix-brand">
              Même sans connexion Internet.
            </span>
          </p>

          {/* Les 3 éléments de réassurance */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {assurances.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>
                  <p className="font-bold text-vendix-ink">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton principal */}
          <div className="mt-10">
            <a
              href="/inscription"
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-vendix-brand px-7 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/20 transition duration-300 hover:-translate-y-1 hover:bg-vendix-brand-dark sm:w-auto sm:text-xl"
            >
              Commencer gratuitement
              <span className="text-2xl" aria-hidden="true">
                →
              </span>
            </a>

            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 sm:justify-start">
              <span aria-hidden="true">🔒</span>
              Pas de carte requise
            </p>
          </div>
        </div>

        {/* PARTIE DROITE : DÉMONSTRATION SUR TÉLÉPHONE */}
        <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-8">
          {/* Formes décoratives derrière le téléphone */}
          <div className="absolute h-72 w-72 rounded-full bg-blue-100 sm:h-96 sm:w-96" />

          <div className="absolute h-64 w-64 rounded-full bg-vendix-brand opacity-10 sm:h-80 sm:w-80" />

          {/* Téléphone */}
          <div className="relative z-10 w-64 rotate-2 rounded-[2.5rem] border-[7px] border-slate-800 bg-slate-800 p-2 shadow-2xl sm:w-72">
            {/* Écran */}
            <div className="overflow-hidden rounded-[1.8rem] bg-white">
              {/* Barre supérieure */}
              <div className="bg-vendix-brand px-4 pb-5 pt-4 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-lg font-extrabold">☰ Vendix</span>
                  <span aria-hidden="true">⌕</span>
                </div>

                <p className="text-base font-bold">
                  🛒 Vente au comptoir
                </p>
              </div>

              {/* Onglets */}
              <div className="flex gap-2 bg-slate-50 px-3 py-3 text-xs font-semibold">
                <span className="flex-1 rounded-full bg-vendix-brand px-3 py-2 text-center text-white">
                  Produits
                </span>
                <span className="flex-1 rounded-full bg-slate-200 px-3 py-2 text-center text-slate-600">
                  Catégories
                </span>
              </div>

              {/* Liste des produits */}
              <div className="space-y-1 px-3 py-2">
                {produits.map((produit) => (
                  <div
                    key={produit.nom}
                    className="flex items-center gap-2 border-b border-slate-100 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      {produit.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-vendix-ink">
                        {produit.nom}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {produit.prix} FCFA
                      </p>
                    </div>

                    <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-vendix-brand">
                      − 1 +
                    </div>
                  </div>
                ))}
              </div>

              {/* Total de la vente */}
              <div className="border-t border-slate-200 px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-vendix-ink">Total</span>
                  <span className="text-lg font-extrabold text-vendix-ink">
                    {total.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-vendix-brand py-3 font-bold text-white transition hover:bg-vendix-brand-dark"
                >
                  ✓ Encaisser
                </button>
              </div>

              {/* Navigation fictive de l'application mobile */}
              <div className="grid grid-cols-4 border-t border-slate-200 bg-white px-1 py-3 text-center text-[10px] text-slate-500">
                <div className="font-bold text-vendix-brand">
                  🛍️
                  <p>Vente</p>
                </div>
                <div>
                  📒
                  <p>Dettes</p>
                </div>
                <div>
                  📦
                  <p>Stock</p>
                </div>
                <div>
                  🏪
                  <p>Boutique</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de confirmation de vente */}
          <div className="absolute right-0 top-16 z-20 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-xs font-bold text-white shadow-lg sm:-right-2 sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600">
              ✓
            </span>
            Vente validée en 12s
          </div>

          {/* Petites décorations orange */}
          <div className="absolute right-5 top-5 h-7 w-2 rotate-12 rounded-full bg-vendix-accent" />
          <div className="absolute bottom-12 left-0 h-2 w-10 rotate-12 rounded-full bg-vendix-accent" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
