import { Navigate, useLocation } from 'react-router-dom';

/**
 * Garde de sécurité pour les routes de l'espace Commerçant et Administrateur.
 * - Vérifie la présence d'une session active.
 * - Cloisonne les rôles (ex: empêche un simple MERCHANT d'accéder à requiredRole='ADMIN').
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const token = localStorage.getItem('vendix_access_token');
  const userRaw = localStorage.getItem('vendix_active_user');

  // 1. Redirection si non authentifié
  if (!token && !userRaw) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // 2. Cloisonnement strict des rôles (Anti-usurpation d'espace)
  if (requiredRole && userRaw) {
    try {
      const user = JSON.parse(userRaw);
      const userRole = String(user?.role || '').toUpperCase();
      const expectedRole = String(requiredRole).toUpperCase();

      if (userRole !== expectedRole) {
        // Si un commerçant tente d'accéder à l'espace ADMIN, redirection vers son dashboard
        if (expectedRole === 'ADMIN') {
          return <Navigate to="/app/dashboard" replace />;
        }
        // Si un admin sans commerce tente d'accéder à la caisse marchande, redirection admin
        if (expectedRole === 'MERCHANT' && userRole === 'ADMIN') {
          return <Navigate to="/admin" replace />;
        }
      }
    } catch {
      // Données corrompues, retour à la connexion
      localStorage.removeItem('vendix_active_user');
      localStorage.removeItem('vendix_access_token');
      return <Navigate to="/connexion" replace />;
    }
  }

  return children;
}
