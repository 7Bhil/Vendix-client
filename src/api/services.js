import api from './client.js';

export const phoneUtils = {
  /**
   * Normalise un numéro en format E.164 béninois ou international (+229...)
   * Ex: "0197000001" -> "+2290197000001"
   * Ex: "97000001" -> "+22997000001"
   * Ex: "+2290197000001" -> "+2290197000001"
   */
  toE164(phone, defaultCountryCode = '+229') {
    if (!phone) return '';
    const clean = phone.replace(/[\s.-]/g, '');
    if (clean.startsWith('+')) return clean;
    if (clean.startsWith('00')) return `+${clean.slice(2)}`;
    return `${defaultCountryCode}${clean}`;
  },
};

export const authService = {
  async register({ phone, password, shopName, emailRecovery }) {
    const formattedPhone = phoneUtils.toE164(phone);
    const payload = {
      phone: formattedPhone,
      password,
      ...(shopName ? { commerce_name: shopName } : {}),
      ...(emailRecovery ? { email_recovery: emailRecovery } : {}),
    };

    const data = await api.post('/auth/register', payload);
    if (data?.tokens?.access_token) {
      api.setTokens(data.tokens.access_token, data.tokens.refresh_token);
      if (data.user?.commerce?.id) {
        api.setActiveCommerceId(data.user.commerce.id);
      }
    }
    return data;
  },

  async login({ phone, password }) {
    const formattedPhone = phoneUtils.toE164(phone);
    const data = await api.post('/auth/login', { phone: formattedPhone, password });
    if (data?.tokens?.access_token) {
      api.setTokens(data.tokens.access_token, data.tokens.refresh_token);
      if (data.user?.commerce?.id) {
        api.setActiveCommerceId(data.user.commerce.id);
      }
    }
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Nettoyage local même si échec réseau
    } finally {
      api.clearTokens();
    }
  },

  getMe() {
    return api.get('/auth/me');
  },
};

export const categoriesService = {
  getAll() {
    return api.get('/categories');
  },

  create(name) {
    return api.post('/categories', { name });
  },

  update(id, name) {
    return api.patch(`/categories/${id}`, { name });
  },

  delete(id) {
    return api.delete(`/categories/${id}`);
  },
};

export const productsService = {
  getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },

  getById(id) {
    return api.get(`/products/${id}`);
  },

  create(productData) {
    return api.post('/products', productData);
  },

  update(id, productData) {
    return api.patch(`/products/${id}`, productData);
  },

  archive(id) {
    return api.post(`/products/${id}/archive`);
  },

  restore(id) {
    return api.post(`/products/${id}/restore`);
  },
};

export const stockService = {
  getStockState(params = {}) {
    const query = new URLSearchParams();
    if (params.level) query.append('level', params.level);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.search) query.append('search', params.search);
    if (params.threshold !== undefined) query.append('threshold', String(params.threshold));
    const qs = query.toString();
    return api.get(`/stock${qs ? `?${qs}` : ''}`);
  },

  recordMovement(payload) {
    return api.post('/stock/movements', payload);
  },

  getMovementsHistory(params = {}) {
    const query = new URLSearchParams();
    if (params.productId) query.append('productId', params.productId);
    if (params.type) query.append('type', params.type);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    const qs = query.toString();
    return api.get(`/stock/movements${qs ? `?${qs}` : ''}`);
  },

  getAlerts(threshold) {
    const qs = threshold !== undefined ? `?threshold=${threshold}` : '';
    return api.get(`/stock/alerts${qs}`);
  },
};

export const salesService = {
  getAll(limit = 50) {
    return api.get(`/sales?limit=${limit}`);
  },

  getById(id) {
    return api.get(`/sales/${id}`);
  },

  create(salePayload) {
    return api.post('/sales', salePayload);
  },
};

export const customersService = {
  getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.filterMode) query.append('filterMode', params.filterMode);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return api.get(`/customers${qs ? `?${qs}` : ''}`);
  },

  getDebtors() {
    return api.get('/customers/debts');
  },

  getById(id) {
    return api.get(`/customers/${id}`);
  },

  create(customerData) {
    const payload = {
      full_name: customerData.full_name || customerData.fullName,
      phone: phoneUtils.toE164(customerData.phone),
    };
    return api.post('/customers', payload);
  },

  update(id, customerData) {
    const payload = {};
    if (customerData.full_name || customerData.fullName) {
      payload.full_name = customerData.full_name || customerData.fullName;
    }
    if (customerData.phone) {
      payload.phone = phoneUtils.toE164(customerData.phone);
    }
    return api.patch(`/customers/${id}`, payload);
  },

  recordRepayment(id, { amount, paymentMethod = 'CASH', notes = '' }) {
    return api.post(`/customers/${id}/repayments`, {
      amount: Math.round(Number(amount)),
      payment_method: paymentMethod,
      ...(notes ? { notes } : {}),
    });
  },

  getWhatsAppReminder(id) {
    return api.get(`/customers/${id}/whatsapp-reminder`);
  },
};

export const suppliersService = {
  getAll() {
    return api.get('/suppliers');
  },

  getById(id) {
    return api.get(`/suppliers/${id}`);
  },

  create(supplierData) {
    return api.post('/suppliers', supplierData);
  },

  recordPayment(id, { amount, paymentMethod = 'CASH', notes = '' }) {
    return api.post(`/suppliers/${id}/payments`, {
      amount: Math.round(Number(amount)),
      payment_method: paymentMethod,
      ...(notes ? { notes } : {}),
    });
  },
};

export const purchasesService = {
  getAll(limit = 50) {
    const qs = limit ? `?limit=${limit}` : '';
    return api.get(`/purchases${qs}`);
  },

  getById(id) {
    return api.get(`/purchases/${id}`);
  },

  create(purchasePayload) {
    return api.post('/purchases', purchasePayload);
  },

  receiveOrder(id) {
    return api.patch(`/purchases/${id}/receive`);
  },
};

export const expensesService = {
  getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.payment_method) query.append('payment_method', params.payment_method);
    if (params.mode) query.append('mode', params.mode);
    if (params.month) query.append('month', String(params.month));
    if (params.year) query.append('year', String(params.year));
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    const qs = query.toString();
    return api.get(`/expenses${qs ? `?${qs}` : ''}`);
  },

  create(expensePayload) {
    const body = {
      amount: Math.round(Number(expensePayload.amount)),
      category: expensePayload.category,
      payment_method: expensePayload.payment_method || expensePayload.paymentMethod || 'CASH',
      mode: expensePayload.mode || expensePayload.payment_method || expensePayload.paymentMethod || 'CASH',
      motif: expensePayload.motif || expensePayload.notes || expensePayload.description || 'Dépense',
      reason: expensePayload.reason || expensePayload.motif || expensePayload.notes || expensePayload.description,
      description: expensePayload.description || expensePayload.motif || expensePayload.notes,
      ...(expensePayload.receiptUrl ? { receipt_url: expensePayload.receiptUrl, receiptUrl: expensePayload.receiptUrl } : {}),
      ...(expensePayload.receipt ? { receipt: expensePayload.receipt } : {}),
      ...(expensePayload.client_op_uuid ? { client_op_uuid: expensePayload.client_op_uuid } : {}),
    };
    return api.post('/expenses', body);
  },

  delete(id) {
    return api.delete(`/expenses/${id}`);
  },
};

export const cashService = {
  getDailyState(date) {
    const qs = date ? `?date=${date}` : '';
    return api.get(`/cash/daily${qs}`);
  },

  getDailySummary(params = {}) {
    const query = new URLSearchParams();
    if (params.date) query.append('date', params.date);
    if (params.openingAmount !== undefined) query.append('openingAmount', String(params.openingAmount));
    if (params.opening_amount !== undefined) query.append('opening_amount', String(params.opening_amount));
    const qs = query.toString();
    return api.get(`/cash/daily-summary${qs ? `?${qs}` : ''}`);
  },

  closeSession(payload) {
    return api.post('/cash/close', payload);
  },

  recordClosure(payload = {}) {
    const body = {
      actual_cash_counted:
        payload.actual_cash_counted !== undefined
          ? Math.round(Number(payload.actual_cash_counted))
          : payload.countedCash !== undefined
            ? Math.round(Number(payload.countedCash))
            : payload.counted_amount !== undefined
              ? Math.round(Number(payload.counted_amount))
              : payload.physical_cash !== undefined
                ? Math.round(Number(payload.physical_cash))
                : 0,
      opening_amount:
        payload.opening_amount !== undefined
          ? Math.round(Number(payload.opening_amount))
          : payload.openingAmount !== undefined
            ? Math.round(Number(payload.openingAmount))
            : undefined,
      notes: payload.notes || payload.comment || payload.explanation || undefined,
      comment: payload.comment || payload.notes || undefined,
      date: payload.date || undefined,
      client_op_uuid: payload.client_op_uuid || undefined,
    };
    return api.post('/cash/closure', body);
  },

  getClosuresHistory(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    const qs = query.toString();
    return api.get(`/cash/closures${qs ? `?${qs}` : ''}`);
  },
};

export const publicShopService = {
  getShop(slug) {
    return api.get(`/public/shop/${slug}`, { isPublic: true });
  },

  getBySlug(slug) {
    return api.get(`/public/shop/${slug}`, { isPublic: true });
  },

  getProducts(slug, params = {}) {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', String(params.limit));
    if (params.offset) query.append('offset', String(params.offset));
    if (params.search) query.append('search', params.search);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    const qs = query.toString();
    return api.get(`/public/shop/${slug}/products${qs ? `?${qs}` : ''}`, { isPublic: true });
  },

  getProductById(slug, productId) {
    return api.get(`/public/shop/${slug}/products/${productId}`, { isPublic: true });
  },

  trackVisit(slug, payload = {}) {
    return api.post(`/public/shop/${slug}/track-visit`, payload, { isPublic: true });
  },
};
