import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/landing/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import NewSalePage from './pages/sales/NewSalePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<LandingPage />} />

        {/* Parcours d'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Alias rétrocompatibles */}
        <Route path="/connexion" element={<Navigate to="/login" replace />} />
        <Route path="/inscription" element={<Navigate to="/signup" replace />} />
        <Route path="/demarrage" element={<Navigate to="/onboarding" replace />} />
        <Route path="/recuperation-compte" element={<Navigate to="/forgot-password" replace />} />
        <Route path="/reinitialiser-mot-de-passe" element={<Navigate to="/reset-password" replace />} />

        {/* Espace Commerçant après connexion */}
        <Route path="/app/dashboard" element={<DashboardPage />} />
        <Route path="/app/tableau-de-bord" element={<Navigate to="/app/dashboard" replace />} />
        {/* Espace Commerçant */}
        <Route path="/app/dashboard" element={<DashboardPage />} />

        {/* Page Nouvelle vente */}
        <Route path="/app/nouvelle-vente" element={<NewSalePage />} />

        <Route
          path="/app/tableau-de-bord"
          element={<Navigate to="/app/dashboard" replace />}
        />

        {/* Redirection par défaut si route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
