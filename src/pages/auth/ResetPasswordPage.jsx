
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import ResetPasswordForm from '../../components/auth/ResetPasswordForm.jsx'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nouveau mot de passe"
      subtitle="Choisissez un nouveau mot de passe pour retrouver l'accès à votre boutique."
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
