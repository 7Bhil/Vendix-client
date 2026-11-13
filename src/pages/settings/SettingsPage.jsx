import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eye,
  ImagePlus,
  KeyRound,
  Palette,
  Pause,
  Plus,
  Printer,
  ShieldCheck,
  Store,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const SETTINGS_KEY = "vendix_merchant_settings";
const TEAM_KEY = "vendix_merchant_vendors";
const DEFAULT_SETTINGS = {
  name: "",
  tagline: "",
  description: "",
  whatsapp: "",
  logo: "",
  primaryColor: "#15803d",
  secondaryColor: "#ca8a04",
  showViewsToPublic: true,
  receiptWidth: "80",
  receiptHeader: "",
  receiptFooter: "Les marchandises vendues ne sont ni reprises ni échangées. Merci de votre fidélité !",
};
const TABS = [
  { id: "identity", label: "Boutique", icon: Store },
  { id: "team", label: "Équipe", icon: Users },
  { id: "printing", label: "Reçus", icon: Printer },
];

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadSettings(user) {
  const saved = readJson(SETTINGS_KEY, {});
  const onboarding = readJson("vendix_store_config", {})?.store || {};
  return {
    ...DEFAULT_SETTINGS,
    name: saved.name || onboarding.shopName || user?.shopName || "",
    whatsapp: saved.whatsapp || onboarding.whatsappPhone || user?.phone || "",
    primaryColor: saved.primaryColor || onboarding.primaryColor || DEFAULT_SETTINGS.primaryColor,
    secondaryColor: saved.secondaryColor || onboarding.secondaryColor || DEFAULT_SETTINGS.secondaryColor,
    ...saved,
  };
}

function cropAndCompressLogo(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Sélectionnez un fichier image valide."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire cette image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Impossible de décoder cette image."));
      image.onload = () => {
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - side) / 2;
        const sourceY = (image.naturalHeight - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Le recadrage d’image n’est pas disponible dans ce navigateur."));
          return;
        }
        context.drawImage(image, sourceX, sourceY, side, side, 0, 0, 512, 512);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function FormField({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";
const actionClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:cursor-not-allowed disabled:opacity-50";
const primaryActionClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const logoInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [settings, setSettings] = useState(() => loadSettings(user));
  const [vendors, setVendors] = useState(() => readJson(TEAM_KEY, []));
  const [isSaving, setIsSaving] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: "", phone: "", credential: "" });

  useEffect(() => {
    document.documentElement.style.setProperty("--shop-primary", settings.primaryColor);
    document.documentElement.style.setProperty("--shop-secondary", settings.secondaryColor);
  }, [settings.primaryColor, settings.secondaryColor]);

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleLogoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      updateSetting("logo", await cropAndCompressLogo(file));
    } catch (error) {
      toast.error(error.message, "Logo non importé");
    }
  }

  function saveSettings(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast.success("Réglages enregistrés sur cet appareil.", "Paramètres sauvegardés");
    } catch {
      toast.error("Le stockage local est plein ou indisponible.", "Enregistrement impossible");
    } finally {
      setIsSaving(false);
    }
  }

  function persistVendors(nextVendors) {
    setVendors(nextVendors);
    try {
      localStorage.setItem(TEAM_KEY, JSON.stringify(nextVendors));
    } catch {
      toast.error("La liste des vendeurs n’a pas pu être enregistrée.");
    }
  }

  function addVendor(event) {
    event.preventDefault();
    const digits = vendorForm.phone.replace(/\D/g, "");
    if (![8, 10].includes(digits.length)) {
      toast.error("Le numéro doit contenir 8 ou 10 chiffres.", "Numéro invalide");
      return;
    }
    if (vendorForm.credential.trim().length < 4) {
      toast.error("Le code PIN ou mot de passe doit contenir au moins 4 caractères.", "Accès invalide");
      return;
    }

    const nextVendors = [
      {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
        name: vendorForm.name.trim(),
        phone: digits,
        role: "VENDEUR",
        status: "ACTIVE",
        addedAt: new Date().toISOString(),
      },
      ...vendors,
    ];
    persistVendors(nextVendors);
    setVendorForm({ name: "", phone: "", credential: "" });
    setIsVendorModalOpen(false);
    toast.info("Le profil vendeur est enregistré localement; aucun compte serveur n’a été créé.", "Mode local");
  }

  function toggleVendor(vendorId) {
    persistVendors(vendors.map((vendor) =>
      vendor.id === vendorId
        ? { ...vendor, status: vendor.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
        : vendor
    ));
  }

  function resetVendorAccess() {
    toast.info("La réinitialisation réelle nécessite l’API de gestion des vendeurs, absente du serveur actuel.", "Action non transmise");
  }

  function revokeVendor(vendorId) {
    if (!window.confirm("Révoquer l’accès de ce vendeur ?")) return;
    persistVendors(vendors.filter((vendor) => vendor.id !== vendorId));
  }

  const shopPreviewStyle = {
    "--shop-primary": settings.primaryColor,
    "--shop-secondary": settings.secondaryColor,
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-800">Espace commerçant</p>
            <h1 className="text-2xl font-bold text-slate-950">Paramètres</h1>
            <p className="mt-1 text-sm text-slate-600">Identité de la boutique, accès vendeurs et reçus.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
            <ShieldCheck size={15} />
            Enregistrement local, sans synchronisation serveur
          </span>
        </header>

        <div className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist" aria-label="Sections des paramètres">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`settings-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`settings-panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === id
                  ? "border-emerald-800 text-emerald-900"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "identity" && (
          <section id="settings-panel-identity" role="tabpanel" aria-labelledby="settings-tab-identity">
            <form onSubmit={saveSettings} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><Store size={18} /></div>
                    <div><h2 className="font-bold text-slate-950">Identité de la boutique</h2><p className="text-xs text-slate-500">Informations affichées sur votre vitrine.</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nom commercial">
                      <input className={inputClass} value={settings.name} onChange={(event) => updateSetting("name", event.target.value)} required maxLength={80} />
                    </FormField>
                    <FormField label="Slogan">
                      <input className={inputClass} value={settings.tagline} onChange={(event) => updateSetting("tagline", event.target.value)} maxLength={120} placeholder="Une phrase courte pour votre boutique" />
                    </FormField>
                    <div className="sm:col-span-2">
                      <FormField label="Description">
                        <textarea className={`${inputClass} min-h-24 resize-y`} value={settings.description} onChange={(event) => updateSetting("description", event.target.value)} maxLength={500} placeholder="Présentez votre activité et vos produits." />
                      </FormField>
                    </div>
                    <FormField label="WhatsApp officiel" hint="Numéro utilisé pour recevoir les commandes de la vitrine publique.">
                      <input className={inputClass} type="tel" value={settings.whatsapp} onChange={(event) => updateSetting("whatsapp", event.target.value)} placeholder="+229 97 00 00 01" />
                    </FormField>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800"><Palette size={18} /></div>
                    <div><h2 className="font-bold text-slate-950">Couleurs de la vitrine</h2><p className="text-xs text-slate-500">Les accents suivent ces couleurs après l’enregistrement.</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[ ["primaryColor", "Couleur principale"], ["secondaryColor", "Couleur secondaire"] ].map(([key, label]) => (
                      <FormField key={key} label={label}>
                        <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 py-2">
                          <input aria-label={label} type="color" value={settings[key]} onChange={(event) => updateSetting(key, event.target.value)} className="h-9 w-11 cursor-pointer border-0 bg-transparent p-0" />
                          <span className="font-mono text-sm uppercase text-slate-700">{settings[key]}</span>
                        </div>
                      </FormField>
                    ))}
                  </div>
                  <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-slate-100 pt-4">
                    <input type="checkbox" checked={settings.showViewsToPublic} onChange={(event) => updateSetting("showViewsToPublic", event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-800" />
                    <span><span className="block text-sm font-semibold text-slate-800">Rendre visible le compteur de vues de mes produits aux visiteurs</span><span className="mt-0.5 block text-xs text-slate-500">La vitrine publique applique ce réglage lorsqu’elle le reçoit depuis le serveur.</span></span>
                  </label>
                </section>

                <div className="flex justify-end">
                  <button type="submit" className={primaryActionClass} disabled={isSaving}><Check size={16} />{isSaving ? "Enregistrement…" : "Enregistrer l’identité"}</button>
                </div>
              </div>

              <aside className="space-y-4">
                <section className="rounded-lg border border-slate-200 bg-white p-5">
                  <h2 className="font-bold text-slate-950">Logo de la boutique</h2>
                  <p className="mt-1 text-xs text-slate-500">Image recadrée au carré et compressée avant aperçu.</p>
                  <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="sr-only" aria-label="Importer le logo de la boutique" />
                  <div className="mt-4 flex aspect-square max-h-56 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                    {settings.logo ? <img src={settings.logo} alt="Aperçu du logo" className="h-full w-full object-cover" /> : <div className="text-center text-slate-400"><ImagePlus className="mx-auto" size={28} /><span className="mt-2 block text-xs">Aucun logo</span></div>}
                  </div>
                  <button type="button" className={`${actionClass} mt-3 w-full`} onClick={() => logoInputRef.current?.click()}><ImagePlus size={16} />{settings.logo ? "Remplacer le logo" : "Choisir une image"}</button>
                  {settings.logo && <button type="button" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50" onClick={() => updateSetting("logo", "")}><Trash2 size={15} />Supprimer le logo</button>}
                </section>

                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white" style={shopPreviewStyle}>
                  <div className="h-2" style={{ backgroundColor: "var(--shop-secondary)" }} />
                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Aperçu vitrine</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-500">
                        {settings.logo ? <img src={settings.logo} alt="" className="h-full w-full object-cover" /> : <Store size={21} />}
                      </div>
                      <div className="min-w-0"><p className="truncate font-bold text-slate-950">{settings.name || "Nom de la boutique"}</p><p className="truncate text-xs text-slate-500">{settings.tagline || "Votre slogan"}</p></div>
                    </div>
                    <p className="mt-3 line-clamp-3 min-h-10 text-xs leading-5 text-slate-600">{settings.description || "La description de votre activité apparaîtra ici."}</p>
                    <button type="button" className="mt-4 w-full rounded-lg px-3 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: "var(--shop-primary)" }}><Eye size={15} className="mr-2 inline" />Voir la boutique</button>
                  </div>
                </section>
              </aside>
            </form>
          </section>
        )}

        {activeTab === "team" && (
          <section id="settings-panel-team" role="tabpanel" aria-labelledby="settings-tab-team" className="rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div><h2 className="font-bold text-slate-950">Vendeurs</h2><p className="mt-1 text-sm text-slate-500">Accès limité à la caisse et au stock sur cette interface.</p></div>
              <button type="button" className={primaryActionClass} onClick={() => setIsVendorModalOpen(true)}><Plus size={16} />Ajouter un vendeur</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-3 font-semibold">Vendeur</th><th className="px-6 py-3 font-semibold">Téléphone</th><th className="px-6 py-3 font-semibold">Statut</th><th className="px-6 py-3 font-semibold">Ajouté le</th><th className="px-6 py-3 text-right font-semibold">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.length === 0 ? <tr><td colSpan="5" className="px-6 py-12 text-center"><Users size={24} className="mx-auto text-slate-300" /><p className="mt-2 font-semibold text-slate-700">Aucun vendeur ajouté</p><p className="mt-1 text-xs text-slate-500">Ajoutez un vendeur pour préparer son accès à la caisse.</p></td></tr> : vendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{vendor.name}</td>
                      <td className="px-6 py-4 text-slate-600">{vendor.phone}</td>
                      <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${vendor.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{vendor.status === "ACTIVE" ? "Actif" : "Bloqué"}</span></td>
                      <td className="px-6 py-4 text-slate-600">{new Date(vendor.addedAt).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-1">
                        <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Réinitialiser l’accès" aria-label={`Réinitialiser l’accès de ${vendor.name}`} onClick={resetVendorAccess}><KeyRound size={16} /></button>
                        <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-800" title={vendor.status === "ACTIVE" ? "Bloquer" : "Réactiver"} aria-label={`${vendor.status === "ACTIVE" ? "Bloquer" : "Réactiver"} ${vendor.name}`} onClick={() => toggleVendor(vendor.id)}><Pause size={16} /></button>
                        <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" title="Révoquer l’accès" aria-label={`Révoquer ${vendor.name}`} onClick={() => revokeVendor(vendor.id)}><Trash2 size={16} /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><ShieldCheck size={16} className="mt-0.5 shrink-0" /><p>Les rôles visibles ici ne remplacent pas une autorisation serveur. La création et la réinitialisation des comptes nécessitent une API d’équipe qui n’est pas présente dans le serveur actuel.</p></div>
          </section>
        )}

        {activeTab === "printing" && (
          <form onSubmit={saveSettings} id="settings-panel-printing" role="tabpanel" aria-labelledby="settings-tab-printing" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Printer size={18} /></div><div><h2 className="font-bold text-slate-950">Format et contenu du reçu</h2><p className="text-xs text-slate-500">Définissez la largeur et les messages imprimés.</p></div></div>
              <fieldset>
                <legend className="text-sm font-semibold text-slate-800">Largeur thermique par défaut</legend>
                <div className="mt-2 flex gap-3">
                  {["58", "80"].map((width) => <label key={width} className={`flex min-w-28 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${settings.receiptWidth === width ? "border-emerald-800 bg-emerald-50 text-emerald-950" : "border-slate-300 text-slate-700"}`}><input type="radio" name="receipt-width" value={width} checked={settings.receiptWidth === width} onChange={() => updateSetting("receiptWidth", width)} className="accent-emerald-800" />{width} mm</label>)}
                </div>
              </fieldset>
              <div className="mt-5 space-y-4">
                <FormField label="En-tête du ticket" hint="Facultatif, affiché sous le nom de la boutique."><textarea className={`${inputClass} min-h-20 resize-y`} value={settings.receiptHeader} onChange={(event) => updateSetting("receiptHeader", event.target.value)} maxLength={240} placeholder="Merci pour votre achat" /></FormField>
                <FormField label="Pied de page"><textarea className={`${inputClass} min-h-24 resize-y`} value={settings.receiptFooter} onChange={(event) => updateSetting("receiptFooter", event.target.value)} maxLength={300} /></FormField>
              </div>
              <div className="mt-6 flex justify-end"><button type="submit" className={primaryActionClass}><Check size={16} />Enregistrer les reçus</button></div>
            </section>
            <aside className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-950">Aperçu du ticket</h2><span className="text-xs font-medium text-slate-500">{settings.receiptWidth} mm</span></div>
              <div className="mx-auto border border-dashed border-slate-300 bg-white p-4 font-mono text-[11px] leading-relaxed text-slate-700" style={{ width: settings.receiptWidth === "58" ? "100%" : "100%", maxWidth: settings.receiptWidth === "58" ? 220 : 280 }}>
                <p className="text-center font-bold">{settings.name || "MA BOUTIQUE"}</p>
                {settings.receiptHeader && <p className="mt-2 text-center">{settings.receiptHeader}</p>}
                <div className="my-3 border-t border-dashed border-slate-400" /><p>Article exemple ........ 1 500 F</p><div className="my-2 border-t border-dashed border-slate-400" /><p className="text-right font-bold">TOTAL ........ 1 500 F</p>
                {settings.receiptFooter && <p className="mt-4 text-center">{settings.receiptFooter}</p>}
              </div>
            </aside>
          </form>
        )}
      </div>

      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsVendorModalOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-vendor-title" className="w-full max-w-lg rounded-t-xl bg-white p-5 shadow-2xl sm:rounded-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between"><div><h2 id="add-vendor-title" className="text-lg font-bold text-slate-950">Ajouter un vendeur</h2><p className="mt-1 text-sm text-slate-500">Le code saisi ne sera pas conservé dans le navigateur.</p></div><button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Fermer" onClick={() => setIsVendorModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={addVendor} className="space-y-4">
              <FormField label="Nom complet"><input className={inputClass} value={vendorForm.name} onChange={(event) => setVendorForm((form) => ({ ...form, name: event.target.value }))} autoComplete="name" maxLength={100} required /></FormField>
              <FormField label="Téléphone" hint="Saisissez un numéro de 8 ou 10 chiffres."><input className={inputClass} type="tel" inputMode="numeric" value={vendorForm.phone} onChange={(event) => setVendorForm((form) => ({ ...form, phone: event.target.value }))} autoComplete="tel" required /></FormField>
              <FormField label="Code PIN ou mot de passe temporaire" hint="Minimum 4 caractères. Utilisé uniquement dans ce formulaire."><input className={inputClass} type="password" value={vendorForm.credential} onChange={(event) => setVendorForm((form) => ({ ...form, credential: event.target.value }))} autoComplete="new-password" minLength={4} required /></FormField>
              <div className="rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600"><p className="font-semibold text-slate-800">Rôle prévu : VENDEUR</p><p>Accès caisse et stock uniquement. Les bilans, marges et paramètres doivent aussi être protégés par le serveur.</p></div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" className={actionClass} onClick={() => setIsVendorModalOpen(false)}><X size={15} />Annuler</button><button type="submit" className={primaryActionClass}><Plus size={16} />Ajouter</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
