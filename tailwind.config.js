/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Institutionnelle Vendix (Landing page, Login, Signup, Admin)
        vendix: {
          brand: '#1e40af',       // Bleu banque profond (Confiance, Sécurité)
          'brand-dark': '#1e3a8a',
          accent: '#f59e0b',      // Ambre marchand (Commerce, Prospérité)
          whatsapp: '#16a34a',    // Vert WhatsApp officiel (wa.me)
          surface: '#f8fafc',     // Fond ardoise clair reposant
          ink: '#0f172a',         // Texte sombre contrasté (WCAG AA)
        },
        // Palette Dynamique Boutique (Configurée par le vendeur via variables CSS)
        shop: {
          primary: 'var(--shop-primary, #15803d)',
          secondary: 'var(--shop-secondary, #ca8a04)',
        },
      },
    },
  },
  plugins: [],
}
