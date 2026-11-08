import { suppliersService } from '../api/services.js';

export const SUPPLIERS_STORAGE_KEY = 'vendix.suppliers';

export function loadSuppliers() {
  try {
    const saved = window.localStorage.getItem(SUPPLIERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveSuppliers(suppliers) {
  try {
    window.localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(suppliers));
  } catch (error) {
    // Quota depasse ou acces restreint
  }
}

/**
 * Recupere les fournisseurs depuis l'API NestJS avec cache de secours offline.
 */
export async function fetchSuppliers(params = {}) {
  try {
    const remoteData = await suppliersService.getAll(params);
    const list = Array.isArray(remoteData) ? remoteData : remoteData?.data || [];
    saveSuppliers(list);
    return list;
  } catch (error) {
    const cached = loadSuppliers();
    return cached;
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount ?? 0);
}

export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
