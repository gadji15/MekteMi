# Déploiement étape par étape (Frontend Vercel + Backend Laravel)

Ce guide vous accompagne pas à pas pour déployer:
- Frontend Next.js sur Vercel
- Backend Laravel (Sanctum SPA) sur Render (ou équivalent)

L’objectif est d’avoir l’authentification cookie-based fonctionnelle (Sanctum) en production.

---

## Étape 0 — Pré-requis

- Un domaine (ex: `mbektemi.sn`)
- Deux sous-domaines:
  - Front: `mbektemi.sn` (ou `www.mbektemi.sn`)
  - API: `api.mbektemi.sn`
- Comptes:
  - GitHub (code)
  - Vercel (front)
  - Render (backend)

---

## Étape 1 — Backend Laravel sur Render

1. Créez un service Web sur Render:
   - Source: votre repo GitHub pointant vers `mbektemi-api/` (monorepo)
   - Build command: `composer install --no-interaction --prefer-dist --no-progress && php artisan key:generate`
   - Start command (exemple PHP-FPM + Caddy/Apache/Nginx selon template) ou utilisez l’image Docker fournie.
   - Base de données: créez une instance gérée (MySQL/PostgreSQL), ou attachez une DB externe.

2. Variables d’environnement Render (production):
   - APP_ENV=production
   - APP_DEBUG=false
   - APP_URL=https://api.mbektemi.sn
   - ADMIN_EMAILS=admin@mbektemi.sn,gadjicheikh15@gmail.com

   - DB_CONNECTION=mysql (ou pgsql)
   - DB_HOST=... (Render DB host)
   - DB_PORT=... (3306 ou 5432)
   - DB_DATABASE=...
   - DB_USERNAME=...
   - DB_PASSWORD=...

   - CACHE_DRIVER=database
   - QUEUE_CONNECTION=database
   - FILESYSTEM_DISK=local

   - SESSION_DRIVER=database
   - SESSION_LIFETIME=120
   - SESSION_ENCRYPT=false
   - SESSION_PATH=/
   - SESSION_DOMAIN=mbektemi.sn
   - SESSION_SECURE_COOKIE=true
   - SESSION_HTTP_ONLY=true
   - SESSION_SAME_SITE=none    # Important pour cookies cross-site
   - SESSION_PARTITIONED_COOKIE=false

   - FRONTEND_URL=https://mbektemi.sn
   - SANCTUM_STATEFUL_DOMAINS=mbektemi.sn,www.mbektemi.sn

3. CORS et Sanctum (déjà présents dans le code):
   - config/cors.php:
     - 'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register']
     - 'allowed_origins' => [env('FRONTEND_URL', 'https://mbektemi.sn')]
     - 'supports_credentials' => true
   - config/sanctum.php:
     - 'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', '...'))
     - 'guard' => ['web']
     - 'middleware' inclut VerifyCsrfToken et EncryptCookies (OK)

4. Migrations et seeds:
   - Exécutez:
     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     ```
   - Vérifiez que la table `sessions` existe:
     - Si besoin: `php artisan session:table && php artisan migrate --force`

---

## Étape 2 — Frontend Next.js sur Vercel

1. Créez un projet Vercel en important le repo GitHub (racine).
2. Variables d’environnement Vercel:
   - NEXT_PUBLIC_API_BASE_URL=https://api.mbektemi.sn
   - NEXT_PUBLIC_API_TIMEOUT=15000
3. Options de build:
   - Framework: Next.js (auto)
   - Build command: `next build` (auto)
   - Output: `.next` (auto)

---

## Étape 3 — DNS

- Front (Vercel):
  - Ajoutez `mbektemi.sn` (et `www.mbektemi.sn`) dans Vercel → Domains.
  - Suivez les instructions DNS (CNAME vers Vercel).

- API (Render):
  - Configurez `api.mbektemi.sn` pour pointer vers Render (CNAME/ALIAS).
  - Assurez HTTPS actif (Let’s Encrypt automatique sur Render).

---

## Étape 4 — Validation production

- Ouvrez `https://mbektemi.sn`
- DevTools → Network:
  - `GET https://api.mbektemi.sn/sanctum/csrf-cookie` → doit renvoyer `Set-Cookie` pour `XSRF-TOKEN` et `laravel_session` avec:
    - `Secure`
    - `SameSite=None`
    - Domaine `api.mbektemi.sn`
- Essayez:
  - Register/Login (POST /api/auth/register /api/auth/login)
  - GET /api/auth/me → 200 (utilisateur connecté)
- Essayez CRUD admin (notifications, POI, schedules) → réponses 200.

---

## Étape 5 — Préviews Vercel (optionnel)

Sanctum SPA ne reconnaît pas les cookies stateful pour des hosts non listés dans `SANCTUM_STATEFUL_DOMAINS`. Pour les URLs preview (ex: `feature-x-yourproject.vercel.app`), vous avez deux options:

1) Travailler sur le domaine principal Vercel (ex: `yourproject.vercel.app`) et le lister dans `SANCTUM_STATEFUL_DOMAINS` (moins flexible).

2) Ajouter un proxy côté Next.js pour rendre les requêtes “same-origin”:
   - Créez une réécriture dans `next.config.js` ou `vercel.json`:
     ```js
     // next.config.js
     module.exports = {
       async rewrites() {
         return [
           {
             source: '/proxy/:path*',
             destination: 'https://api.mbektemi.sn/:path*',
           },
         ]
       },
     }
     ```
   - Puis côté front, utilisez `/proxy/api/auth/*` au lieu de `https://api.mbektemi.sn/api/auth/*` en preview.
   - Avantage: les cookies sont traités comme same-origin sur le domaine Vercel, Sanctum ne voit plus de cross-site.

Si vous souhaitez, je peux intégrer ce proxy automatiquement.

---

## Étape 6 — Conseils de production

- Vérifiez les en-têtes `Set-Cookie` côté API (certains reverse proxies retirent les cookies).
- Assurez `SESSION_SECURE_COOKIE=true` et `SESSION_SAME_SITE=none` en prod.
- Ajustez `FRONTEND_URL` et `SANCTUM_STATEFUL_DOMAINS` avec vos domaines réels.
- Sur Vercel, vous pouvez réactiver l’optimisation d’images si nécessaire.

---

## Étape 7 — CI/CD (déjà ajouté)

Le workflow `.github/workflows/ci.yml` compile et vérifie automatiquement:
- Front: install, lint, type-check, build
- Back: composer install, validate, phpunit (si présent)

---

Besoin d’aide pour une intégration proxy Vercel ou pour ajouter un fichier `next.config.js` prêt à l’emploi ? Dites “oui” et je l’intègre immédiatement.