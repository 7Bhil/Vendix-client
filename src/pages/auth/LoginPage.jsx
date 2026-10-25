
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import LoginForm from '../../components/auth/LoginForm.jsx'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bon retour sur Vendix"
      subtitle="Connectez-vous pour gérer votre boutique."
    >
      <LoginForm />
    </AuthLayout>
  )
}
