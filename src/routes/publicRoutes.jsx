import { Route } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.jsx';
import PublicShopPage from '../pages/public/PublicShopPage.jsx';
import PublicProductDetailPage from '../pages/public/PublicProductDetailPage.jsx';
import PublicReportPage from '../pages/public/PublicReportPage.jsx';

// Placeholders pour les futures pages publiques


export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPage />} />,
  <Route key="shop" path="/shop/:slug" element={<PublicShopPage />} />,
  <Route key="boutique-alias" path="/boutique/:slug" element={<PublicShopPage />} />,
<Route key="shop-product" path="/shop/:slug/product/:id" element={<PublicProductDetailPage />} />,

<Route key="boutique-produit" path="/boutique/:slug/produit/:id" element={<PublicProductDetailPage />} />,

<Route key="report-general" path="/signalement" element={<PublicReportPage />} />,

<Route key="report-shop"  path="/boutique/:slug/signalement"  element={<PublicReportPage />} />,
];
