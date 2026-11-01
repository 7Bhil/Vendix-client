# Guide de Répartition des Tâches Hebdomadaires (Front-end)

Ce document formalise les périmètres d'intervention stricts pour les 4 collaborateurs de l'équipe front-end.
**Règle absolue : aucun collaborateur ne doit modifier `App.jsx` ni travailler en dehors de son dossier assigné.**

---

## Collaborateur 1 : Module Stock & Mouvements
- **Branche Git** : `feature/stock-management` (créée depuis `developp`)
- **Dossiers réservés** :
  - `src/pages/stock/`
  - `src/components/stock/`
- **Route déjà configurée** : `/app/stock`
- **Cahier des charges (`projet.md` §7.5 & `front.md` Pages 6 et 7)** :
  1. Afficher la liste des produits avec quantités disponibles et alertes (rouge si stock <= 0, ambre si stock <= seuil d'alerte).
  2. Filtres par catégorie et barre de recherche rapide.
  3. Modal ou bouton d'enregistrement d'un mouvement manuel avec motif obligatoire (*Entrée marchandise, Perte/Casse, Correction physique*).
  4. Historique des mouvements récents.

---

## Collaborateur 2 : Module Dépenses & Charges
- **Branche Git** : `feature/expenses-tracking` (créée depuis `developp`)
- **Dossiers réservés** :
  - `src/pages/expenses/`
  - `src/components/expenses/`
- **Route déjà configurée** : `/app/expenses`
- **Cahier des charges (`projet.md` §7.13 & `front.md` Page 17)** :
  1. Afficher l'historique chronologique des dépenses de la boutique.
  2. Formulaire d'enregistrement : montant en FCFA, date, catégorie (*Transport, Loyer magasin, Électricité, Emballages, Autre*) et mode de règlement (*Espèces, Mobile Money*).
  3. Total cumulé des dépenses du mois.
  4. Conservation locale des dépenses dans `localStorage`.

---

## Collaborateur 3 : Module Fournisseurs & Approvisionnements
- **Branche Git** : `feature/suppliers-purchases` (créée depuis `developp`)
- **Dossiers réservés** :
  - `src/pages/suppliers/`
  - `src/components/suppliers/`
- **Route déjà configurée** : `/app/suppliers`
- **Cahier des charges (`projet.md` §7.6 & `front.md` Pages 9 et 10)** :
  1. Liste des fiches fournisseurs : nom, numéro de contact/WhatsApp, solde restant dû (dette fournisseur).
  2. Fiche détaillée fournisseur avec historique des achats et règlements versés.
  3. Formulaire d'enregistrement d'un achat de stock et d'un acompte versé au fournisseur.

---

## Collaborateur 4 : Module Clôture de Caisse Journalière
- **Branche Git** : `feature/cash-and-reports` (créée depuis `developp`)
- **Dossiers réservés** :
  - `src/pages/cash/`
  - `src/components/cash/`
- **Route déjà configurée** : `/app/cash-closure`
- **Cahier des charges (`projet.md` §7.14 & `front.md` Page 18)** :
  1. Calculer le total théorique attendu de la journée (ventes espèces vs Mobile Money).
  2. Saisie par le commerçant du montant physique réellement constaté dans le tiroir-caisse.
  3. Calcul automatique de l'écart (manquant en rouge, surplus en bleu/vert) avec champ de commentaire explicatif.
  4. Historique des clôtures précédentes.
