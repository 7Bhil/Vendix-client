import { Route } from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage.jsx';
import PublicShopPage from '../pages/public/PublicShopPage.jsx';

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPage />} />,
  <Route key="shop" path="/shop/:slug" element={<PublicShopPage />} />,
  <Route key="boutique-alias" path="/boutique/:slug" element={<PublicShopPage />} />,
];
