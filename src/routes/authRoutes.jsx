import { Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import OnboardingPage from '../pages/onboarding/OnboardingPage.jsx';

export const authRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="signup" path="/signup" element={<SignupPage />} />,
  <Route key="onboarding" path="/onboarding" element={<OnboardingPage />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgotPasswordPage />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPasswordPage />} />,

  /* Alias rétrocompatibles */
  <Route key="alias-connexion" path="/connexion" element={<Navigate to="/login" replace />} />,
  <Route key="alias-inscription" path="/inscription" element={<Navigate to="/signup" replace />} />,
  <Route key="alias-demarrage" path="/demarrage" element={<Navigate to="/onboarding" replace />} />,
  <Route key="alias-recup" path="/recuperation-compte" element={<Navigate to="/forgot-password" replace />} />,
  <Route key="alias-reset" path="/reinitialiser-mot-de-passe" element={<Navigate to="/reset-password" replace />} />,
];
