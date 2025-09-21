# 🕌 MbekteMi - Application Communautaire

<div align="center">

![MbekteMi Logo](public/icon.jpg)

**Application web progressive pour la communauté Mouride lors du Magal de Touba**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge)](https://web.dev/progressive-web-apps/)

[🌐 Demo Live](https://mbektemi.vercel.app) • [📱 Télécharger PWA](#installation) • [📖 Documentation](#documentation)

</div>

---

## 📋 Table des Matières

- [🎯 À Propos](#-à-propos)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Technologies](#-technologies)
- [📱 Installation](#-installation)
- [🛠️ Développement](#️-développement)
- [🎨 Design System](#-design-system)
- [📊 Architecture](#-architecture)
- [🔐 Authentification](#-authentification)
- [🌐 API](#-api)
- [📱 PWA Features](#-pwa-features)
- [🎯 SEO & Performance](#-seo--performance)
- [🤝 Contribution](#-contribution)
- [📞 Contact](#-contact)
- [📄 Licence](#-licence)

---

## 🎯 À Propos

**MbekteMi** est une application web progressive moderne conçue spécialement pour accompagner la communauté Mouride lors du Magal de Touba. Cette application offre une expérience utilisateur exceptionnelle avec des fonctionnalités essentielles pour les pèlerins.

### 🌟 Mission

Faciliter l'expérience spirituelle des pèlerins en fournissant un accès rapide et intuitif aux informations essentielles du Magal de Touba, tout en créant un lien numérique fort au sein de la communauté Mouride.

### 🎯 Objectifs

- **Accessibilité** : Interface multilingue (Français/Wolof) et responsive
- **Performance** : Application PWA ultra-rapide, fonctionnant hors ligne
- **Communauté** : Rassembler les pèlerins dans un espace numérique unifié
- **Spiritualité** : Respecter et valoriser les traditions religieuses

---

## ✨ Fonctionnalités

### 🕐 **Horaires des Prières**
- Horaires précis des 5 prières quotidiennes
- Calendrier des événements spirituels
- Notifications personnalisables
- Synchronisation automatique avec l'heure locale

### 👥 **Inscription Pèlerin**
- Formulaire d'inscription sécurisé et intuitif
- Validation en temps réel des données
- Suivi du statut d'inscription

### 🔔 **Système de Notifications**
- Annonces officielles du Magal
- Alertes et informations importantes
- Affichage responsive

### 🗺️ **Points d'Intérêt**
- Liste des lieux clés (mosquées, santé, transport, restauration, hébergement)
- Informations pratiques (horaires d'ouverture, adresse, téléphone)

### 👨‍💼 **Interface Administrateur**
- Accès protégé (auth Sanctum)
- Gestion des inscriptions, notifications, points d'intérêt (via API)

---

## 🚀 Technologies

### **Frontend**
- **Next.js 14.2.16** - App Router (React 18)
- **TypeScript** - Typage strict
- **Tailwind CSS v4** + **shadcn/ui**
- **Axios** - Communication HTTP (exigence académique)

### **Backend**
- **Laravel** (API REST)
- **Sanctum** - Authentification cookie (SPA)
- **Eloquent** - ORM, migrations & seeders

### **PWA & Performance**
- **Service Worker** custom
- **Web App Manifest**
- **Vercel Analytics**

---

## 📱 Installation

### **Installation PWA (Recommandée)**

1. **Sur Mobile (iOS/Android)**
   - Ouvrez [mbektemi.vercel.app](https://mbektemi.vercel.app) dans Safari/Chrome
   - Appuyez sur "Partager" → "Ajouter à l'écran d'accueil"
   - L'application s'installe comme une app native

2. **Sur Desktop (Chrome/Edge)**
   - Visitez [mbektemi.vercel.app](https://mbektemi.vercel.app)
   - Cliquez sur l'icône d'installation dans la barre d'adresse
   - Suivez les instructions d'installation

### **Installation pour Développement**

\`\`\`bash
# Cloner le repository
git clone https://github.com/quantiksense/mbektemi.git
cd mbektemi

# Installer les dépendances
pnpm install # ou npm install / yarn install

# Lancer le serveur de développement
pnpm dev     # ou npm run dev / yarn dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Développement

### **Scripts Disponibles**

\`\`\`bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # ESLint
\`\`\`

### **Structure du Projet**

\`\`\`
mbektemi/
├── app/                    # App Router (Next.js)
├── components/             # Composants réutilisables (shadcn/ui)
├── contexts/               # Contextes React (auth)
├── lib/                    # Axios HTTP client, config, services
├── mbektemi-api/           # Backend Laravel (API REST)
├── public/                 # Assets statiques, manifest, sw.js
└── styles/                 # Tailwind v4 & thèmes
\`\`\`

### **Variables d'Environnement**

Frontend `.env.local` :
\`\`\`env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
NEXT_PUBLIC_API_TIMEOUT="10000"
\`\`\`

Backend Laravel `.env` :
\`\`\`env
APP_URL="http://localhost:8000"
SESSION_DOMAIN="localhost"
SANCTUM_STATEFUL_DOMAINS="localhost:3000,localhost"
\`\`\`

---

## 📊 Architecture

- Frontend React (Next.js) <—Axios—> API Laravel (Sanctum)
- Rendu côté client pour les pages data-driven (horaires, notifications, points d’intérêt)
- Protection /admin côté client et côté API via Sanctum

---

## 🔐 Authentification

- Sanctum SPA cookie (CSRF + credentials)
- Endpoints: POST /api/auth/login, POST /api/auth/register, POST /api/auth/logout, GET /api/auth/me
- Rôle démo: admin si email == admin@mbektemi.sn (sinon pilgrim)

---

## 🌐 API

### **Endpoints Disponibles**

\`\`\`text
# Auth (SPA)
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

# Pèlerins
GET    /api/pilgrims           (protégé)
POST   /api/pilgrims           (public)
PATCH  /api/pilgrims/{id}      (protégé)
DELETE /api/pilgrims/{id}      (protégé)

# Notifications
GET    /api/notifications      (public)
POST   /api/notifications      (protégé)
PUT    /api/notifications/{id} (protégé)
DELETE /api/notifications/{id} (protégé)

# Horaires
GET /api/schedules             (public)

# Points d'intérêt
GET    /api/points-of-interest                 (public)
POST   /api/points-of-interest                 (protégé)
PUT    /api/points-of-interest/{id}            (protégé)
DELETE /api/points-of-interest/{id}            (protégé)
\`\`\`

---

## 📱 PWA Features

- **Installation** (mobile/desktop)
- **Offline** (assets statiques)
- **Responsive** (mobile-first)

---

## 🎯 SEO & Performance

- Métadonnées, Open Graph, manifest
- Tailwind + shadcn/ui
- Optimisations visuelles (animations, gradients)

---

## 🤝 Contribution

- GitHub flow (branche, PR)
- Respect des conventions de code
- Documentation à jour

---

## 📞 Contact

**QuantikSense** - Développement et Maintenance
- 📧 [quantiksense@gmail.com](mailto:quantiksense@gmail.com)
- 📱 +221 78 478 28 50
- 🌐 https://quantiksense.com

---

## 📄 Licence

Sous licence **MIT**.

<div align="center">

**Fait avec ❤️ pour la communauté Mouride**

[⬆️ Retour en haut](#-mbektemi---application-communautaire)

*MbekteMi - Connecter la spiritualité à la technologie moderne*

</div>
