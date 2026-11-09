import { Routes, Route, Navigate } from 'react-router-dom';
import { getShopSubdomain } from '../utils/subdomainUtils.js';
import PublicShopPage from '../pages/public/PublicShopPage.jsx';

import { publicRoutes } from './publicRoutes.jsx';
import { authRoutes } from './authRoutes.jsx';
import { appRoutes } from './appRoutes.jsx';
import { adminRoutes } from './adminRoutes.jsx';

export default function AppRoutes() {
  const shopSubdomain = getShopSubdomain();

  // Mode sous-domaine public dédié (ex: dossou.vendix.com)
  if (shopSubdomain) {
    return (
      <Routes>
        <Route path="/" element={<PublicShopPage shopSlug={shopSubdomain} />} />
        <Route path="/product/:id" element={<PublicShopPage shopSlug={shopSubdomain} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* 1. Routes publiques */}
      {publicRoutes}

      {/* 2. Routes d'authentification */}
      {authRoutes}

      {/* 3. Espace Marchand & Modules de l'équipe */}
      {appRoutes}

      {/* 4. Espace Super-Admin (Supervision Plateforme) */}
      {adminRoutes}

      {/* 5. Redirection de secours */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
