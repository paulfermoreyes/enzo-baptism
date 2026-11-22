# Enzo Baptism (`enzo-baptism`)

Welcome to the TechDocs documentation for **Enzo Baptism**, a static React 19 + TypeScript + Vite web application backed by Firebase (Cloud Firestore & Google Sign-In) and deployed to GitHub Pages via an approval-gated GitHub Actions pipeline.

## Quick Facts

| Attribute | Value |
| --- | --- |
| **Owner** | `platform-team` (`@paulfermoreyes`) |
| **Lifecycle** | `production` |
| **Golden Path** | `react-firebase-spa` |
| **Hosting** | GitHub Pages (`github-pages` approval environment) |
| **Backend** | Firebase `enzo-baptism-2027` (`asia-southeast1`) |
| **CI/CD** | `.github/workflows/ci.yml` (PR gate) & `.github/workflows/deploy.yml` (Prod deploy) |

## Local Development

```bash
npm ci
cp .env.example .env   # Fill in Firebase web config
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
