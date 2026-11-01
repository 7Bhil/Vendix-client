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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Flow */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Merchant Workspace */}
        <Route path="/app/dashboard" element={<DashboardPage />} />

        {/* Quick Actions */}
        <Route path="/app/sales/new" element={<NewSalePage />} />
        <Route path="/app/products/new" element={<NewProductPage />} />
        <Route path="/app/customers/new" element={<NewCustomerPage />} />

        {/* Customers & Debt Tracking */}
        <Route path="/app/customers" element={<CustomerListPage />} />
        <Route path="/app/customers/:id" element={<CustomerDetailPage />} />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
