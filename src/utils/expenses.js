
/**
 * Utilitaires communs au module des dépenses Vendix
 */

// Formater un montant en FCFA
export const formatFCFA = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Catégories de dépenses
export const EXPENSE_CATEGORIES = [
  {
    value: "LOYER",
    label: "Loyer",
    icon: "Building2",
    color: "violet",
  },
  {
    value: "TRANSPORT",
    label: "Transport",
    icon: "Truck",
    color: "amber",
  },
  {
    value: "ENERGIE",
    label: "Énergie",
    icon: "Zap",
    color: "sky",
  },
  {
    value: "SALAIRES",
    label: "Salaires",
    icon: "Users",
    color: "blue",
  },
  {
    value: "FOURNITURES",
    label: "Emballages / Fournitures",
    icon: "Package",
    color: "emerald",
  },
  {
    value: "AUTRE",
    label: "Autre",
    icon: "CircleHelp",
    color: "slate",
  },
];

// Moyens de paiement
export const PAYMENT_METHODS = [
  { value: "CASH", label: "Espèces" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CARD", label: "Carte bancaire" },
  { value: "OTHER", label: "Autre" },
];

// Libellés des moyens de paiement
export const PAYMENT_LABELS = {
  CASH: "Espèces",
  MOBILE_MONEY: "Mobile Money",
  CARD: "Carte bancaire",
  OTHER: "Autre",
};
