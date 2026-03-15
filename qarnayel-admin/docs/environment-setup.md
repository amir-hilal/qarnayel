# Environment Setup

## Prerequisites

- Node.js 20+
- npm or pnpm
- Firebase project created (see `docs/firebase-setup.md`)

## Local setup

### 1. Clone and install

```bash
cd qarnayel-admin
npm install
```

### 2. Create `.env.local`

Copy `.env.example` and fill in real values:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging

NEXT_PUBLIC_ADMIN_SITE_URL=http://localhost:3001
NEXT_PUBLIC_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run the dev server

```bash
npm run dev
```

The admin dashboard runs on `http://localhost:3001` by default (or whatever port you configure).

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `NEXT_PUBLIC_APP_ENV` | ✅ | Runtime environment: `development`, `staging`, `production` |
| `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` | Optional | Named Firestore database. Set to `staging` for non-production. Omit for production. |
| `NEXT_PUBLIC_ADMIN_SITE_URL` | ✅ | Base URL of this admin app |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | ✅ | Base URL of the public website (for preview links) |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Optional | Set to `true` to connect to Firebase emulators |

## Using the Firebase emulator

For fully offline local development:

```
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_APP_ENV=development
```

Start emulators with:

```bash
firebase emulators:start --only firestore,storage,auth
```

## Multiple environments

| Environment | `NEXT_PUBLIC_APP_ENV` | `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` |
|---|---|---|
| Local development | `development` | `staging` (or leave unset for emulator) |
| Staging deployment | `staging` | `staging` |
| Production deployment | `production` | *(empty — uses default database)* |

## TypeScript env validation

Environment variables are validated at startup using zod in `src/lib/env/index.ts`. If a required variable is missing, the app throws an error immediately with a clear message. See `lib/env/index.ts` for the full schema.
