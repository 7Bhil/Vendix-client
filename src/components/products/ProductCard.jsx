import { useNavigate } from 'react-router-dom';
export default function ProductCard({ product }) {
 const navigate = useNavigate();
    const getStockStatus = () => {
  if (product.currentStock <= 0) {
    return 'Rupture de stock';
  }

  if (product.currentStock <= product.alertThreshold) {
    return 'Stock faible';
  }

  return 'Stock normal';
};

const getStockColor = () => {
  if (product.currentStock <= 0) {
    return 'text-red-600 bg-red-100';
  }

  if (product.currentStock <= product.alertThreshold) {
    return 'text-orange-600 bg-orange-100';
  }

  return 'text-green-600 bg-green-100';
};

const isSellingAtLoss = () => {
  return product.salePrice < product.costPrice;
};
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h2 className="text-lg font-semibold text-vendix-ink">
  {product.name}
</h2>
   <div className="mt-3 space-y-2 text-sm text-slate-600">
  <p>Catégorie : {product.categoryName}</p>

      <p>
  Prix de vente :
  <span className="ml-2 font-semibold text-vendix-brand">
    {product.salePrice} FCFA
  </span>
</p>

<p>
  Prix d'achat :
  <span className="ml-2 font-medium text-slate-800">
    {product.costPrice} FCFA
  </span>
</p>

      {isSellingAtLoss() && (
  <p className="mt-2 text-sm font-medium text-red-600">
    Attention : prix de vente inférieur au prix d'achat !
  </p>
)}

      <p>Stock disponible : {product.currentStock}</p>

      <p className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStockColor()}`}>
  {getStockStatus()}
</p>

</div>

<div className="mt-5 border-t border-slate-100 pt-4">
  <button
    type="button"
    onClick={() => navigate(`/app/products/${product.id}/modifier`)}
    className="rounded-xl border border-vendix-brand px-4 py-2 text-sm font-medium text-vendix-brand hover:bg-slate-50"
  >
    Modifier
  </button>
</div>


    </div>
  );
}