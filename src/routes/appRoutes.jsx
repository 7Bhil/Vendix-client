import { Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.jsx';

import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import NewSalePage from '../pages/sales/NewSalePage.jsx';
import ProductListPage from '../pages/products/ProductListPage.jsx';
import NewProductPage from '../pages/products/NewProductPage.jsx';
import CustomerListPage from '../pages/customers/CustomerListPage.jsx';
import CustomerDetailPage from '../pages/customers/CustomerDetailPage.jsx';
import NewCustomerPage from '../pages/customers/NewCustomerPage.jsx';

// Modules réservés aux 4 collaborateurs de l'équipe
import StockListPage from '../pages/stock/StockListPage.jsx';
import StockMovementsPage from '../pages/stock/StockMovementsPage.jsx';
import ExpensesListPage from '../pages/expenses/ExpensesListPage.jsx';
import SupplierListPage from '../pages/suppliers/SupplierListPage.jsx';
import CashClosurePage from '../pages/cash/CashClosurePage.jsx';
import NewExpensePage from '../pages/expenses/NewExpensePage.jsx';

function withLayout(Component) {
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

export const appRoutes = [
  // 1. Tableau de bord
  <Route key="dashboard" path="/app/dashboard" element={withLayout(DashboardPage)} />,

  // 2. Caisse & Ventes (POS)
  <Route key="sales-new" path="/app/sales/new" element={withLayout(NewSalePage)} />,

  // 3. Produits & Catalogue
  <Route key="products-list" path="/app/products" element={withLayout(ProductListPage)} />,
  <Route key="products-alias" path="/app/produits" element={<Navigate to="/app/products" replace />} />,
  <Route key="products-new" path="/app/products/new" element={withLayout(NewProductPage)} />,
  <Route key="products-edit-fr" path="/app/products/:id/modifier" element={withLayout(NewProductPage)} />,
  <Route key="products-edit-en" path="/app/products/:id/edit" element={withLayout(NewProductPage)} />,

  // 4. Clients & Dettes
  <Route key="customers-list" path="/app/customers" element={withLayout(CustomerListPage)} />,
  <Route key="customers-new" path="/app/customers/new" element={withLayout(NewCustomerPage)} />,
  <Route key="customers-detail" path="/app/customers/:id" element={withLayout(CustomerDetailPage)} />,

  // =========================================================================
  // 5. Modules des 4 collaborateurs (Chacun travaille dans sa page dédiée)
  // =========================================================================
  // Collaborateur 1 : Stock & Mouvements (feature/stock-management)
  <Route key="collab-stock" path="/app/stock" element={withLayout(StockListPage)} />,
  <Route key="collab-stock-movements" path="/app/stock/movements" element={withLayout(StockMovementsPage)} />,

  // Collaborateur 2 : Dépenses & Frais (feature/expenses-tracking)
<Route
  key="collab-expenses" path="/app/expenses" element={withLayout(ExpensesListPage)}/>,

<Route
  key="collab-expenses-new" path="/app/expenses/new" element={withLayout(NewExpensePage)}/>,

  // Collaborateur 3 : Fournisseurs & Achats (feature/suppliers-purchases)
  <Route key="collab-suppliers" path="/app/suppliers" element={withLayout(SupplierListPage)} />,

  // Collaborateur 4 : Clôture de Caisse & Rapports (feature/cash-and-reports)
  <Route key="collab-cash" path="/app/cash-closure" element={withLayout(CashClosurePage)} />,
  <Route
    key="collab-reports"
    path="/app/reports"
    element={withLayout(() => <CashClosurePage reportsOnly />)}
  />,
];
