import { stockService } from '../api/services.js';

export const STOCK_MOVEMENTS_CACHE_KEY = 'vendix-stock-movements';
export const STOCK_PRODUCTS_CACHE_KEY = 'vendix-stock-products-cache';

// Lire une donnee du localStorage de maniere securisee.
export const readLocalStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Sauvegarder dans le localStorage de maniere securisee.
export const writeLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Quota depasse ou acces localStorage restreint
  }
};

/**
 * Recupere la liste des produits avec stock.
 * Priorise l'API NestJS (`stockService.getStockState`) et stocke en cache offline.
 * En cas d'erreur reseau ou hors-ligne, bascule sur le cache localStorage.
 */
export const fetchStockProducts = async (params = {}) => {
  try {
    const remoteData = await stockService.getStockState(params);
    const items = Array.isArray(remoteData) ? remoteData : remoteData?.data || [];
    if (items.length > 0 || !params.search) {
      writeLocalStorage(STOCK_PRODUCTS_CACHE_KEY, items);
    }
    return items;
  } catch (error) {
    const cached = readLocalStorage(STOCK_PRODUCTS_CACHE_KEY);
    if (cached.length > 0) {
      return cached;
    }
    // Secours local sur vendix_products / vendix-custom-products
    const savedLegacy = readLocalStorage('vendix_products');
    const savedCustom = readLocalStorage('vendix-custom-products');
    const productMap = new Map();
    [...savedLegacy, ...savedCustom].forEach((product) => {
      if (product?.id != null) {
        productMap.set(String(product.id), product);
      }
    });
    return Array.from(productMap.values());
  }
};

/**
 * Fonction synchrone conservant la retro-compatibilite avec les composants,
 * basee uniquement sur les donnees du cache local sans injection de mocks fictifs.
 */
export const getStockProducts = () => {
  const cachedStock = readLocalStorage(STOCK_PRODUCTS_CACHE_KEY);
  if (cachedStock.length > 0) {
    return cachedStock;
  }

  const savedLegacy = readLocalStorage('vendix_products');
  const savedCustom = readLocalStorage('vendix-custom-products');

  const productMap = new Map();
  [...savedLegacy, ...savedCustom].forEach((product) => {
    if (product?.id != null) {
      productMap.set(String(product.id), product);
    }
  });

  return Array.from(productMap.values());
};
