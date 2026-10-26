import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingStepper from "../../components/onboarding/OnboardingStepper";
import StoreSetupStep from "../../components/onboarding/StoreSetupStep";
import FirstProductStep from "../../components/onboarding/FirstProductStep";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [step, setStep] = useState(1);
  const [storeData, setStoreData] = useState({
    shopName: user?.shopName || "",
    whatsappPhone: user?.phone || "",
    primaryColor: "#1e40af",
    secondaryColor: "#f59e0b",
  });
  const [productData, setProductData] = useState({
    name: "",
    salePrice: "",
    stockQuantity: "10",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passer directement au tableau de bord
  function handleSkip() {
    navigate("/app/tableau-de-bord");
  }

  // Étape 1 validée
  function handleStoreNext(data) {
    setStoreData(data);
    setStep(2);
  }

  // Étape 2 validée -> finalisation
  function handleProductSubmit(data) {
    setProductData(data);
    setIsSubmitting(true);

    // Persistance locale des réglages de boutique & injection CSS
    try {
      const vendixProfile = {
        store: storeData,
        firstProduct: data,
        setupCompletedAt: new Date().toISOString(),
      };
      localStorage.setItem("vendix_store_config", JSON.stringify(vendixProfile));
      document.documentElement.style.setProperty("--shop-primary", storeData.primaryColor);
      document.documentElement.style.setProperty("--shop-secondary", storeData.secondaryColor);
    } catch {
      // Pas de blocage si localStorage indisponible
    }

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/app/tableau-de-bord");
    }, 400);
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-vendix-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg">
        {/* En-tête avec marque */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-vendix-brand text-xl font-bold text-white shadow-md">
            V
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-vendix-ink sm:text-3xl">
            {step === 1 ? "Configuration de votre boutique" : "Ajout de votre premier article"}
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 sm:text-sm">
            {step === 1
              ? "Préparez votre identité visuelle et votre numéro de contact en 1 minute."
              : "Ajoutez un article pour effectuer votre première simulation de vente."}
          </p>
        </div>

        {/* Boîte principale d'onboarding */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <OnboardingStepper currentStep={step} totalSteps={2} onSkip={handleSkip} />
          </div>

          {step === 1 && (
            <StoreSetupStep
              initialData={storeData}
              onNext={handleStoreNext}
            />
          )}

          {step === 2 && (
            <FirstProductStep
              initialData={productData}
              onPrevious={() => setStep(1)}
              onSubmit={handleProductSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Réassurance de bas de page */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Vous pourrez modifier le nom, les couleurs et vos articles à tout moment depuis les paramètres.
        </p>
      </div>
    </main>
  );
}
