import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptModal from './ReceiptModal';

describe('ReceiptModal', () => {
  const sampleSale = {
    receiptNumber: 'VND-2026-TEST',
    date: '2026-11-08T14:30:00Z',
    products: [
      { id: '1', name: 'Riz 25kg', quantity: 2, price: 18000, subtotal: 36000 },
    ],
    totalAmount: 36000,
    receivedAmount: 40000,
    changeAmount: 4000,
    remainingAmount: 0,
    paymentMethod: 'CASH',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('affiche les options de format thermique 58mm et 80mm', () => {
    render(
      <ReceiptModal
        isOpen={true}
        onClose={vi.fn()}
        sale={sampleSale}
        shopName="Test Shop"
      />
    );

    const btn58 = screen.getByText('58 mm');
    const btn80 = screen.getByText('80 mm');
    expect(btn58).toBeDefined();
    expect(btn80).toBeDefined();

    // Cliquer sur 58mm et vérifier localStorage
    fireEvent.click(btn58);
    expect(localStorage.getItem('vendix_receipt_paper_format')).toBe('58mm');

    // Cliquer sur 80mm et vérifier localStorage
    fireEvent.click(btn80);
    expect(localStorage.getItem('vendix_receipt_paper_format')).toBe('80mm');
  });

  it('propose un déclenchement d’impression et gère auto-impression', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <ReceiptModal
        isOpen={true}
        onClose={vi.fn()}
        sale={sampleSale}
        shopName="Test Shop"
      />
    );

    const printBtn = screen.getByRole('button', { name: /imprimer/i });
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();
  });
});
