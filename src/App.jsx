
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx'
import DemarragePage from './pages/auth/DemarragePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/connexion" replace />} />

        <Route path="/connexion" element={<LoginPage />} />

        <Route path="/inscription" element={<SignupPage />} />
        <Route
  path="/demarrage"
  element={<DemarragePage />}
/>

        <Route
          path="*"
          element={<Navigate to="/connexion" replace />}
        />

        <Route
  path="/recuperation-compte"
  element={<ForgotPasswordPage />}
/>

<Route
  path="/reinitialiser-mot-de-passe"
  element={<ResetPasswordPage />}
/>
      </Routes>

      
    </BrowserRouter>
  )
}
