import { MessageCircle } from 'lucide-react';
import { formatCurrency, getStoreName } from '../../utils/customerDebtUtils.js';

function getWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('229')) return digits;
  if (digits.startsWith('0')) return `229${digits.slice(1)}`;
  return digits;
}

export default function WhatsAppReminderButton({ customer, className = '' }) {
  const message = `Bonjour ${customer.fullName}, nous vous rappelons que votre solde auprès de ${getStoreName()} est de ${formatCurrency(customer.currentDebt)} FCFA. Merci de bien vouloir passer faire le point à votre convenance.`;
  const whatsappUrl = `https://wa.me/${getWhatsAppNumber(customer.phone)}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Relancer ${customer.fullName} sur WhatsApp`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-vendix-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${className}`}
    >
      <MessageCircle size={18} aria-hidden="true" />
      Relancer sur WhatsApp
    </a>
  );
}
