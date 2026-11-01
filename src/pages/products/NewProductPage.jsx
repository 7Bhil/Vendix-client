import productsData from '../../mocks/modules/products.json';
import ProductImageUpload from '../../components/products/ProductImageUpload.jsx';
import PriceTierManager from '../../components/products/PriceTierManager.jsx';
import UnitConversionField from '../../components/products/UnitConversionField.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
export default function NewProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unitConversions, setUnitConversions] = useState([]);
  console.log('Conversions reçues :', unitConversions);
  const [baseUnit, setBaseUnit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [priceTiers, setPriceTiers] = useState([]);
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const margin = Number(salePrice) - Number(costPrice);



  useEffect(() => {
    if (!id) return;

    const savedProducts = JSON.parse(
      localStorage.getItem('vendix_products') || '[]'
    );

    // Chercher d'abord dans les produits enregistrés
    // puis dans les produits de démonstration
    const productToEdit =
      savedProducts.find(
        (product) => String(product.id) === id
      ) ??
      productsData.products.find(
        (product) => String(product.id) === id
      );

    if (!productToEdit) {
      alert('Produit introuvable.');
      navigate('/app/produits');
      return;
    }

    setName(productToEdit.name ?? '');
    setCategory(productToEdit.category ?? '');
    setDescription(productToEdit.description ?? '');
    setCostPrice(String(productToEdit.costPrice ?? ''));
    setSalePrice(String(productToEdit.salePrice ?? ''));
    setCurrentStock(String(productToEdit.currentStock ?? ''));
    setAlertThreshold(String(productToEdit.alertThreshold ?? ''));
    setBaseUnit(productToEdit.baseUnit ?? '');
    setPriceTiers(productToEdit.priceTiers ?? []);
    setUnitConversions(productToEdit.unitConversions ?? []);

  }, [id, navigate]);




  const handleSave = () => {
    if (!name.trim() || !category || !salePrice || !costPrice) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    const newProduct = {
      id: id ? Number(id) : Date.now(),
      name,
      category,
      categoryName: {
        'cat-1': 'Alimentation générale',
        'cat-2': 'Boissons & Jus',
        'cat-3': 'Entretien & Hygiène'
      }[category],
      description,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      currentStock: Number(currentStock) || 0,
      alertThreshold: Number(alertThreshold) || 0,
      baseUnit,
      priceTiers,
      unitConversions,
      createdAt: new Date().toISOString()
    };

    const existingProducts = JSON.parse(
      localStorage.getItem('vendix_products') || '[]'
    );

    let updatedProducts;

    if (id) {
      const productExists = existingProducts.some(
        (product) => String(product.id) === id
      );

      if (productExists) {
        updatedProducts = existingProducts.map((product) =>
          String(product.id) === id
            ? { ...newProduct, createdAt: product.createdAt }
            : product
        );
      } else {
        updatedProducts = [...existingProducts, newProduct];
      }
    } else {
      updatedProducts = [...existingProducts, newProduct];
    }

    localStorage.setItem(
      'vendix_products',
      JSON.stringify(updatedProducts)
    );

    alert(id ? 'Produit modifié avec succès !' : 'Produit enregistré avec succès !');

    navigate('/app/produits');
  };


  return (
    <main className="min-h-screen bg-vendix-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-extrabold text-vendix-ink sm:text-3xl">
            Nouveau produit
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ajoutez un produit à votre catalogue.
          </p>
        </div>

        {/* Informations générales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-vendix-ink">
            Informations générales
          </h2>
          <div className="mt-5">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nom du produit *
            </label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ex : Riz parfumé Royal 25kg"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Décrivez brièvement votre produit..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Catégorie *
            </label>

            <select
              id="category"
              name="category"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="cat-1">Alimentation générale</option>
              <option value="cat-2">Boissons & Jus</option>
              <option value="cat-3">Entretien & Hygiène</option>
            </select>
          </div>

          <ProductImageUpload />

        </section>
        {/* Informations commerciales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-vendix-ink">
            Informations commerciales
          </h2>
          <div className="mt-5">
            <label
              htmlFor="costPrice"
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={costPrice}
              onChange={(event) => setCostPrice(event.target.value)}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="salePrice"
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
            />
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">
              Marge commerciale unitaire
            </p>

            <p className={`mt-1 text-lg font-bold ${margin < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
              {margin.toLocaleString('fr-FR')} FCFA
            </p>

            {margin < 0 && (
              <p className="mt-2 text-sm text-red-600">
                Attention : le prix de vente est inférieur au prix d'achat !
              </p>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor="currentStock"
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={currentStock}
              onChange={(event) => setCurrentStock(event.target.value)}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="alertThreshold"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Seuil d'alerte du stock
            </label>

            <input
              type="number"
              id="alertThreshold"
              name="alertThreshold"
              min="0"
              placeholder="Ex : 5"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={alertThreshold}
              onChange={(event) => setAlertThreshold(event.target.value)}
            />

            <p className="mt-1 text-xs text-slate-500">
              Vendix signalera un stock faible lorsque la quantité disponible atteindra ce seuil.
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="baseUnit"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Unité de base *
            </label>

            <input
              type="text"
              id="baseUnit"
              name="baseUnit"
              placeholder="Ex : Pièce, Sac, Bidon..."
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-vendix-brand focus:ring-2 focus:ring-vendix-brand/20"
              value={baseUnit}
              onChange={(event) => setBaseUnit(event.target.value)}
            />

            <p className="mt-1 text-xs text-slate-500">
              L'unité de référence utilisée pour gérer le stock.
            </p>
          </div>
          <UnitConversionField onChange={setUnitConversions} />
          <PriceTierManager onChange={setPriceTiers} />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="button"
              className="rounded-xl bg-vendix-brand px-5 py-3 font-medium text-white hover:opacity-90"
              onClick={handleSave}
            >
              Enregistrer le produit
            </button>
          </div>

        </section>

      </div>

    </main>
  );
};