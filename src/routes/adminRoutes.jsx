import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';

// Placeholders en attendant l'implémentation complète par le collaborateur assigné
export function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900">Administration — Supervision</h1>
      <p className="text-xs text-slate-500 mt-1">Tableau de bord de supervision de la plateforme Vendix.</p>
    </div>
  );
}

export function AdminMerchantsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900">Administration — Commerçants</h1>
      <p className="text-xs text-slate-500 mt-1">Gestion et suspension des comptes marchands.</p>
    </div>
  );
}

export function AdminReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900">Administration — Signalements</h1>
      <p className="text-xs text-slate-500 mt-1">Traitement des litiges et signalements d'abus citoyens.</p>
    </div>
  );
}

function withAdmin(Component) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Component />
    </ProtectedRoute>
  );
}

export const adminRoutes = [
  <Route key="admin-dashboard" path="/admin" element={withAdmin(AdminDashboardPage)} />,
  <Route key="admin-merchants" path="/admin/commercants" element={withAdmin(AdminMerchantsPage)} />,
  <Route key="admin-reports" path="/admin/signalements" element={withAdmin(AdminReportsPage)} />,
  <Route key="admin-fallback" path="/admin/*" element={<Navigate to="/admin" replace />} />,
];
