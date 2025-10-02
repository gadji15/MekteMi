# 🕌 MbekteMi - Application Communautaire

<div align="center">

![MbekteMi Logo](public/icon.jpg)

Application web (Next.js + Laravel) destinée à accompagner la communauté Mouride lors du Magal de Touba.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel)](https://laravel.com/)

</div>

---

## 📋 Sommaire

- [Présentation rapide](#présentation-rapide)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide (local)](#démarrage-rapide-local)
- [Procédure détaillée (local, avec Sail)](#procédure-détaillée-local-avec-sail)
- [Variables d’environnement](#variables-denvironnement)
- [Authentification (Sanctum SPA)](#authentification-sanctum-spa)
- [Endpoints API principaux](#endpoints-api-principaux)
- [Structure du projet](#structure-du-projet)
- [Déploiement Frontend (prod)](#déploiement-frontend-prod)
- [Présentation vidéo / démo](#présentation-vidéo--démo)
- [Dépannage (FAQ)](#dépannage-faq)

---

## Présentation rapide

MbekteMi centralise des informations utiles pour le Magal de Touba:
- Consultation des horaires (prières / programme)
- Formulaire d’inscription des pèlerins
- Notifications officielles
- Points d’intérêt (hébergement, santé, restauration, transport, mosquées)
- Espace admin (gestion basique)

Objectifs pédagogiques: mettre en pratique une intégration réelle React (Next.js) ↔ Laravel via Axios, avec une authentification simple (Sanctum SPA) et une UX responsive.

---

## Fonctionnalités

- Horaires (affichage)
- Inscription pèlerin (formulaire + validation côté client)
- Notifications (chargées depuis l’API; CRUD côté admin)
- Points d’intérêt (liste publique; CRUD côté admin)
- Authentification simple (register/login/logout) avec cookie session

---

## Stack technique

- Frontend: Next.js 14 (App Router), React 18, TypeScript, Tailwind v4, shadcn/ui, Axios
- Backend: Laravel 12 (API REST), Sanctum (SPA), Eloquent (migrations/seeders)
- PWA: manifest + service worker (mode dev/local pris en charge, hors scope pour la note)

---

## Démarrage rapide (local)

Pré-requis:
- WSL (Ubuntu) recommandé sous Windows
- Docker Desktop + intégration WSL
- Node LTS + pnpm (ou npm)
- Git

Commandes (dans WSL):

```bash
# 1) Cloner le projet
git clone https://github.com/gadji15/MekteMi.git
cd MekteMi

# 2) Backend (Laravel + Sail)
cd mbektemi-api
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --force
./vendor/bin/sail artisan db:seed
----------
Puis demarrer Docker DEsktop
# Le backend sert sur http://localhost

# 3) Frontend (Next.js)
cd ..
# 1: Vérifiez Node et npm:
node -v
npm -v
# 2: Si node/npm manquent ou sont anciens, installez Node LTS (voir Option C).
# Installez nvm:
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
# Installez Node LTS récent:
nvm install --lts
node -v
npm -v
# Installez pnpm:
npm install -g pnpm
pnpm -v
# 4: Installez et lancez:
pnpm install   # ou: npm install
pnpm dev       # ou: npm run dev

# 4) Ouvrir le front
# http://localhost:3000
```

Checklist Sanctum locale (après avoir ouvert http://localhost:3000):
- GET http://localhost/sanctum/csrf-cookie → pose les cookies
- POST http://localhost/api/auth/register → 201
- GET http://localhost/api/auth/me → 200 (session active)

---
# ✅ Mise à jour GitHub (push sans blocage)

Pipeline de push recommandé (récap)

À chaque session:
pnpm lint
pnpm type-check
pnpm build
git fetch origin
git rebase origin/main # si vous devez vous synchroniser
git status
git add .
git commit -m "feat/fix: message clair"
git push

Procédure fiable pour pousser vos changements sur GitHub depuis WSL, avec vérifications pour éviter les erreurs (Husky, lint, rebase).

1) Préparer l’environnement Git (une fois)
```bash
git config --global user.name "Gadji"
git config --global user.email "gadjicheikh15.com"
git config --global credential.helper store
# SSH recommandé: assurez-vous que votre clé est chargée
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

2) Installer Node & pnpm dans WSL (pour que Husky puisse lancer les checks)
```bash
# Installez nvm si absent
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
# Installez Node LTS et pnpm
nvm install --lts
npm install -g pnpm
```

3) Vérifier et préparer le push
```bash
# À la racine du projet
pnpm install              # installe les deps (front)
pnpm lint                 # lint
pnpm type-check           # TypeScript
pnpm build                # build local

git status                # vérifier l'état
git add .                 # indexer les changements
git commit -m "feat/fix: votre message clair"
```

4) Se synchroniser avec la branche distante pour éviter les rejets
```bash
git fetch origin
# si besoin, rebase sur main (résoudre les conflits si présents)
git rebase origin/main
# en cas de conflits: éditer → git add . → git rebase --continue
```

5) Push vers GitHub
```bash
git push
# ou première fois / nouvelle branche:
git checkout -b feat/ma-fonctionnalite
git push -u origin feat/ma-fonctionnalite
```

Conseils anti-blocage
- “cannot rebase: unstaged changes”: faites d'abord `git add .` ou `git stash -u`.
- Husky “pnpm not found”: installez Node + pnpm comme ci-dessus.
- Évitez de committer: `.env`, `.env.local`, `node_modules/`, `vendor/`, `.next/`, fichiers temporaires (ex: cookies).
- CRLF/LF en WSL:
```bash
git config core.autocrlf input
```

---

## Procédure détaillée (local, avec Sail)

1) Docker/Sail
- Démarrer les containers:
  ```bash
  cd mbektemi-api
  ./vendor/bin/sail up -d
  ```
- Migrations et seeders:
  ```bash
  ./vendor/bin/sail artisan migrate --force
  ./vendor/bin/sail artisan db:seed
  ```

2) Variables backend (déjà prêtes pour local)
- Fichier `mbektemi-api/.env` (fourni): 
  - APP_URL=http://localhost
  - SESSION_DOMAIN=localhost
  - SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:3000

3) Frontend
- Installer et lancer:
  ```bash
  cd ..
  pnpm install   # ou npm install
  pnpm dev
  ```
- Fichier `.env.local` (fourni):
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost
  NEXT_PUBLIC_API_TIMEOUT=10000
  ```
  Si vous lancez Laravel avec `php artisan serve --port=8000`, utilisez à la place:
  `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

---

## Variables d’environnement

Frontend `.env.local` (local):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost
NEXT_PUBLIC_API_TIMEOUT=10000
# Si artisan serve:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend `mbektemi-api/.env` (local avec Sail):
```env
APP_URL=http://localhost
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:3000
```

---

## Authentification (Sanctum SPA)

Flux:
1) Le front demande le cookie CSRF: `GET /sanctum/csrf-cookie` (avec credentials)
2) Le front envoie le formulaire: `POST /api/auth/register` ou `POST /api/auth/login`
3) La session est stockée côté Laravel; `GET /api/auth/me` renvoie l’utilisateur
4) `POST /api/auth/logout` ferme la session

Rôle admin: par défaut, un email présent dans `ADMIN_EMAILS` (dans `.env` backend) est considéré admin (ex: `admin@mbektemi.sn`, `gadjicheikh15@gmail.com`).

---

## Endpoints API principaux

```text
# Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

# Pèlerins
POST   /api/pilgrims           (public)
GET    /api/pilgrims           (protégé)
PATCH  /api/pilgrims/{id}      (protégé)
DELETE /api/pilgrims/{id}      (protégé)

# Notifications
GET    /api/notifications      (public)
POST   /api/notifications      (protégé)
PUT    /api/notifications/{id} (protégé)
DELETE /api/notifications/{id} (protégé)

# Horaires
GET /api/schedules             (public)

# Points d'intérêt (POI)
GET    /api/points-of-interest
POST   /api/points-of-interest                 (protégé)
PUT    /api/points-of-interest/{id}            (protégé)
DELETE /api/points-of-interest/{id}            (protégé)
```

---

## Structure du projet

```
MekteMi/
├── app/                    # App Router (Next.js)
├── components/             # UI (shadcn/ui), navigation, layout
├── contexts/               # Auth context (React)
├── lib/                    # Axios, api service, types, utils
├── mbektemi-api/           # Backend Laravel (API)
│   ├── app/Http/Controllers
│   ├── app/Models
│   ├── database/migrations
│   └── routes/{api.php,web.php}
├── public/                 # Assets, manifest.json, sw.js
└── styles/                 # Tailwind v4
```

---

## Déploiement Frontend (prod)

Exemple avec Vercel (recommandé pour Next.js):
1. Importer le dépôt GitHub sur Vercel (bouton “New Project”).
2. Build Command: `next build` – Output: `.next` (par défaut).
3. Variables d’environnement (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_API_BASE_URL=https://api.mbektemi.sn`
   - `NEXT_PUBLIC_API_TIMEOUT=10000`
4. Domaines: `mbektemi.sn`, `www.mbektemi.sn` (ajouter les DNS sur Vercel).
5. Côté backend (Render): vérifier `SESSION_DOMAIN=mbektemi.sn`, `SANCTUM_STATEFUL_DOMAINS=mbektemi.sn,www.mbektemi.sn`, `APP_URL=https://api.mbektemi.sn`, `SESSION_SECURE_COOKIE=true`.

Remarque: si vous utilisez un autre hébergeur (Netlify/Render Static), adaptez la configuration, mais conservez l’URL API en HTTPS et les domaines cohérents avec Sanctum.

---

## Présentation vidéo / démo

- Lien vidéo (YouTube/Drive): à compléter par l’étudiant(e)
- Scénario de démo suggéré (3–5 minutes):
  1) Inscription publique d’un pèlerin (validation front + retour serveur)
  2) Connexion admin → gestion des pèlerins (changement de statut)
  3) CRUD Notifications et Points d’intérêt dans l’admin
  4) Pages publiques: notifications, points d’intérêt, horaires
  5) Rappels sur l’architecture et l’authentification Sanctum

---

## Dépannage (FAQ)

- Le front affiche `ERR_CONNECTION_REFUSED`:
  - Vérifiez que Sail est démarré (`./vendor/bin/sail up -d`)
  - Vérifiez que `NEXT_PUBLIC_API_BASE_URL` pointe bien sur http://localhost (ou :8000 si artisan)
  - Redémarrez `pnpm dev`

- `CSRF token mismatch (419)`:
  - Vérifiez dans `mbektemi-api/.env`: `SESSION_DOMAIN=localhost`, `SANCTUM_STATEFUL_DOMAINS` inclut `localhost:3000`
  - Lancez `./vendor/bin/sail artisan config:clear`
  - Rechargez la page et réessayez

- `GET /api/auth/me` renvoie 401 au premier chargement:
  - Normal si non connecté. Après `register` ou `login`, l’appel renverra 200.

- Favicon 404 en dev:
  - Non bloquant. Ajoutez un favicon dans `public/favicon.ico` si besoin.

---

Ce document explique comment cloner, configurer et démarrer le projet en local, ainsi que l’architecture, les variables d’environnement et le flux d’authentification. Il est rédigé pour qu’un autre développeur puisse lancer l’application rapidement dans les mêmes conditions locales.
