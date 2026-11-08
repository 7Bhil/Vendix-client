/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Institutionnelle & Marchande Vendix
        vendix: {
          brand: '#059669',       // Vert émeraude marchand (Prospérité, Vente, Confiance)
          'brand-dark': '#047857',
          'brand-light': '#ecfdf5',
          legacy: '#1e40af',      // Bleu banque préservé pour compatibilité
          accent: '#d97706',      // Ambre marchand chaleureux (Créances, Alertes douces)
          whatsapp: '#16a34a',    // Vert WhatsApp officiel (wa.me)
          surface: '#fcfcfd',     // Fond très légèrement cassé, reposant
          card: '#ffffff',
          border: '#e2e8f0',
          ink: '#0f172a',         // Texte sombre contrasté (WCAG AA)
          muted: '#64748b',
        },
        // Palette Dynamique Boutique (Configurée par le vendeur via variables CSS)
        shop: {
          primary: 'var(--shop-primary, #15803d)',
          secondary: 'var(--shop-secondary, #ca8a04)',
        },
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
      },
    },
  },
  plugins: [],
}
