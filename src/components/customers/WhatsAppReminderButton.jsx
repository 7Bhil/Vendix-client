import { MessageCircle } from 'lucide-react';
import { formatCurrency, getStoreName } from '../../utils/customerDebtUtils.js';

function getWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('229')) return digits;
  if (digits.startsWith('0')) return `229${digits.slice(1)}`;
  return digits;
}

export default function WhatsAppReminderButton({ customer, className = '', compact = false }) {
  const message = `Bonjour ${customer.fullName}, nous vous rappelons que votre solde auprès de ${getStoreName()} est de ${formatCurrency(customer.currentDebt)} FCFA. Merci de bien vouloir passer faire le point à votre convenance.`;
  const whatsappUrl = `https://wa.me/${getWhatsAppNumber(customer.phone)}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Relancer ${customer.fullName} sur WhatsApp`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 font-bold text-white shadow-xs transition-all duration-150 hover:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        compact ? 'h-9 px-3 text-xs' : 'px-4 py-2.5 text-sm'
      } ${className}`}
    >
      <MessageCircle size={compact ? 15 : 18} aria-hidden="true" />
      <span>{compact ? 'Relancer' : 'Relancer sur WhatsApp'}</span>
    </a>
  );
}
