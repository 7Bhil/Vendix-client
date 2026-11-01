import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  PackagePlus,
  Loader2,
  Eye,
  EyeOff,
  Star,
  Plus,
  AlertTriangle,
  ChevronDown,
  Layers,
  Scale,
} from 'lucide-react';
import productsData from '../../mocks/modules/products.json';
import ProductImageUpload from '../../components/products/ProductImageUpload.jsx';
import PriceTierManager from '../../components/products/PriceTierManager.jsx';
import UnitConversionField from '../../components/products/UnitConversionField.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function NewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  // Catégories dynamiques
  const [categories, setCategories] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem('vendix-custom-categories') || '[]'
    );
    const existingIds = new Set(saved.map((c) => c.id));
    const mockCategories = productsData.categories.filter(
      (c) => !existingIds.has(c.id)
    );
    return [...saved, ...mockCategories];
  });

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // États du formulaire
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [baseUnit, setBaseUnit] = useState('Unité');
  const [isVisible, setIsVisible] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Options avancées (pliables)
  const [priceTiers, setPriceTiers] = useState([]);
  const [unitConversions, setUnitConversions] = useState([]);
  const [showTiersAccordion, setShowTiersAccordion] = useState(false);
  const [showConversionsAccordion, setShowConversionsAccordion] = useState(false);

  // Modale d'avertissement vente à perte
  const [showLossWarningModal, setShowLossWarningModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const numSale = Number(salePrice) || 0;
  const numCost = Number(costPrice) || 0;
  const margin = numSale - numCost;
  const isLoss = numCost > 0 && numSale > 0 && numSale < numCost;

  useEffect(() => {
    if (!id) return;

    const savedCustom = JSON.parse(
      localStorage.getItem('vendix-custom-products') || '[]'
    );
    const savedLegacy = JSON.parse(
      localStorage.getItem('vendix_products') || '[]'
    );
    const combinedSaved = [...savedCustom, ...savedLegacy];

    const productToEdit =
      combinedSaved.find((product) => String(product.id) === String(id)) ??
      productsData.products.find((product) => String(product.id) === String(id));

    if (!productToEdit) {
      toastError?.('Produit introuvable.', 'Erreur');
      navigate('/app/products');
      return;
    }

    setName(productToEdit.name ?? '');
    setCategory(productToEdit.categoryId ?? productToEdit.category ?? '');
    setDescription(productToEdit.description ?? '');
    setPhotoUrl(productToEdit.photoUrl ?? '');
    setCostPrice(String(productToEdit.costPrice ?? ''));
    setSalePrice(String(productToEdit.salePrice ?? ''));
    setCurrentStock(String(productToEdit.currentStock ?? ''));
    setAlertThreshold(String(productToEdit.alertThreshold ?? ''));
    setBaseUnit(productToEdit.baseUnit ?? 'Unité');
    setIsVisible(productToEdit.isVisible ?? true);
    setIsFavorite(productToEdit.isFavorite ?? false);

    const loadedTiers = productToEdit.priceTiers ?? [];
    setPriceTiers(loadedTiers);
    if (loadedTiers.length > 0) setShowTiersAccordion(true);

    const loadedConversions = productToEdit.unitConversions ?? productToEdit.units ?? [];
    setUnitConversions(loadedConversions);
    if (loadedConversions.length > 0) setShowConversionsAccordion(true);
  }, [id, navigate, toastError]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const catId = `cat-${Date.now()}`;
    const newCat = {
      id: catId,
      name: newCategoryName.trim(),
      productsCount: 0,
    };

    const updated = [newCat, ...categories];
    setCategories(updated);
    localStorage.setItem(
      'vendix-custom-categories',
      JSON.stringify(updated.filter((c) => String(c.id).startsWith('cat-')))
    );

    setCategory(catId);
    setNewCategoryName('');
    setIsCreatingCategory(false);
  };

  const handleFormSubmit = (event) => {
    event?.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('La désignation du produit est obligatoire.');
      return;
    }
    if (!category) {
      setError('Veuillez sélectionner ou créer une catégorie.');
      return;
    }
    if (salePrice === '' || numSale < 0) {
      setError('Veuillez renseigner un prix de vente valide.');
      return;
    }

    // Interception si vente sous coût d'achat pour confirmation explicite
    if (isLoss && !showLossWarningModal) {
      setShowLossWarningModal(true);
      return;
    }

    performSave();
  };

  const performSave = () => {
    setIsSubmitting(true);
    setShowLossWarningModal(false);

    const currentCatObj = categories.find((c) => String(c.id) === String(category));
    const categoryName = currentCatObj ? currentCatObj.name : 'Général';

    const newProduct = {
      id: id ? (isNaN(Number(id)) ? id : Number(id)) : `p-${Date.now()}`,
      name: name.trim(),
      categoryId: category,
      category,
      categoryName,
      description: description.trim(),
      photoUrl: photoUrl || '',
      costPrice: numCost,
      salePrice: numSale,
      currentStock: Number(currentStock) || 0,
      alertThreshold: Number(alertThreshold) || 0,
      baseUnit: baseUnit.trim() || 'Unité',
      priceTiers,
      unitConversions,
      units: unitConversions,
      isFavorite,
      isVisible,
      updatedAt: new Date().toISOString(),
    };

    const existingCustom = JSON.parse(
      localStorage.getItem('vendix-custom-products') || '[]'
    );

    let updatedCustom;
    if (id) {
      const existsInCustom = existingCustom.some(
        (product) => String(product.id) === String(id)
      );
      if (existsInCustom) {
        updatedCustom = existingCustom.map((product) =>
          String(product.id) === String(id)
            ? { ...newProduct, createdAt: product.createdAt || newProduct.updatedAt }
            : product
        );
      } else {
        updatedCustom = [newProduct, ...existingCustom];
      }
    } else {
      updatedCustom = [newProduct, ...existingCustom];
    }

    localStorage.setItem('vendix-custom-products', JSON.stringify(updatedCustom));
    localStorage.setItem('vendix_products', JSON.stringify(updatedCustom));

    const message = id ? 'Produit mis à jour avec succès !' : 'Produit ajouté au catalogue !';
    if (toastSuccess) {
      toastSuccess(message, 'Catalogue');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/app/products');
    }, 250);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Barre supérieure ergonomique avec Action Rapide Sticky */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/app/products"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-vendix-brand"
              aria-label="Retour au catalogue"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {id ? 'Modifier le produit' : 'Nouveau produit'}
                </h1>
                {isFavorite && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    Favori caisse
                  </span>
                )}
                {!isVisible && (
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    <EyeOff size={11} />
                    Masqué
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {id
                  ? 'Modifiez les informations, tarifs dégressifs et unités de vente.'
                  : 'Renseignez les données essentielles pour ajouter l’article en caisse.'}
              </p>
            </div>
          </div>

          {/* Boutons d'action visibles en permanence */}
          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/app/products')}
              className="w-1/2 sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Annuler
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFormSubmit}
              className="w-1/2 sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <PackagePlus size={16} />
                  <span>{id ? 'Mettre à jour' : 'Enregistrer le produit'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Disposition 2 Colonnes ergonomique */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne Principale Gauche : Informations Clés & Tarification (7 colonnes) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Informations Générales */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                1. Identification du produit
              </h2>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Désignation du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ex : Riz Parfumé Royal 25kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="category"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Catégorie *
                  </label>
                  {!isCreatingCategory ? (
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(true)}
                      className="flex items-center gap-1 text-[11px] font-bold text-vendix-brand hover:underline"
                    >
                      <Plus size={12} />
                      <span>Nouvelle catégorie</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(false)}
                      className="text-[11px] font-bold text-slate-500 hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </div>

                {isCreatingCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom de la nouvelle catégorie..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="rounded-xl bg-vendix-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-vendix-brand-dark"
                    >
                      Ajouter
                    </button>
                  </div>
                ) : (
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Description (optionnelle)
                </label>
                <textarea
                  id="description"
                  rows={2}
                  placeholder="Détails du produit visibles sur la boutique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>
            </section>

            {/* Tarification & Marge */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                2. Prix et Rentabilité
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="salePrice"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    min="0"
                    placeholder="Ex : 18500"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="costPrice"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Coût d'achat (FCFA)
                  </label>
                  <input
                    type="number"
                    id="costPrice"
                    min="0"
                    placeholder="Ex : 16500"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  />
                </div>
              </div>

              {/* Indicateur financier direct */}
              <div
                className={`rounded-xl p-3.5 border transition ${
                  isLoss
                    ? 'bg-red-50 border-red-200'
                    : margin > 0
                    ? 'bg-emerald-50/60 border-emerald-200/60'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Marge commerciale unitaire
                    </p>
                    <p
                      className={`text-base font-bold ${
                        isLoss
                          ? 'text-red-700'
                          : margin > 0
                          ? 'text-emerald-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {margin.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>

                  {numCost > 0 && numSale > 0 && (
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Taux de marge
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {Math.round((margin / numCost) * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                {isLoss && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>Attention : Prix inférieur au coût d'achat (vente à perte).</span>
                  </div>
                )}
              </div>
            </section>

            {/* Accordéon 1 : Tarifs dégressifs par volume (Optionnel) */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTiersAccordion(!showTiersAccordion)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50 focus-visible:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-vendix-brand">
                    <Layers size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Tarifs selon la quantité (Demi-gros / Gros)
                      </h3>
                      {priceTiers.length > 0 && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-vendix-brand">
                          {priceTiers.length} configuré{priceTiers.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Optionnel : définissez des prix dégressifs automatiques.
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    showTiersAccordion ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showTiersAccordion && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/40">
                  <PriceTierManager
                    value={priceTiers}
                    onChange={(tiers) => setPriceTiers(tiers)}
                  />
                </div>
              )}
            </div>

            {/* Accordéon 2 : Unités secondaires & Conversions (Optionnel) */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setShowConversionsAccordion(!showConversionsAccordion)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50 focus-visible:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Scale size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Unités de vente secondaires (Carton, Sac...)
                      </h3>
                      {unitConversions.length > 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {unitConversions.length} configurée{unitConversions.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Optionnel : vendez par carton ou paquet avec déduction automatique.
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    showConversionsAccordion ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showConversionsAccordion && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/40">
                  <UnitConversionField
                    baseUnit={baseUnit}
                    value={unitConversions}
                    onChange={(conversions) => setUnitConversions(conversions)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Colonne Latérale Droite : Stock, Visibilité & Photo (5 colonnes) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Stock Initial & Unité de Base */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                3. Stock initial & Unité
              </h2>

              <div>
                <label
                  htmlFor="baseUnit"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Unité de base *
                </label>
                <input
                  type="text"
                  id="baseUnit"
                  placeholder="Ex : Sac, Carton, Pièce, Bouteille..."
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  L'unité de référence pour le décompte physique de votre stock.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="currentStock"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Stock initial *
                  </label>
                  <input
                    type="number"
                    id="currentStock"
                    min="0"
                    placeholder="Ex : 50"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="alertThreshold"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Seuil d'alerte
                  </label>
                  <input
                    type="number"
                    id="alertThreshold"
                    min="0"
                    placeholder="Ex : 5"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  />
                </div>
              </div>
            </section>

            {/* Options Métier : Visibilité Boutique et Favori Caisse */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                4. Visibilité & Accès Rapide
              </h2>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Boutique en ligne (WhatsApp)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isVisible ? 'Visible sur votre catalogue public' : 'Masqué aux clients sur le web'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="h-4 w-4 rounded text-vendix-brand focus:ring-vendix-brand"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isFavorite ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Star size={16} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Favori Caisse & Vente
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Affiché en priorité sur la grille tactile
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="h-4 w-4 rounded text-vendix-brand focus:ring-vendix-brand"
                />
              </label>
            </section>

            {/* Photo du Produit */}
            <ProductImageUpload
              value={photoUrl}
              onChange={(newPhoto) => setPhotoUrl(newPhoto)}
            />
          </div>
        </div>

        {/* Modale de Confirmation explicite Vente à Perte */}
        {showLossWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmation de vente à perte
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Vous avez fixé un prix de vente de{' '}
                  <strong className="text-slate-900">{numSale.toLocaleString('fr-FR')} FCFA</strong>{' '}
                  qui est inférieur au coût d'achat renseigné de{' '}
                  <strong className="text-slate-900">{numCost.toLocaleString('fr-FR')} FCFA</strong>.
                  Chaque vente enregistrera une perte brute unitaire de{' '}
                  <strong className="text-red-600">{Math.abs(margin).toLocaleString('fr-FR')} FCFA</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLossWarningModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Corriger les prix
                </button>
                <button
                  type="button"
                  onClick={performSave}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Confirmer et enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
