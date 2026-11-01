import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard.jsx';
import { useState } from 'react';
import productsData from '../../mocks/modules/products.json';
export default function ProductListPage() {
  const navigate = useNavigate();
  const savedProducts = JSON.parse(
  localStorage.getItem('vendix_products') || '[]'
);

const products = [...productsData.products, ...savedProducts];
  const categories = productsData.categories;
  const isSellingAtLoss = (product) => {
  return product.salePrice < product.costPrice;
};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStockStatus, setSelectedStockStatus] = useState('');
  
  const getStockStatus = (product) => {
  if (product.currentStock <= 0) {
    return 'Rupture de stock';
  }

  if (product.currentStock <= product.alertThreshold) {
    return 'Stock faible';
  }

  return 'Stock normal';
};

const filteredProducts = products.filter((product) => {
  const matchesName = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === '' || product.categoryName === selectedCategory;

    const matchesStockStatus =
  selectedStockStatus === '' ||
  getStockStatus(product) === selectedStockStatus;

  return matchesName && matchesCategory && matchesStockStatus;
});
const getStockColor = (product) => {
  if (product.currentStock <= 0) {
    return 'text-red-600 bg-red-100';
  }

  if (product.currentStock <= product.alertThreshold) {
    return 'text-orange-600 bg-orange-100';
  }

  return 'text-green-600 bg-green-100';
};

  return (
    <main>
      <h1>Mes produits</h1>

      <button
  onClick={() => navigate('/app/products/new')}
  className="rounded-xl bg-vendix-brand px-5 py-3 font-medium text-white transition hover:bg-vendix-brand-dark"
>
  Ajouter un produit
</button>

      <input
  type="text"
  placeholder="Rechercher un produit..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
<select
  value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
>
  <option value="">Toutes les catégories</option>

  {categories.map((category) => (
    <option key={category.id} value={category.categoryName}>
      {category.name}
    </option>
  ))}
</select>

<select
  value={selectedStockStatus}
  onChange={(event) => setSelectedStockStatus(event.target.value)}
>
  <option value="">Tous les stocks</option>
  <option value="Stock normal">Stock normal</option>
  <option value="Stock faible">Stock faible</option>
  <option value="Rupture de stock">Rupture de stock</option>
</select>
      

      <div>
        {filteredProducts.length === 0 ? (
  <p>Aucun produit trouvé.</p>
) : (
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {filteredProducts.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
        )}
      </div>
    </main>
  );
}
