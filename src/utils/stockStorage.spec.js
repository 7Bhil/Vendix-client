import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchStockProducts, getStockProducts, STOCK_PRODUCTS_CACHE_KEY } from './stockStorage.js';
import { stockService } from '../api/services.js';

vi.mock('../api/services.js', () => ({
  stockService: {
    getStockState: vi.fn(),
  },
}));

describe('stockStorage - Cache offline et fallback', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('charge les produits depuis stockService et alimente le cache', async () => {
    const mockStock = [
      { id: 'p-1', name: 'Riz 25kg', current_stock: 10, alert_threshold: 3 },
    ];
    vi.mocked(stockService.getStockState).mockResolvedValue(mockStock);

    const result = await fetchStockProducts();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Riz 25kg');

    const cached = JSON.parse(localStorage.getItem(STOCK_PRODUCTS_CACHE_KEY) || '[]');
    expect(cached).toEqual(mockStock);
  });

  it('bascule sur le cache localStorage en cas d’échec réseau de l’API', async () => {
    const cachedStock = [
      { id: 'p-cached', name: 'Produit en cache', current_stock: 5 },
    ];
    localStorage.setItem(STOCK_PRODUCTS_CACHE_KEY, JSON.stringify(cachedStock));

    vi.mocked(stockService.getStockState).mockRejectedValue(new Error('Network error'));

    const result = await fetchStockProducts();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p-cached');
  });

  it('getStockProducts lit le cache local sans injecter de mocks statiques', () => {
    const products = getStockProducts();
    expect(Array.isArray(products)).toBe(true);
    // Quand le localStorage est vide, aucun produit fictif n'est injecté
    expect(products).toHaveLength(0);
  });
});
