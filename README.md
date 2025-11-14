# Taskflow — Frontend

Bienvenue dans le frontend de Taskflow — une petite application React/Vite pour gérer des tâches avec authentification, catégories et mise à jour du statut des tâches.

## 🧭 Aperçu

Taskflow est une application fullstack :
- Backend : Laravel (API REST pour authentification, tâches et catégories)
- Frontend : React + Vite (consomme l'API, UI pour CRUD tâches, catégories et tableaux de bord)

Ce README décrit comment installer et démarrer la partie frontend et donne les indications nécessaires pour la connecter au backend Laravel.

## ⚙️ Prérequis

- Node.js (>= 18)
- npm ou yarn
- Git (optionnel)
- Backend en cours d'exécution (Laravel) sur http://localhost:8000 (par défaut)

Si vous devez démarrer aussi le backend Laravel, ouvrez un autre terminal et suivez les instructions dans `../taskflow-backend/README.md`.

## Installation (frontend)

1. Ouvrez un terminal (PowerShell recommandé) et placez-vous dans le dossier frontend :

```powershell
cd "c:\Users\Computer Lab\Pictures\dclic\Semaine 5\taskflow\taskflow-frontend"
```

2. Installez les dépendances :

```powershell
npm install
```

3. Démarrez le serveur de développement Vite :

```powershell
npm run dev
```

Le frontend devrait alors être accessible par défaut sur http://localhost:5173 (ou l'adresse affichée dans la console Vite).

## 🧩 Configuration de l'API

Le frontend consomme l'API Laravel sur `http://localhost:8000/api` par défaut. Si vous exécutez le backend sur une autre URL, modifiez la constante `API_BASE_URL` dans :

```
src/services/api.js
```

Remplacez l'URL par votre endpoint comme `http://127.0.0.1:8000/api` ou utilisez un proxy si vous avez besoin d'un développement plus avancé.

## Commandes utiles
- `npm run dev` — Lance le serveur de développement.
- `npm run build` — Compile le frontend pour la production.
- `npm run preview` — Prévisualise la build de production.
- `npm run lint` — Vérifie le code avec ESLint.

## Backend de développement (rappel)

Si vous n'avez pas encore initialisé le backend Laravel, rendez-vous dans le dossier `taskflow-backend` puis :

```powershell
cd "..\taskflow-backend"
composer install
cp .env.example .env; # ou Copy-Item .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Assurez-vous de configurer la base de données dans `.env` (MySQL, sqlite, etc.) avant de lancer `migrate`.

## Fonctionnalités principales

- Authentification (login / registration)
- Gestion des tâches (CRUD) + statut
- Gestion des catégories
- Tableau de bord et graphiques (Recharts)

## 🔒 Gestion des tokens

Le frontend utilise le localStorage pour stocker `auth_token`. Les intercepteurs Axios présents dans `src/services/api.js` ajoutent automatiquement le token aux requêtes et redirigent vers `/login` en cas de 401.

## 🧪 Tests

Le projet contient des scripts ESLint. Des tests front-end ne sont pas inclus par défaut (vous pouvez ajouter Jest/Testing Library). Pour lint :

```powershell
npm run lint
```

## Contributions

Contributions bienvenues — créez une branche, faites vos changements et ouvrez une pull request.

## Licence

Ce projet est distribué sous licence MIT (vérifiez le fichier `LICENSE` au besoin).
