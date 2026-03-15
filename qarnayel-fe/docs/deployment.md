# Deployment Guide

## Overview

The public website is deployed on **Vercel**. There are two deployments: **staging** and **production**, both connected to the **same Firebase project** but targeting different Firestore databases (`staging` named database vs the default).

---

## Recommended hosting: Vercel

Vercel is the recommended host because it has native Next.js support, built-in ISR/on-demand revalidation, and per-environment variable management.

Alternative hosts (Netlify, AWS, self-hosted) are viable but require additional configuration for ISR.

---

## Vercel project setup

1. Go to [https://vercel.com](https://vercel.com) and create a new project
2. Import the `qarnayel-fe` GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave blank (project root)
5. Build command: `npm run build` (default)
6. Output directory: `.next` (default)

---

## Branch-to-environment mapping

| Branch | Vercel environment | Firebase project | Firestore database |
|---|---|---|---|
| `main` | Production | `qarnayel` (shared) | `(default)` |
| `staging` | Preview / Staging | `qarnayel` (shared) | `staging` |
| `feature/*` | Preview | `qarnayel` (shared) | `staging` |

Set up **branch-specific environment variables** in Vercel:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable, choosing which environments it applies to
3. Firebase credentials (`NEXT_PUBLIC_FIREBASE_*`) are the same across all environments
4. Only `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` differ

---

## Environment variables on Vercel

Set all variables from `.env.example` in Vercel's UI.

Firebase credentials are identical across scopes — only app-level variables differ:

**Production scope:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=<shared value>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qarnayel
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qarnayel.appspot.com
NEXT_PUBLIC_SITE_URL=https://qarnayel.lb
NEXT_PUBLIC_APP_ENV=production
# NEXT_PUBLIC_FIRESTORE_DATABASE_ID not set (uses default database)
...
```

**Preview/Staging scope:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=<shared value>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qarnayel
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qarnayel.appspot.com
NEXT_PUBLIC_SITE_URL=https://staging.qarnayel.lb
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging
...
```

---

## Custom domain setup

1. In Vercel project settings → **Domains**
2. Add `qarnayel.lb` for production
3. Add `staging.qarnayel.lb` for staging (or use a Vercel preview URL)
4. Update DNS records at your domain registrar as instructed by Vercel

---

## Build and deploy commands

```bash
# Local development
npm run dev

# Local production build check
npm run build
npm run start

# Type check
npm run type-check

# Lint
npm run lint
```

---

## ISR / revalidation

Place detail pages use ISR with a `revalidate` value. When new content is published via the admin project, trigger revalidation using Next.js on-demand revalidation or wait for the TTL to expire.

Recommended `revalidate` values:
- Place detail pages: `3600` (1 hour)
- Places listing: `1800` (30 minutes)
- Homepage: `3600` (1 hour)
- History page: `86400` (24 hours — rarely changes)
- About/Contact: `86400`

---

## Post-deployment checks

After every production deployment, verify:

1. Homepage loads in Arabic and English
2. Places listing loads and filtering works
3. At least one place detail page loads
4. Images display correctly (Firebase Storage URLs)
5. Google Maps links open correctly
6. Contact CTAs render for guide/owner/none modes
7. 404 page displays correctly
8. Sitemap at `/sitemap.xml` is accessible

---

## Rollback

Vercel keeps a deployment history. To rollback:
1. Go to **Deployments** in the Vercel project
2. Find the last known good deployment
3. Click **Promote to Production**
