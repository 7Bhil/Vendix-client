/**
 * Détecte si la requête provient d'un sous-domaine de boutique publique
 * Exemple : "dossou.vendix.com" => "dossou"
 * Exemple : "mon-commerce.localhost:5173" => "mon-commerce"
 * Ne prend pas en compte : "www", "app", "admin", "api", "localhost", "vendix.com"
 */
export function getShopSubdomain(hostname = window.location.hostname) {
  if (!hostname) return null;

  // Localhost test (ex: "dossou.localhost")
  if (hostname.endsWith(".localhost") || (hostname.includes("localhost") && hostname !== "localhost")) {
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[0] !== "www" && parts[0] !== "app") {
      return parts[0];
    }
  }

  // Domaine en production (ex: "dossou.vendix.com")
  const parts = hostname.split(".");
  // Un sous-domaine sur un domaine comme "vendix.com" a au moins 3 parties (ex: ["dossou", "vendix", "com"])
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    const reserved = ["www", "app", "admin", "api", "staging", "dev", "mail"];
    if (!reserved.includes(sub)) {
      return sub;
    }
  }

  return null;
}
