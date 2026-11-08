const DEFAULT_BASE_URL = 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || DEFAULT_BASE_URL;
  }

  getAccessToken() {
    return localStorage.getItem('vendix_access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('vendix_refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('vendix_access_token', accessToken);
    if (refreshToken) localStorage.setItem('vendix_refresh_token', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('vendix_access_token');
    localStorage.removeItem('vendix_refresh_token');
    localStorage.removeItem('vendix_active_user');
  }

  getActiveCommerceId() {
    return localStorage.getItem('vendix_active_commerce_id');
  }

  setActiveCommerceId(commerceId) {
    if (commerceId) {
      localStorage.setItem('vendix_active_commerce_id', commerceId);
    } else {
      localStorage.removeItem('vendix_active_commerce_id');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const commerceId = this.getActiveCommerceId();
    if (commerceId) {
      headers['x-commerce-id'] = commerceId;
    }

    const config = {
      ...options,
      headers,
    };

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkError) {
      const err = new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      err.isNetworkError = true;
      throw err;
    }

    // Gestion de l'expiration du token (401)
    if (response.status === 401 && !options._retry && this.getRefreshToken()) {
      options._retry = true;
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
        return fetch(url, { ...options, headers }).then((res) => this.handleResponse(res));
      } else {
        this.clearTokens();
      }
    }

    return this.handleResponse(response);
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;
      const data = await response.json();
      if (data?.access_token) {
        this.setTokens(data.access_token, data.refresh_token || refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async handleResponse(response) {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue.';
      if (data && typeof data === 'object') {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(' | ');
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
