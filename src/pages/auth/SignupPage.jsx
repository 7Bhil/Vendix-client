
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import SignupForm from '../../components/auth/SignupForm.jsx'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Créer votre boutique"
      subtitle="Rejoignez Vendix et lancez votre activité."
    >
      <SignupForm />
    </AuthLayout>
  )
}
