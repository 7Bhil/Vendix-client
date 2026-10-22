import Navbar from "./components/landing/Navbar.jsx";
import HeroSection from "./components/landing/HeroSection.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-vendix-surface text-vendix-ink">
      {/* Barre de navigation */}
      <Navbar />

      {/* Section principale de présentation */}
      <HeroSection />
    </div>
  );
}
