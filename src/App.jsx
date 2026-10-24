import Navbar from "./components/landing/Navbar.jsx";
import HeroSection from "./components/landing/HeroSection.jsx";
import PainPointsSection from "./components/landing/PainPointsSection.jsx";
import FeaturesSection from "./components/landing/FeaturesSection.jsx";
import HowItWorksSection from "./components/landing/HowItWorksSection.jsx";
import ShopDemoSection from "./components/landing/ShopDemoSection.jsx";
import TestimonialsSection from "./components/landing/TestimonialsSection.jsx";
import FaqSection from "./components/landing/FaqSection.jsx";
import CtaBannerSection from "./components/landing/CtaBannerSection.jsx";
import Footer from "./components/landing/Footer.jsx"

export default function App() {
  return (
    <div className="min-h-screen bg-vendix-surface text-vendix-ink">
      {/* Barre de navigation */}
      <Navbar />

      {/* Section principale de présentation */}
      <HeroSection />

      {/*Section des points de douleurs*/}
      <PainPointsSection />

      {/* Section des fonctionnalités */}
      <FeaturesSection />

      {/*Section de fonctionnement*/}
      <HowItWorksSection />

      {/*Section de démontration de la boutique*/}
      <ShopDemoSection />

      {/*Section de témoignages*/}
       <TestimonialsSection />

      {/*Section de FAQ*/}
      <FaqSection />

      {/*Section de call to action*/}
      <CtaBannerSection />

      {/*Pied de page*/}
       <Footer />

    </div>
  );
}

