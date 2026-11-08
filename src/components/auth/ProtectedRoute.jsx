import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Garde de sécurité pour les routes de l'espace Commerçant et Administrateur.
 * - Vérifie la présence d'une session active via useAuth().
 * - Cloisonne les rôles (ex: empêche un simple MERCHANT d'accéder à requiredRole='ADMIN').
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Pendant l'initialisation du contexte auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-vendix-brand border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  // 1. Redirection si non authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cloisonnement strict des rôles (Anti-usurpation d'espace)
  if (requiredRole) {
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
  }

  return children;
}
