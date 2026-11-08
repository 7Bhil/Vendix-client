import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewSalePage from './NewSalePage';
import { ToastProvider } from '../../context/ToastContext';
import { salesService } from '../../api/services.js';

describe('NewSalePage - Panier & Caisse POS', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('charge le panier depuis localStorage vendix_pos_active_cart s’il existe', () => {
    const savedCart = [
      { id: 'prod-1', name: 'Sucre St Louis', quantity: 3, salePrice: 1200 },
    ];
    localStorage.setItem('vendix_pos_active_cart', JSON.stringify(savedCart));

    render(
      <MemoryRouter>
        <ToastProvider>
          <NewSalePage />
        </ToastProvider>
      </MemoryRouter>
    );

    // Vérifie que l'article présent dans le localStorage est affiché dans le résumé
    expect(screen.getByText(/Sucre St Louis/i)).toBeDefined();
  });

  it('génère un client_op_uuid et envoie le bon mapping de paiement à salesService.create', async () => {
    const createSpy = vi.spyOn(salesService, 'create').mockResolvedValue({
      id: 'sale-123',
      reference: 'VND-2026-001',
    });

    const savedCart = [
      {
        id: 'prod-momo',
        name: 'Huile Dinor',
        quantity: 2,
        salePrice: 5000,
        unit: 'Bidon',
        priceTiers: [],
      },
    ];
    localStorage.setItem('vendix_pos_active_cart', JSON.stringify(savedCart));

    render(
      <MemoryRouter>
        <ToastProvider>
          <NewSalePage />
        </ToastProvider>
      </MemoryRouter>
    );

    // Clic sur Valider / Encaisser (ou déclenchement paiement)
    const checkoutBtns = screen.getAllByRole('button', { name: /encaisser/i });
    fireEvent.click(checkoutBtns[0]);

    // Dans PaymentModal, sélectionner Mobile Money
    const momoBtn = screen.getByText(/mobile money/i);
    fireEvent.click(momoBtn);

    // Confirmer le paiement
    const confirmBtn = screen.getByRole('button', { name: /valider et imprimer le reçu/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    const payload = createSpy.mock.calls[0][0];
    expect(payload.payment_method).toBe('MOMO');
    expect(payload.client_op_uuid).toBeDefined();
    expect(typeof payload.client_op_uuid).toBe('string');
    expect(payload.client_op_uuid.length).toBeGreaterThan(10);
  });
});
