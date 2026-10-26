
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm.jsx'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Récupérer votre compte"
      subtitle="Retrouvez l’accès à votre boutique Vendix."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
