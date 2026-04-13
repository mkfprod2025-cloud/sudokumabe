# 🧩 Sudokumabe - Infinium Sudoku Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/mkfprod2025-cloud/sudokumabe/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mkfprod2025-cloud/sudokumabe/actions)

**Sudokumabe** est un moteur de Sudoku à génération procédurale infinie conçu pour la compétition asynchrone.

## 🚀 Fonctionnalités Clés
- **Génération Infinie** : Algorithme procédural calibré sur l'échelle **Sudoku Explainer (SE 1.0 à 11.9)**.
- **Rating Elo** : Système de classement compétitif dynamique (1000 à 2800+).
- **Tournois Asynchrones** : Compétition par 'buckets' de 50 joueurs avec gestion de 'Seed' temporelle.
- **Score Dynamique** : `Score = (Grid Points * Reference Time) / Player Time`.
- **UI Customization** : Personnalisation visuelle totale (fonds d'écran locaux, réglage d'opacité).

## 🛠️ Stack Technique
- **Backend** : Node.js, TypeScript, Express.
- **Frontend** : Vite, Vanilla TS, Tailwind CSS.
- **Database** : MongoDB / PostgreSQL (pour les classements).
- **Hosting** : GitHub Pages (Frontend) & Render/Heroku (Backend).

## 📁 Structure du Projet
```
sudoku-infinium/
├── backend/       # API de génération, scoring et gestion Elo
└── frontend/      # Interface de jeu et personnalisation
```

## ⚙️ Installation & Développement
1. Cloner le repo : `git clone https://github.com/mkfprod2025-cloud/sudokumabe.git`
2. Backend : `cd backend && npm install && npm run dev`
3. Frontend : `cd frontend && npm install && npm run dev`

---
*Projet propulsé par MKFprod - 2026*
