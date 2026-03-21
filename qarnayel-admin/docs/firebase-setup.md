# Firebase Setup

## Project structure

There is **one Firebase project** shared across all environments (`development`, `staging`, `production`). See `docs/staging-vs-production.md` for how environments are isolated.

## Firebase services used

| Service | Purpose |
|---|---|
| Firestore | Structured content and metadata storage |
| Firebase Storage | Image and media file storage |
| Firebase Auth | Admin user authentication |

## Initial setup steps

### 1. Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use the existing Qarnayel project)
3. Enable Google Analytics if desired

### 2. Enable Firestore

1. In the Firebase Console → Firestore Database → Create database
2. Choose **production mode** (security rules will be configured separately)
3. The default database will be used for `production`

### 3. Create the staging named database

1. In the Firebase Console → Firestore Database → Databases
2. Click **Add database**
3. Set the database ID to `staging`
4. This named database is used in non-production environments

### 4. Enable Firebase Storage

1. In the Firebase Console → Storage → Get started
2. Accept the default security rules (configure properly later — see `docs/security-rules-plan.md`)
3. Note the storage bucket name — it will be the same across environments

### 5. Enable Firebase Auth

1. In the Firebase Console → Authentication → Get started
2. Enable **Email/Password** sign-in method
3. Optionally enable **Google** sign-in for admin convenience
4. Create the first admin user account manually in the Auth console

### 6. Register a web app

1. In the Firebase Console → Project settings → Your apps
2. Add a web app with a name like `qarnayel-admin`
3. Copy the Firebase config object
4. Set these values as environment variables in `.env.local` (see `.env.example`)

## Environment variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Never commit these values. Use `.env.local` locally, and configure your hosting environment (Vercel, etc.) with the same values.

## Named database selection

The admin app reads the target Firestore database from:

```
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging   # non-production
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=          # (empty) = production default
```

The `lib/firebase/client.ts` initialization reads this variable and selects the correct database.

## Firestore indexes

Some queries require composite indexes. These will be flagged by Firebase Console during development. Always:

1. Create required indexes via the Firebase Console or `firestore.indexes.json`
2. Never bypass index requirements with memory-intensive client-side filtering

Required indexes:
- `places`: `status ASC, featured ASC` (for featured places query)
- `places`: `status ASC, category ASC` (for filtered places)
- `places`: `status ASC, slug ASC` (for slug lookup)

## Security rules

See `docs/security-rules-plan.md` for the planned Firestore and Storage security rule design.

## Admin SDK (server-side only)

If server-side operations are needed (e.g., running seed scripts or admin scripts), use the Firebase Admin SDK with a service account key:

1. Firebase Console → Project settings → Service accounts → Generate new private key
2. Save as `scripts/serviceAccountKey.json` (gitignored — NEVER commit this file)
3. Reference in scripts only — never import into the Next.js app bundle
