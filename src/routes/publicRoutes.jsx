import { Route } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.jsx';
import PublicShopPage from '../pages/public/PublicShopPage.jsx';

// Placeholders pour les futures pages publiques
export function PublicProductDetailPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-900">Détail du produit</h1>
      <p className="text-xs text-slate-500 mt-1">Fiche publique de l'article avec commande directe WhatsApp.</p>
    </div>
  );
}

export function PublicReportPage() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-slate-900">Signaler un abus ou litige</h1>
      <p className="text-xs text-slate-500 mt-1">Formulaire citoyen de signalement anti-fraude.</p>
    </div>
  );
}

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPage />} />,
  <Route key="shop" path="/shop/:slug" element={<PublicShopPage />} />,
  <Route key="boutique-alias" path="/boutique/:slug" element={<PublicShopPage />} />,
  <Route key="shop-product" path="/shop/:slug/product/:id" element={<PublicProductDetailPage />} />,
  <Route key="boutique-produit" path="/boutique/:slug/produit/:id" element={<PublicProductDetailPage />} />,
  <Route key="report-general" path="/signalement" element={<PublicReportPage />} />,
  <Route key="report-shop" path="/boutique/:slug/signalement" element={<PublicReportPage />} />,
];
