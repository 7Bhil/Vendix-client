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
  async register({ phone, password, shopName, emailRecovery, role = 'COMMERCANT' }) {
    const formattedPhone = phoneUtils.toE164(phone);
    const payload = {
      phone: formattedPhone,
      password,
      role,
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

  async getMe() {
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

  delete(id, reassignCategoryId = null) {
    const query = reassignCategoryId ? `?reassignCategoryId=${reassignCategoryId}` : '';
    return api.delete(`/categories/${id}${query}`);
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
