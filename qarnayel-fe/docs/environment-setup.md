# Environment Setup Guide

## Overview

This project uses environment variables for all configuration that varies between environments or must never be committed to source control. There are never secrets in source code files.

---

## Environment files

| File | Purpose | Committed? |
|---|---|---|
| `.env.example` | Template with placeholder keys | ✅ Yes |
| `.env.local` | Local development overrides | ❌ No (.gitignore) |
| `.env.staging` | Staging environment values | ❌ No (.gitignore) |
| `.env.production` | Production environment values | ❌ No (.gitignore) |

---

## Setting up your local environment

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the values from the **single Firebase project** — the same credentials are used for all environments
3. Set `NEXT_PUBLIC_APP_ENV=development` and optionally `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging` to point at the staging database during local development
4. Never commit `.env.local`

---

## Environment variable reference

### Firebase (client-safe — exposed to browser)

These are prefixed with `NEXT_PUBLIC_` because they are embedded in client-side JavaScript bundles. This is normal for Firebase web SDK config — these are not secret.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Site configuration (client-safe)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL | `https://qarnayel.lb` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale | `ar` |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Enable local emulator | `false` |

### Build-time (server-only, optional)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_ENV` | Environment name: `development`, `staging`, or `production` |

---

## Validation

Environment variables are validated at startup in `src/lib/env/index.ts` using zod. If a required variable is missing or invalid, the app will throw at startup rather than fail silently at runtime.

```ts
// src/lib/env/index.ts (excerpt)
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  // ...
});
```

---

## Staging vs production

All environments share the same Firebase project and credentials. The only differences per environment are:

- `NEXT_PUBLIC_APP_ENV` — `development`, `staging`, or `production`
- `NEXT_PUBLIC_SITE_URL` — the canonical URL for that environment
- `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` — set to `staging` for the staging environment; leave unset for production (uses the default database)

See [staging-vs-production.md](./staging-vs-production.md) for full details.

---

## Firebase emulator (local development)

To use the Firebase emulator instead of the live staging project:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase emulators:start` (Firestore + Storage)
3. Set in `.env.local`:
   ```
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```
4. The Firebase client in `src/lib/firebase/client.ts` will connect to localhost emulator ports when this flag is set

---

## Never do this

```ts
// ❌ NEVER hard-code credentials
const firebaseConfig = {
  apiKey: 'AIzaSy...',
  projectId: 'qarnayel-prod',
};

// ✅ ALWAYS use env vars
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
```
