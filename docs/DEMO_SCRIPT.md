# Script de démonstration (3–5 minutes)

Objectif: démontrer le fonctionnement bout-en-bout (auth Sanctum, inscription, lecture des données publiques, aperçu admin).

Pré-requis
- Backend Laravel (Sail): ./vendor/bin/sail up -d && ./vendor/bin/sail artisan migrate --force && ./vendor/bin/sail artisan db:seed
- Frontend Next.js: npm install && npm run dev
- Navigateur sur http://localhost:3000
- Fichier .env.local (front):
  NEXT_PUBLIC_API_BASE_URL=http://localhost
  NEXT_PUBLIC_API_TIMEOUT=10000

Étapes

1) Page d’accueil
- Ouvrir http://localhost:3000
- Présenter brièvement l’interface (navigation, design, responsive).

2) Authentification Sanctum (SPA)
- Aller sur /auth/register
- Renseigner: prénom, nom, email, mot de passe.
- Valider: la session est créée côté Laravel (cookie HttpOnly). Le header affiche l’utilisateur (initiales/badge).

3) Dashboard (utilisateur connecté)
- Aller sur /dashboard
- Montrer les informations du compte et la cohérence avec /api/auth/me.

4) Inscription d’un pèlerin (publique)
- Aller sur /inscription
- Remplir les 3 étapes (validations visibles, messages d’erreurs si saisies invalides).
- Soumettre: message de succès + remise à zéro du formulaire.
- Expliquer que les données sont stockées côté Laravel (table pilgrims).

5) Notifications (public)
- Aller sur /notifications
- Montrer la liste et la récupération depuis GET /api/notifications.

6) Points d’intérêt (public)
- Aller sur /points-interet
- Montrer la liste des lieux et catégories.

7) (Optionnel) Espace admin
- Se connecter en tant qu’admin (un email listé dans ADMIN_EMAILS du .env backend).
- Aller sur /admin
- Présenter sommairement la gestion: utilisateurs, pèlerins, notifications, points d’intérêt.
- Insister: toutes créations/modifications/suppressions passent par l’API protégée par Sanctum (auth:sanctum).

8) Déploiement et variables d’environnement (bref)
- Mentionner Render (backend) + Vercel (frontend).
- Expliquer la cohérence requise entre APP_URL, SESSION_DOMAIN, SANCTUM_STATEFUL_DOMAINS, FRONTEND_URL et NEXT_PUBLIC_API_BASE_URL.

Conclusion
- Rappeler: intégration React/Next ↔ Laravel via Axios (CSRF + cookies), validations front (react-hook-form + zod), endpoints REST, responsive UI, PWA.