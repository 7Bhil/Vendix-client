import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  CheckCircle2,
  WifiOff,
  Smartphone,
  MessageCircle,
  Plus,
  Minus,
  Store,
  ShoppingBag,
  Bell,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
  Receipt,
} from "lucide-react";

const DEMO_ITEMS = [
  { id: "p1", name: "Riz Parfumé 25kg", unit: "Sac", price: 14500, qty: 1, tag: "Alimentaire" },
  { id: "p2", name: "Huile Végétale 5L", unit: "Bidon", price: 6500, qty: 2, tag: "Épicerie" },
  { id: "p3", name: "Savon de Marseille", unit: "Carton", price: 4200, qty: 1, tag: "Entretien" },
];

const formatFCFA = (amount) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)} FCFA`;

export default function HeroSection() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const interactiveInputRef = useRef(null);
  const highlightsRef = useRef(null);
  const phoneWrapperRef = useRef(null);
  const floatingNotifRef = useRef(null);
  const floatingOfflineRef = useRef(null);
  const floatingStatsRef = useRef(null);

  const [shopNameInput, setShopNameInput] = useState("");
  const [activeTab, setActiveTab] = useState("pos"); // 'pos' | 'shop'
  const [items, setItems] = useState(DEMO_ITEMS);
  const [isCashCompleted, setIsCashCompleted] = useState(false);

  // Génération dynamique du slug en direct comme sur selo.ci
  const cleanSlug = shopNameInput
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const displaySlug = cleanSlug || "ma-boutique";

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const targetUrl = shopNameInput.trim()
      ? `/signup?storeName=${encodeURIComponent(shopNameInput.trim())}`
      : "/signup";
    navigate(targetUrl);
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    );
  };

  const totalAmount = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Animations GSAP fluides d'entrée
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(headlineRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.45"
        )
        .from(
          interactiveInputRef.current,
          {
            y: 18,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          highlightsRef.current?.children || [],
          {
            y: 14,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.25"
        )
        .from(
          phoneWrapperRef.current,
          {
            y: 40,
            opacity: 0,
            scale: 0.94,
            duration: 0.9,
            ease: "back.out(1.2)",
          },
          "-=0.6"
        )
        .from(
          [floatingNotifRef.current, floatingOfflineRef.current, floatingStatsRef.current],
          {
            y: 20,
            opacity: 0,
            scale: 0.85,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        );

      // Micro-animation flottante continue pour le téléphone
      gsap.to(phoneWrapperRef.current, {
        y: -10,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Flottement subtil des badges
      gsap.to(floatingNotifRef.current, {
        y: -6,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.2,
      });

      gsap.to(floatingOfflineRef.current, {
        y: 8,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-8 pb-16 lg:pt-14 lg:pb-24"
    >
      {/* Motifs de fond techniques & élégants */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Colonne gauche : Promesse, Générateur d'URL instantané et Bénéfices */}
          <div className="lg:col-span-7 lg:pr-4">
            {/* Tag Marchand Cotonou / Afrique de l'Ouest */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>La solution des grossistes et commerçants d&apos;Afrique de l&apos;Ouest</span>
            </div>

            {/* H1 percutant et lisible */}
            <h1
              ref={headlineRef}
              className="mt-5 text-3xl font-extrabold tracking-tight text-vendix-ink sm:text-5xl lg:text-[3.25rem] sm:leading-[1.12]"
            >
              Fini le cahier. Encaisser, gérer et vendre sur WhatsApp{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                en 10 secondes.
              </span>
            </h1>

            {/* Sous-titre rassurant */}
            <p
              ref={subtitleRef}
              className="mt-4 text-base text-slate-600 sm:text-lg max-w-2xl leading-relaxed"
            >
              Vendix combine une <strong>caisse mobile ultra-rapide</strong> fonctionnant même en
              coupure réseau, un suivi strict des crédits clients et votre{" "}
              <strong>vitrine en ligne interactive</strong> créée instantanément.
            </p>

            {/* Expérience Interactive : Créateur de boutique en direct (style Selo moderne) */}
            <div
              ref={interactiveInputRef}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 transition hover:border-slate-300"
            >
              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <label
                  htmlFor="shopNameInput"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Lancez votre boutique en 2 minutes :
                </label>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Store size={18} />
                    </div>
                    <input
                      id="shopNameInput"
                      type="text"
                      value={shopNameInput}
                      onChange={(e) => setShopNameInput(e.target.value)}
                      placeholder="Ex: Épicerie Dantokpa, Mode Élégance..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-600 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-vendix-brand-dark active:scale-[0.98]"
                  >
                    <span>Créer ma boutique</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Prévisualisation dynamique du lien Web */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                  <span>Votre adresse web immédiate :</span>
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 truncate max-w-[280px]">
                    vendix.app/boutique/{displaySlug}
                  </span>
                </div>
              </form>
            </div>

            {/* Réassurance & Arguments clés */}
            <div
              ref={highlightsRef}
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-slate-200/80"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={16} />
                </div>
                <span>100% Gratuit pour débuter</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <WifiOff size={16} />
                </div>
                <span>Ventes hors-ligne garanties</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Smartphone size={16} />
                </div>
                <span>Zéro ordinateur requis</span>
              </div>
            </div>
          </div>

          {/* Colonne droite : Smartphone 3D Réaliste & Démonstrateur Interactif */}
          <div className="relative lg:col-span-5 flex justify-center">
            {/* Badge flottant 1 : Vente en direct (WhatsApp) */}
            <div
              ref={floatingNotifRef}
              className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm">
                <MessageCircle size={20} />
              </div>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold text-slate-500">Commande WhatsApp</p>
                <p className="text-xs font-bold text-slate-900">+27 500 FCFA reçus</p>
              </div>
            </div>

            {/* Badge flottant 2 : Mode Hors-ligne Actif */}
            <div
              ref={floatingOfflineRef}
              className="absolute -bottom-6 -left-6 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border border-blue-200 bg-blue-50/95 px-3.5 py-2.5 shadow-md backdrop-blur-md"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping" />
              <div className="text-left text-xs">
                <p className="font-bold text-blue-900">Mode Hors-ligne Actif</p>
                <p className="text-[11px] text-blue-700">3 ventes enregistrées sans réseau</p>
              </div>
            </div>

            {/* Châssis de Smartphone Haute Définition */}
            <div
              ref={phoneWrapperRef}
              className="relative w-full max-w-[340px] rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-slate-800"
            >
              {/* Dynamic Island / Encoche caméra */}
              <div className="absolute top-2.5 left-1/2 z-30 h-4 w-28 -translate-x-1/2 rounded-full bg-black flex items-center justify-end pr-2">
                <span className="h-2 w-2 rounded-full bg-slate-800" />
              </div>

              {/* Écran tactile du smartphone */}
              <div className="relative overflow-hidden rounded-[34px] bg-white min-h-[560px] flex flex-col">
                {/* Barre d'état mobile */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-bold text-slate-800">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5">
                    <WifiOff size={12} className="text-emerald-700" />
                    <span>4G</span>
                    <div className="h-2.5 w-5 rounded border border-slate-700 p-0.5">
                      <div className="h-full w-full rounded-sm bg-slate-800" />
                    </div>
                  </div>
                </div>

                {/* En-tête de l'application dans l'écran */}
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-vendix-brand text-xs font-black text-white shadow-sm">
                        {displaySlug.charAt(0).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                          {shopNameInput.trim() || "Épicerie du Port"}
                        </p>
                        <p className="text-[10px] text-slate-500">Cotonou, Bénin</p>
                      </div>
                    </div>

                    {/* Switcher Caisse / Vitrine */}
                    <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setActiveTab("pos")}
                        className={`rounded-md px-2 py-1 transition ${
                          activeTab === "pos"
                            ? "bg-vendix-brand text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Caisse
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("shop")}
                        className={`rounded-md px-2 py-1 transition ${
                          activeTab === "shop"
                            ? "bg-vendix-brand text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Vitrine
                      </button>
                    </div>
                  </div>
                </div>

                {/* Corps de l'écran : Caisse Interactive ou Vitrine Web */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  {activeTab === "pos" ? (
                    <>
                      {/* Message informatif caisse */}
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-[11px]">
                        <span className="font-semibold text-slate-700">Client au comptoir</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          En direct
                        </span>
                      </div>

                      {/* Liste des articles en caisse */}
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-xs"
                          >
                            <div className="pr-1">
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {formatFCFA(item.price)} / {item.unit}
                              </p>
                            </div>

                            {/* Contrôle interactif quantité */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center text-xs font-bold text-slate-900">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Encaissement bas de caisse */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-slate-500">
                            Total à payer
                          </span>
                          <span className="text-base font-extrabold text-slate-900">
                            {formatFCFA(totalAmount)}
                          </span>
                        </div>

                        {isCashCompleted ? (
                          <div className="mt-2.5 rounded-xl bg-emerald-600 p-2.5 text-center text-white text-xs font-bold animate-fade-in">
                            ✓ Vente enregistrée & ticket généré !
                          </div>
                        ) : (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCashCompleted(true);
                                setTimeout(() => setIsCashCompleted(false), 2500);
                              }}
                              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-vendix-brand text-[11px] font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark"
                            >
                              <Receipt size={13} />
                              <span>Espèces</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsCashCompleted(true);
                                setTimeout(() => setIsCashCompleted(false), 2500);
                              }}
                              className="flex h-9 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-800 transition hover:bg-amber-100"
                            >
                              Noter à crédit
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Vue Vitrine Web en ligne */}
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-center">
                        <p className="text-[11px] font-bold text-emerald-900">
                          Vitrine Publique en Ligne
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          Accessible par vos clients sur WhatsApp
                        </p>
                      </div>

                      <div className="space-y-2">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5"
                          >
                            <div>
                              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {it.tag}
                              </span>
                              <p className="text-xs font-bold text-slate-900 mt-1">{it.name}</p>
                              <p className="text-[11px] font-extrabold text-emerald-700">
                                {formatFCFA(it.price)}
                              </p>
                            </div>

                            <a
                              href={`https://wa.me/?text=Bonjour,%20je%20veux%20commander%20${encodeURIComponent(it.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl bg-green-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-xs"
                            >
                              <MessageCircle size={12} />
                              <span>Commander</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Barre de navigation basse dans le smartphone */}
                <div className="border-t border-slate-100 bg-white py-2 px-6 flex items-center justify-around text-slate-400">
                  <span className="flex flex-col items-center text-emerald-700 font-bold text-[9px]">
                    <ShoppingBag size={16} />
                    Caisse
                  </span>
                  <span className="flex flex-col items-center text-[9px]">
                    <Store size={16} />
                    Vitrine
                  </span>
                  <span className="flex flex-col items-center text-[9px]">
                    <TrendingUp size={16} />
                    Bénéfices
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
