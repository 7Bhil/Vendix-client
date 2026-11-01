import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PackagePlus, Loader2 } from 'lucide-react';
import productsData from '../../mocks/modules/products.json';
import ProductImageUpload from '../../components/products/ProductImageUpload.jsx';
import PriceTierManager from '../../components/products/PriceTierManager.jsx';
import UnitConversionField from '../../components/products/UnitConversionField.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function NewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [baseUnit, setBaseUnit] = useState('Unité');
  const [priceTiers, setPriceTiers] = useState([]);
  const [unitConversions, setUnitConversions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const margin = (Number(salePrice) || 0) - (Number(costPrice) || 0);

  useEffect(() => {
    if (!id) return;

    const savedCustom = JSON.parse(
      localStorage.getItem('vendix-custom-products') || '[]'
    );
    const savedLegacy = JSON.parse(
      localStorage.getItem('vendix_products') || '[]'
    );
    const combinedSaved = [...savedCustom, ...savedLegacy];

    // Chercher d'abord dans les produits enregistrés puis dans les mocks
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
    setPriceTiers(productToEdit.priceTiers ?? []);
    setUnitConversions(productToEdit.unitConversions ?? productToEdit.units ?? []);
  }, [id, navigate, toastError]);

  const handleSave = (event) => {
    event?.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('La désignation du produit est obligatoire.');
      return;
    }
    if (!category) {
      setError('Veuillez sélectionner une catégorie pour le produit.');
      return;
    }
    if (salePrice === '' || Number(salePrice) < 0) {
      setError('Veuillez renseigner un prix de vente valide.');
      return;
    }

    setIsSubmitting(true);

    const categoryNames = {
      'cat-1': 'Alimentation générale',
      'cat-2': 'Boissons & Jus',
      'cat-3': 'Entretien & Hygiène',
    };

    const newProduct = {
      id: id ? (isNaN(Number(id)) ? id : Number(id)) : `p-${Date.now()}`,
      name: name.trim(),
      categoryId: category,
      category,
      categoryName: categoryNames[category] || 'Alimentation générale',
      description: description.trim(),
      photoUrl: photoUrl || '',
      costPrice: Number(costPrice) || 0,
      salePrice: Number(salePrice) || 0,
      currentStock: Number(currentStock) || 0,
      alertThreshold: Number(alertThreshold) || 0,
      baseUnit: baseUnit.trim() || 'Unité',
      priceTiers,
      unitConversions,
      units: unitConversions,
      isFavorite: false,
      isVisible: true,
      updatedAt: new Date().toISOString(),
    };

    // Synchronisation sur vendix-custom-products (utilisé par la caisse et la vitrine)
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

    const message = id ? 'Produit modifié avec succès !' : 'Produit enregistré avec succès !';
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
      <div className="mx-auto max-w-3xl space-y-6">
        {/* En-tête avec bouton de retour */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/products"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
            aria-label="Retour au catalogue"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {id ? 'Modifier le produit' : 'Nouveau produit'}
            </h1>
            <p className="text-xs text-slate-500">
              {id
                ? 'Mettez à jour les tarifs, unités et stocks de cet article.'
                : 'Ajoutez un article au catalogue avec ses tarifs et son stock.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Informations générales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            Informations générales
          </h2>

          <div className="mt-4">
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Désignation du produit *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ex : Riz parfumé Royal 25kg"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="category"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Catégorie d'article *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Sélectionner une catégorie</option>
              {productsData.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="description"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Description détaillée (optionnelle)
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Ex : Sac scellé d'origine, provenance Thaïlande..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <ProductImageUpload
            value={photoUrl}
            onChange={(newPhoto) => setPhotoUrl(newPhoto)}
          />
        </section>

        {/* Informations commerciales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            Tarification & Marge
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="salePrice"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Prix de vente unitaire (FCFA) *
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                min="0"
                placeholder="Ex : 18500"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="costPrice"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Coût d'achat fournisseur (FCFA)
              </label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                min="0"
                placeholder="Ex : 16500"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={costPrice}
                onChange={(event) => setCostPrice(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Marge brute unitaire estimée
                </p>
                <p
                  className={`mt-1 text-lg font-bold ${
                    margin < 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {margin.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              {costPrice && salePrice && (
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Taux de marque
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {Number(salePrice) > 0
                      ? Math.round((margin / Number(salePrice)) * 100)
                      : 0}
                    %
                  </p>
                </div>
              )}
            </div>

            {margin < 0 && (
              <p className="mt-2 text-xs font-bold text-red-600">
                Alerte : Le prix de vente est inférieur au coût d'achat (vente à perte interdite).
              </p>
            )}
          </div>

          <PriceTierManager
            value={priceTiers}
            onChange={(tiers) => setPriceTiers(tiers)}
          />
        </section>

        {/* Stock & Unités */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            Gestion du Stock & Unités
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                name="baseUnit"
                placeholder="Ex : Sac, Carton, Pièce..."
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={baseUnit}
                onChange={(event) => setBaseUnit(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="currentStock"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Quantité en stock *
              </label>
              <input
                type="number"
                id="currentStock"
                name="currentStock"
                min="0"
                placeholder="Ex : 50"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={currentStock}
                onChange={(event) => setCurrentStock(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="alertThreshold"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Seuil d'alerte stock faible
              </label>
              <input
                type="number"
                id="alertThreshold"
                name="alertThreshold"
                min="0"
                placeholder="Ex : 5"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={alertThreshold}
                onChange={(event) => setAlertThreshold(event.target.value)}
              />
            </div>
          </div>

          <UnitConversionField
            baseUnit={baseUnit}
            value={unitConversions}
            onChange={(conversions) => setUnitConversions(conversions)}
          />

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              className="w-full sm:w-auto rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400"
              onClick={() => navigate('/app/products')}
            >
              Annuler
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-vendix-brand px-6 py-2.5 text-xs font-bold text-white transition hover:bg-vendix-brand-dark disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-vendix-brand"
              onClick={handleSave}
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
          </div>
        </section>
      </div>
    </div>
  );
}
