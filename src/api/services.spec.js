import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from './client.js';
import {
  phoneUtils,
  authService,
  categoriesService,
  productsService,
  salesService,
  customersService,
} from './services.js';

describe('Client HTTP & Services API (Vendix Contracts)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('phoneUtils.toE164', () => {
    it('formate correctement un numéro national béninois à 10 chiffres', () => {
      expect(phoneUtils.toE164('0197000001')).toBe('+2290197000001');
    });

    it('formate un numéro sans indicatif et sans 0 initial', () => {
      expect(phoneUtils.toE164('97000001')).toBe('+22997000001');
    });

    it('préserve un numéro déjà au format E.164 international', () => {
      expect(phoneUtils.toE164('+2290197000001')).toBe('+2290197000001');
    });

    it('convertit les préfixes 00 en +', () => {
      expect(phoneUtils.toE164('002290197000001')).toBe('+2290197000001');
    });
  });

  describe('ApiClient (Gestion Tokens & Headers)', () => {
    it('injecte le token Authorization Bearer et x-commerce-id s’ils sont définis', async () => {
      api.setTokens('fake-access-token', 'fake-refresh-token');
      api.setActiveCommerceId('comm-uuid-123');

      let interceptedUrl = '';
      let interceptedOptions = {};

      globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
        interceptedUrl = url;
        interceptedOptions = opts;
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ data: 'ok' }),
        });
      });

      const res = await api.get('/categories');
      expect(res).toEqual({ data: 'ok' });
      expect(interceptedUrl).toBe('http://localhost:3000/categories');
      expect(interceptedOptions.headers['Authorization']).toBe('Bearer fake-access-token');
      expect(interceptedOptions.headers['x-commerce-id']).toBe('comm-uuid-123');
    });

    it('gère les erreurs NestJS formatées en tableau de messages', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            statusCode: 400,
            message: [
              'Le numéro de téléphone doit respecter le format international E.164.',
              'Le mot de passe doit comporter au moins 8 caractères.',
            ],
            error: 'Bad Request',
          }),
      });

      await expect(api.post('/auth/login', { phone: 'invalid' })).rejects.toThrow(
        'Le numéro de téléphone doit respecter le format international E.164. | Le mot de passe doit comporter au moins 8 caractères.',
      );
    });

    it('tente un rafraîchissement silencieux de token sur code 401', async () => {
      api.setTokens('expired-token', 'valid-refresh-token');

      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation((url) => {
        callCount++;
        if (url.includes('/auth/refresh')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () =>
              Promise.resolve({
                access_token: 'new-valid-access-token',
                refresh_token: 'new-valid-refresh-token',
              }),
          });
        }

        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () => Promise.resolve({ message: 'Token expiré' }),
          });
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ products: [] }),
        });
      });

      const data = await api.get('/products');
      expect(data).toEqual({ products: [] });
      expect(api.getAccessToken()).toBe('new-valid-access-token');
    });
  });

  describe('authService', () => {
    it('enregistre et stocke les tokens et le commerceId lors du login', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            user: { id: 'u1', commerce: { id: 'comm-abc' } },
            tokens: { access_token: 'jwt-123', refresh_token: 'ref-456' },
          }),
      });

      await authService.login({ phone: '0197000001', password: 'Password@2026' });

      expect(api.getAccessToken()).toBe('jwt-123');
      expect(api.getRefreshToken()).toBe('ref-456');
      expect(api.getActiveCommerceId()).toBe('comm-abc');
    });

    it('nettoie les tokens lors du logout', async () => {
      api.setTokens('token-1', 'token-2');
      api.setActiveCommerceId('comm-1');

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Déconnexion effectuée avec succès.' }),
      });

      await authService.logout();
      expect(api.getAccessToken()).toBeNull();
      expect(api.getRefreshToken()).toBeNull();
    });
  });

  describe('categoriesService & productsService', () => {
    it('permet de lister et créer une catégorie', async () => {
      let sentBody = '';
      globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
        if (opts.method === 'POST') {
          sentBody = opts.body;
          return Promise.resolve({
            ok: true,
            status: 201,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () => Promise.resolve({ id: 'cat-1', name: 'Boissons' }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve([{ id: 'cat-1', name: 'Boissons' }]),
        });
      });

      const created = await categoriesService.create('Boissons');
      expect(created.name).toBe('Boissons');
      expect(JSON.parse(sentBody)).toEqual({ name: 'Boissons' });

      const all = await categoriesService.getAll();
      expect(all).toHaveLength(1);
    });

    it('gère l’archivage et la restauration de produit', async () => {
      const calls = [];
      globalThis.fetch = vi.fn().mockImplementation((url) => {
        calls.push(url);
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ success: true }),
        });
      });

      await productsService.archive('prod-1');
      await productsService.restore('prod-1');

      expect(calls[0]).toContain('/products/prod-1/archive');
      expect(calls[1]).toContain('/products/prod-1/restore');
    });
  });

  describe('salesService (Caisse & POS)', () => {
    it('transmet les lignes de vente avec snapshots d’unités et de prix', async () => {
      let payloadSent = null;
      globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
        payloadSent = JSON.parse(opts.body);
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ id: 'sale-1', total_amount: 15000 }),
        });
      });

      await salesService.create({
        amount_paid: 15000,
        payment_method: 'CASH',
        lines: [
          {
            product_id: 'prod-uuid-1',
            quantity: 2,
            unit_label: 'Carton',
            conversion_factor: 12,
            unit_price: 7500,
          },
        ],
      });

      expect(payloadSent.amount_paid).toBe(15000);
      expect(payloadSent.payment_method).toBe('CASH');
      expect(payloadSent.lines[0].unit_label).toBe('Carton');
    });
  });

  describe('customersService (Dettes & Remboursements)', () => {
    it('crée un client avec numéro normalisé E.164', async () => {
      let createdPayload = null;
      globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
        createdPayload = JSON.parse(opts.body);
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ id: 'cust-1', ...createdPayload }),
        });
      });

      await customersService.create({
        fullName: 'Koffi Mensah',
        phone: '0197000002',
      });

      expect(createdPayload.full_name).toBe('Koffi Mensah');
      expect(createdPayload.phone).toBe('+2290197000002');
    });

    it('enregistre un remboursement partiel ou total pour un client', async () => {
      let repaymentPayload = null;
      globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
        repaymentPayload = JSON.parse(opts.body);
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ id: 'rep-1', ...repaymentPayload }),
        });
      });

      await customersService.recordRepayment('cust-1', {
        amount: 5000,
        paymentMethod: 'MOMO',
        notes: 'Acompte via MTN MoMo',
      });

      expect(repaymentPayload.amount).toBe(5000);
      expect(repaymentPayload.payment_method).toBe('MOMO');
      expect(repaymentPayload.notes).toBe('Acompte via MTN MoMo');
    });
  });
});
