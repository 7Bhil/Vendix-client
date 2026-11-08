const STORAGE_KEY = 'vendix.customer-debts';

export function loadCustomers() {
  const savedCustomers = window.localStorage.getItem(STORAGE_KEY);
  return savedCustomers ? JSON.parse(savedCustomers) : [];
}

export function saveCustomers(customers) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
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

export function getDebtAge(date) {
  if (!date) return 0;
  const startOfDebt = new Date(date);
  const now = new Date();
  startOfDebt.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now - startOfDebt) / 86400000));
}

export function getStoreName() {
  try {
    const raw = localStorage.getItem('vendix_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.name) return parsed.name;
    }
  } catch {}
  return 'Boutique Vendix';
}

export function getInitialPaymentHistory(customer) {
  const savedPaymentIds = new Set((customer.paymentHistory ?? []).map((payment) => payment.id));
  return (customer.statement ?? [])
    .filter((entry) => entry.credit > 0 && !savedPaymentIds.has(entry.ref))
    .map((entry) => ({
      id: entry.ref,
      date: entry.date,
      amount: entry.credit,
      method: entry.type.replace('ACOMPTE_', '').replaceAll('_', ' '),
      reference: entry.ref,
    }));
}
