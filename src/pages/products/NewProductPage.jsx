import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  PackagePlus,
  Loader2,
  Eye,
  EyeOff,
  Star,
  Plus,
  AlertTriangle,
  Check,
  Tag,
  BadgePercent,
  Boxes,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import productsData from '../../mocks/modules/products.json';
import ProductImageUpload from '../../components/products/ProductImageUpload.jsx';
import PriceTierManager from '../../components/products/PriceTierManager.jsx';
import UnitConversionField from '../../components/products/UnitConversionField.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const STEPS = [
  { id: 1, title: 'Article & Image', subtitle: 'Nom, catégorie & photo', icon: Tag },
  { id: 2, title: 'Prix & Marge', subtitle: 'Tarifs & rentabilité', icon: BadgePercent },
  { id: 3, title: 'Stock & Unités', subtitle: 'Stock de départ & alertes', icon: Boxes },
  { id: 4, title: 'Paliers & Options', subtitle: 'Gros, visibilité & favori', icon: Sliders },
];

export default function NewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

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

  // États du produit
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
  const [priceTiers, setPriceTiers] = useState([]);
  const [unitConversions, setUnitConversions] = useState([]);

  // Modale de confirmation vente à perte
  const [showLossWarningModal, setShowLossWarningModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState({});

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
    setPriceTiers(productToEdit.priceTiers ?? []);
    setUnitConversions(productToEdit.unitConversions ?? productToEdit.units ?? []);
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
    setStepErrors((prev) => ({ ...prev, category: '' }));
  };

  // Validations par étape
  const validateStep = (stepNumber) => {
    const errors = {};

    if (stepNumber === 1) {
      if (!name.trim()) errors.name = 'La désignation du produit est obligatoire.';
      if (!category) errors.category = 'Sélectionnez ou créez une catégorie.';
    }

    if (stepNumber === 2) {
      if (!salePrice || numSale < 0) errors.salePrice = 'Renseignez un prix de vente valide.';
    }

    if (stepNumber === 3) {
      if (!baseUnit.trim()) errors.baseUnit = 'L’unité de base est obligatoire (ex: Sac, Pièce).';
      if (currentStock === '' || Number(currentStock) < 0) {
        errors.currentStock = 'Renseignez le stock initial disponible (0 ou plus).';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const goToPrevStep = () => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = (event) => {
    event?.preventDefault();

    // Validation complète de toutes les étapes préalables
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

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
    <div className="p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* En-tête compact avec bouton retour */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              to="/app/products"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
              aria-label="Retour au catalogue"
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                {id ? 'Modifier le produit' : 'Nouveau produit'}
              </h1>
              <p className="text-[11px] text-slate-500">
                Étape {currentStep} sur {STEPS.length} : {STEPS[currentStep - 1].title}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-vendix-brand">
              {Math.round((currentStep / STEPS.length) * 100)}% complété
            </span>
          </div>
        </div>

        {/* Stepper visuel à barres de progression adaptées au mobile */}
        <div className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          {/* Barres d'étapes */}
          <div className="flex h-1.5 w-full gap-1.5">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  currentStep >= step.id ? 'bg-vendix-brand' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          {/* Pastilles cliquables sur desktop & tablette */}
          <div className="hidden sm:grid grid-cols-4 gap-2 pt-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    // Autorise la navigation vers les étapes déjà complétées
                    if (step.id < currentStep || validateStep(currentStep)) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-xl p-2 text-left transition ${
                    isActive
                      ? 'bg-blue-50/80 text-vendix-brand'
                      : isDone
                      ? 'text-emerald-700 hover:bg-slate-50'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isActive
                        ? 'bg-vendix-brand text-white shadow-2xs'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check size={13} /> : <Icon size={13} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold leading-tight">
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carte de contenu principale pour l'étape active */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          {/* ÉTAPE 1 : DÉSIGNATION, CATÉGORIE & PHOTO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  1. Identification du produit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Désignation principale et catégorisation de l'article.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Désignation du produit *
                </label>
                <input
                  type="text"
                  placeholder="Ex : Riz Parfumé Royal 25kg"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (stepErrors.name) setStepErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full rounded-xl border p-2.5 text-sm font-semibold outline-none focus:ring-1 ${
                    stepErrors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-vendix-brand focus:ring-vendix-brand'
                  }`}
                  autoFocus
                />
                {stepErrors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{stepErrors.name}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                      placeholder="Nom de la catégorie..."
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
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (stepErrors.category) {
                        setStepErrors((prev) => ({ ...prev, category: '' }));
                      }
                    }}
                    className={`w-full rounded-xl border bg-white p-2.5 text-sm outline-none focus:ring-1 ${
                      stepErrors.category
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-vendix-brand focus:ring-vendix-brand'
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {stepErrors.category && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{stepErrors.category}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description détaillée (optionnelle)
                </label>
                <textarea
                  rows={2}
                  placeholder="Détails du produit visibles sur la boutique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>

              <ProductImageUpload
                value={photoUrl}
                onChange={(newPhoto) => setPhotoUrl(newPhoto)}
              />
            </div>
          )}

          {/* ÉTAPE 2 : PRIX, COÛT D'ACHAT & MARGE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  2. Tarification & Marge
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fixez le prix de vente unitaire et évaluez votre rentabilité.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex : 18500"
                    value={salePrice}
                    onChange={(e) => {
                      setSalePrice(e.target.value);
                      if (stepErrors.salePrice) setStepErrors((prev) => ({ ...prev, salePrice: '' }));
                    }}
                    className={`w-full rounded-xl border p-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-1 ${
                      stepErrors.salePrice
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-vendix-brand focus:ring-vendix-brand'
                    }`}
                    autoFocus
                  />
                  {stepErrors.salePrice && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{stepErrors.salePrice}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Coût d'achat fournisseur (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex : 16500"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Sert à calculer automatiquement votre bénéfice.
                  </p>
                </div>
              </div>

              {/* Bilan financier instantané */}
              <div
                className={`rounded-2xl p-4 border transition ${
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
                      className={`text-xl font-black ${
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
                        Taux de marque
                      </p>
                      <p className="text-base font-bold text-slate-900">
                        {Math.round((margin / numSale) * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                {isLoss && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>Avertissement : Vente à perte (prix inférieur au coût d'achat).</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : STOCK INITIAL & UNITÉS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  3. Gestion du Stock & Unité de Base
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configurez l'unité physique et les alertes de réapprovisionnement.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Unité de base *
                </label>
                <input
                  type="text"
                  placeholder="Ex : Sac, Carton, Pièce, Bouteille..."
                  value={baseUnit}
                  onChange={(e) => {
                    setBaseUnit(e.target.value);
                    if (stepErrors.baseUnit) setStepErrors((prev) => ({ ...prev, baseUnit: '' }));
                  }}
                  className={`w-full rounded-xl border p-2.5 text-sm outline-none focus:ring-1 ${
                    stepErrors.baseUnit
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-vendix-brand focus:ring-vendix-brand'
                  }`}
                  autoFocus
                />
                {stepErrors.baseUnit && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{stepErrors.baseUnit}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-400">
                  L'unité de référence pour le décompte physique de votre stock.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Stock initial disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex : 50"
                    value={currentStock}
                    onChange={(e) => {
                      setCurrentStock(e.target.value);
                      if (stepErrors.currentStock) setStepErrors((prev) => ({ ...prev, currentStock: '' }));
                    }}
                    className={`w-full rounded-xl border p-2.5 text-sm font-bold outline-none focus:ring-1 ${
                      stepErrors.currentStock
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-vendix-brand focus:ring-vendix-brand'
                    }`}
                  />
                  {stepErrors.currentStock && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{stepErrors.currentStock}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Seuil d'alerte stock faible
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex : 5"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Vendix vous avertira dès que la quantité atteindra ce seuil.
                  </p>
                </div>
              </div>

              <UnitConversionField
                baseUnit={baseUnit}
                value={unitConversions}
                onChange={(conversions) => setUnitConversions(conversions)}
              />
            </div>
          )}

          {/* ÉTAPE 4 : PALIERS PAR VOLUME & OPTIONS DE VISIBILITÉ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  4. Tarifs de gros & Options de Visibilité
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configurez vos prix dégressifs et la visibilité en caisse et sur le web.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Boutique en ligne (WhatsApp)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isVisible ? 'Visible sur votre catalogue public en ligne' : 'Masqué aux clients sur le web'}
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

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isFavorite ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Star size={18} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Favori Caisse & Vente
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Affiché en priorité sur la grille tactile de vente rapide
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
              </div>

              <PriceTierManager
                value={priceTiers}
                onChange={(tiers) => setPriceTiers(tiers)}
              />

              {/* Récapitulatif global avant finalisation */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-vendix-brand uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>Récapitulatif de la fiche produit</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400">Désignation :</span>{' '}
                    <strong className="text-slate-900">{name || 'Non renseigné'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Prix vente :</span>{' '}
                    <strong className="text-vendix-brand">{numSale.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Stock initial :</span>{' '}
                    <strong className="text-slate-900">{currentStock || 0} {baseUnit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Marge brute :</span>{' '}
                    <strong className={margin >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                      {margin.toLocaleString('fr-FR')} FCFA
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation ergonomique inférieure (Précédent / Suivant / Enregistrer) */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goToPrevStep}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <ArrowLeft size={15} />
                <span>Précédent</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/app/products')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="flex items-center gap-1.5 rounded-xl bg-vendix-brand px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark focus-visible:ring-2 focus-visible:ring-vendix-brand"
              >
                <span>Continuer</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 rounded-xl bg-vendix-brand px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-vendix-brand-dark disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <PackagePlus size={16} />
                    <span>{id ? 'Mettre à jour le produit' : 'Enregistrer le produit'}</span>
                  </>
                )}
              </button>
            )}
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
