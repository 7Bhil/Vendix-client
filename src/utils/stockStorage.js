import productsData from '../mocks/modules/products.json';

// Lire une donnée du localStorage de manière sécurisée.
export const readLocalStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Récupérer les produits enregistrés et les produits de démonstration.
export const getStockProducts = () => {
  const savedLegacy = readLocalStorage('vendix_products');
  const savedCustom = readLocalStorage('vendix-custom-products');

  const productMap = new Map();

  // Les produits personnalisés remplacent les anciens en cas de doublon.
  [...savedLegacy, ...savedCustom].forEach((product) => {
    if (product?.id != null) {
      productMap.set(String(product.id), product);
    }
  });

  const savedProducts = Array.from(productMap.values());

  const savedIds = new Set(
    savedProducts.map((product) => String(product.id))
  );

  // Ajouter uniquement les produits fictifs qui ne sont pas déjà enregistrés.
  const mockProducts = productsData.products.filter(
    (product) => !savedIds.has(String(product.id))
  );

  return [...savedProducts, ...mockProducts];
};
