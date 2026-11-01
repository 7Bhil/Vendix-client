/**
 * Calcule le prix unitaire d'un produit selon ses paliers de prix (détail, demi-gros, gros).
 * @param {Object} product
 * @param {number} quantity
 * @returns {{ unitPrice: number, activeTier: string | null }}
 */
export function getProductTierPrice(product, quantity = 1) {
  const basePrice = Number(product.salePrice) || 0;
  if (!product.priceTiers || !Array.isArray(product.priceTiers) || product.priceTiers.length === 0) {
    return { unitPrice: basePrice, activeTier: null };
  }

  // Trier par minQuantity décroissant pour trouver le palier le plus avantageux atteint
  const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
  const eligibleTier = sortedTiers.find((t) => Number(quantity) >= Number(t.minQuantity));

  if (eligibleTier && Number(eligibleTier.price) < basePrice) {
    return {
      unitPrice: Number(eligibleTier.price),
      activeTier: eligibleTier.tier, // 'demi_gros' | 'gros'
    };
  }

  return { unitPrice: basePrice, activeTier: null };
}

/**
 * Libellé lisible en français pour un palier
 */
export function getTierLabel(tier) {
  switch (tier) {
    case 'demi_gros':
      return 'Demi-gros';
    case 'gros':
      return 'Prix de gros';
    default:
      return 'Détail';
  }
}
