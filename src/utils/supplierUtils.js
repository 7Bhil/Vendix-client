import suppliersMock from '../mocks/modules/suppliers.json';

const STORAGE_KEY = 'vendix.suppliers';

export function loadSuppliers() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : suppliersMock.suppliers;
  } catch {
    return suppliersMock.suppliers;
  }
}

export function saveSuppliers(suppliers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des fournisseurs', error);
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
