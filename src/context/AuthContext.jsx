import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client.js';
import { authService } from '../api/services.js';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vendix_active_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  // Synchronisation et initialisation au montage
  useEffect(() => {
    const initialUser = getStoredUser();
    const token = api.getAccessToken();

    if (token && initialUser) {
      setUser(initialUser);
    } else if (!token) {
      setUser(null);
      localStorage.removeItem('vendix_active_user');
    }
    setIsLoading(false);

    // Écoute de l'événement centralisé d'expiration de session
    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener('vendix:session-expired', handleSessionExpired);

    // Écoute des changements de storage multi-onglets
    const handleStorageChange = (e) => {
      if (e.key === 'vendix_active_user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      } else if (e.key === 'vendix_access_token' && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('vendix:session-expired', handleSessionExpired);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      const activeUser = {
        phone: result?.user?.phone || credentials.phone,
        shopName: result?.user?.commerce?.name || 'Ma boutique Vendix',
        role: result?.user?.role || 'MERCHANT',
        id: result?.user?.id,
        commerceId: result?.user?.commerce?.id,
      };

      localStorage.setItem('vendix_active_user', JSON.stringify(activeUser));
      setUser(activeUser);
      return { success: true, user: activeUser, result };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      api.clearTokens();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user && api.getAccessToken()),
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
  }
  return context;
}
