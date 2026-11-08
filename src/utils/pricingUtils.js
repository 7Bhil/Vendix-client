/**
 * Calcule le prix unitaire d'un produit selon ses paliers de prix (détail, demi-gros, gros).
 * Supporte le format classique (tier, minQuantity, price) ainsi que les unités backend product_units
 * (minQuantity, price, unit, conversionFactor, wholesale_price, retail_price).
 * 
 * @param {Object} product
 * @param {number} quantity
 * @returns {{ unitPrice: number, activeTier: Object | string | null }}
 */
export function getProductTierPrice(product, quantity = 1) {
  const basePrice = Number(product?.salePrice) || 0;
  if (!product?.priceTiers || !Array.isArray(product.priceTiers) || product.priceTiers.length === 0) {
    return { unitPrice: basePrice, activeTier: null };
  }

  // Normalisation des paliers pour gérer de manière transparente :
  // 1. Schéma classique { tier, minQuantity, price }
  // 2. Schéma issu des product_units { id, name, unit, minQuantity, price, salePrice, wholesalePrice, conversionFactor }
  const normalizedTiers = product.priceTiers
    .map((t) => {
      const minQty = Number(t.minQuantity ?? t.min_quantity ?? t.conversionFactor ?? 1);
      const tierPrice = Number(t.price ?? t.salePrice ?? t.retail_price ?? basePrice);
      return {
        ...t,
        minQuantity: minQty,
        price: tierPrice,
        tier: t.tier || (minQty >= 10 ? 'gros' : minQty >= 2 ? 'demi_gros' : 'detail'),
      };
    })
    .filter((t) => !isNaN(t.minQuantity) && !isNaN(t.price) && t.minQuantity > 0);

  // Trier par minQuantity décroissant pour trouver le palier le plus avantageux atteint
  const sortedTiers = [...normalizedTiers].sort((a, b) => b.minQuantity - a.minQuantity);
  const eligibleTier = sortedTiers.find((t) => Number(quantity) >= Number(t.minQuantity));

  if (eligibleTier && Number(eligibleTier.price) < basePrice) {
    return {
      unitPrice: Number(eligibleTier.price),
      activeTier: eligibleTier,
    };
  }

  return { unitPrice: basePrice, activeTier: null };
}

/**
 * Libellé lisible en français pour un palier
 */
export function getTierLabel(tier) {
  const tierKey = typeof tier === 'object' && tier !== null ? (tier.tier || tier.name || tier.unit) : tier;
  switch (tierKey) {
    case 'demi_gros':
      return 'Demi-gros';
    case 'gros':
      return 'Prix de gros';
    case 'detail':
      return 'Détail';
    default:
      return typeof tierKey === 'string' && tierKey ? tierKey : 'Détail';
  }
}
