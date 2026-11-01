import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/landing/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import NewSalePage from './pages/sales/NewSalePage.jsx';
import NewProductPage from './pages/products/NewProductPage.jsx';
import NewCustomerPage from './pages/customers/NewCustomerPage.jsx';
import CustomerListPage from './pages/customers/CustomerListPage.jsx';
import CustomerDetailPage from './pages/customers/CustomerDetailPage.jsx';
import PublicShopPage from './pages/public/PublicShopPage.jsx';
import StockListPage from './pages/stock/StockListPage.jsx';
import ExpensesListPage from './pages/expenses/ExpensesListPage.jsx';
import SupplierListPage from './pages/suppliers/SupplierListPage.jsx';
import CashClosurePage from './pages/cash/CashClosurePage.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import { getShopSubdomain } from './utils/subdomainUtils.js';

export default function App() {
  // Détection du sous-domaine de boutique publique (ex: "dossou.vendix.com")
  const shopSubdomain = getShopSubdomain();

  if (shopSubdomain) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicShopPage shopSlug={shopSubdomain} />} />
          <Route path="/product/:id" element={<PublicShopPage shopSlug={shopSubdomain} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing publique & Boutique */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop/:slug" element={<PublicShopPage />} />
        <Route path="/boutique/:slug" element={<PublicShopPage />} />

        {/* Authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Espace Marchand partagé */}
        <Route
          path="/app/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/sales/new"
          element={
            <AppLayout>
              <NewSalePage />
            </AppLayout>
          }
        />
        <Route
          path="/app/products/new"
          element={
            <AppLayout>
              <NewProductPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/customers/new"
          element={
            <AppLayout>
              <NewCustomerPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/customers"
          element={
            <AppLayout>
              <CustomerListPage />
            </AppLayout>
          }
        />
        <Route
          path="/app/customers/:id"
          element={
            <AppLayout>
              <CustomerDetailPage />
            </AppLayout>
          }
        />

        {/* Routes réservées aux 4 fonctionnalités de la semaine */}
        {/* 1. Collaborateur 1 : Stock */}
        <Route
          path="/app/stock"
          element={
            <AppLayout>
              <StockListPage />
            </AppLayout>
          }
        />

        {/* 2. Collaborateur 2 : Dépenses */}
        <Route
          path="/app/expenses"
          element={
            <AppLayout>
              <ExpensesListPage />
            </AppLayout>
          }
        />

        {/* 3. Collaborateur 3 : Fournisseurs */}
        <Route
          path="/app/suppliers"
          element={
            <AppLayout>
              <SupplierListPage />
            </AppLayout>
          }
        />

        {/* 4. Collaborateur 4 : Clôture de Caisse */}
        <Route
          path="/app/cash-closure"
          element={
            <AppLayout>
              <CashClosurePage />
            </AppLayout>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
