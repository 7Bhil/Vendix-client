import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import PainPointsSection from "../../components/landing/PainPointsSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import ShopDemoSection from "../../components/landing/ShopDemoSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import FaqSection from "../../components/landing/FaqSection";
import CtaBannerSection from "../../components/landing/CtaBannerSection";
import Footer from "../../components/landing/Footer";


function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ShopDemoSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBannerSection />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
