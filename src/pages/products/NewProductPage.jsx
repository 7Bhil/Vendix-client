import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PackagePlus } from 'lucide-react';
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
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [baseUnit, setBaseUnit] = useState('');
  const [priceTiers, setPriceTiers] = useState([]);
  const [unitConversions, setUnitConversions] = useState([]);
  const [error, setError] = useState('');

  const margin = Number(salePrice) - Number(costPrice);

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
    setCostPrice(String(productToEdit.costPrice ?? ''));
    setSalePrice(String(productToEdit.salePrice ?? ''));
    setCurrentStock(String(productToEdit.currentStock ?? ''));
    setAlertThreshold(String(productToEdit.alertThreshold ?? ''));
    setBaseUnit(productToEdit.baseUnit ?? '');
    setPriceTiers(productToEdit.priceTiers ?? []);
    setUnitConversions(productToEdit.unitConversions ?? productToEdit.units ?? []);
  }, [id, navigate, toastError]);

  const handleSave = (event) => {
    event?.preventDefault();

    if (!name.trim() || !category || !salePrice || !costPrice) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

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
      categoryName: categoryNames[category] || 'Autre',
      description: description.trim(),
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
    // Rétrocompatibilité avec vendix_products
    localStorage.setItem('vendix_products', JSON.stringify(updatedCustom));

    const message = id ? 'Produit modifié avec succès !' : 'Produit enregistré avec succès !';
    if (toastSuccess) {
      toastSuccess(message, 'Catalogue');
    }

    navigate('/app/products');
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
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">
            Informations générales
          </h2>
          <div className="mt-4">
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Nom du produit *
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
              htmlFor="description"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Décrivez brièvement votre produit..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="category"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Catégorie *
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

          <ProductImageUpload />
        </section>

        {/* Informations commerciales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">
            Informations commerciales & Tarification
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="costPrice"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Prix d'achat (FCFA) *
              </label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                min="0"
                placeholder="Ex : 16500"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={costPrice}
                onChange={(event) => setCostPrice(event.target.value)}
              />
            </div>

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
                name="salePrice"
                min="0"
                placeholder="Ex : 18500"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Marge commerciale unitaire
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                margin < 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {margin.toLocaleString('fr-FR')} FCFA
            </p>
            {margin < 0 && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                Attention : le prix de vente est inférieur au prix d'achat !
              </p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                Seuil d'alerte
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
                placeholder="Ex : Sac, Carton..."
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                value={baseUnit}
                onChange={(event) => setBaseUnit(event.target.value)}
              />
            </div>
          </div>

          <UnitConversionField onChange={setUnitConversions} />
          <PriceTierManager onChange={setPriceTiers} />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              onClick={() => navigate('/app/products')}
            >
              Annuler
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-vendix-brand px-5 py-2.5 text-xs font-bold text-white transition hover:bg-vendix-brand-dark focus-visible:ring-2 focus-visible:ring-vendix-brand"
              onClick={handleSave}
            >
              <PackagePlus size={16} />
              <span>{id ? 'Mettre à jour' : 'Enregistrer le produit'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
