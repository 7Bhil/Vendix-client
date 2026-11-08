import { describe, it, expect } from 'vitest';
import { getProductTierPrice, getTierLabel } from './pricingUtils';

describe('pricingUtils - getProductTierPrice & getTierLabel', () => {
  const sampleProductWithClassicTiers = {
    id: 'p-classic',
    name: 'Produit Classique',
    salePrice: 1000,
    priceTiers: [
      { tier: 'detail', minQuantity: 1, price: 1000 },
      { tier: 'demi_gros', minQuantity: 5, price: 900 },
      { tier: 'gros', minQuantity: 20, price: 800 },
    ],
  };

  const sampleProductWithBackendUnits = {
    id: 'p-backend',
    name: 'Produit Backend Units',
    salePrice: 1000,
    priceTiers: [
      {
        id: 'u-1',
        name: 'Pièce',
        unit: 'Pièce',
        minQuantity: 1,
        price: 1000,
        salePrice: 1000,
        conversionFactor: 1,
      },
      {
        id: 'u-2',
        name: 'Paquet (6 pièces)',
        unit: 'Paquet (6 pièces)',
        minQuantity: 6,
        price: 850,
        salePrice: 5100,
        conversionFactor: 6,
      },
      {
        id: 'u-3',
        name: 'Carton (24 pièces)',
        unit: 'Carton (24 pièces)',
        minQuantity: 24,
        price: 750,
        salePrice: 18000,
        conversionFactor: 24,
      },
    ],
  };

  it('retourne le prix de base si aucun palier ou qté insuffisante', () => {
    const res = getProductTierPrice(sampleProductWithClassicTiers, 2);
    expect(res.unitPrice).toBe(1000);
    expect(res.activeTier).toBeNull();
  });

  it('applique le palier demi-gros pour schéma classique', () => {
    const res = getProductTierPrice(sampleProductWithClassicTiers, 5);
    expect(res.unitPrice).toBe(900);
    expect(res.activeTier).toBeDefined();
    expect(getTierLabel(res.activeTier)).toBe('Demi-gros');
  });

  it('applique le palier gros pour schéma classique', () => {
    const res = getProductTierPrice(sampleProductWithClassicTiers, 25);
    expect(res.unitPrice).toBe(800);
    expect(res.activeTier).toBeDefined();
    expect(getTierLabel(res.activeTier)).toBe('Prix de gros');
  });

  it('applique les remises de palier unifiées avec product_units backend', () => {
    const res6 = getProductTierPrice(sampleProductWithBackendUnits, 6);
    expect(res6.unitPrice).toBe(850);
    expect(res6.activeTier.unit).toBe('Paquet (6 pièces)');
    expect(res6.activeTier.conversionFactor).toBe(6);

    const res24 = getProductTierPrice(sampleProductWithBackendUnits, 30);
    expect(res24.unitPrice).toBe(750);
    expect(res24.activeTier.unit).toBe('Carton (24 pièces)');
    expect(res24.activeTier.conversionFactor).toBe(24);
  });

  it('gère les produits sans priceTiers sans lever d’exception', () => {
    const res = getProductTierPrice({ salePrice: 500 }, 10);
    expect(res.unitPrice).toBe(500);
    expect(res.activeTier).toBeNull();
  });
});
