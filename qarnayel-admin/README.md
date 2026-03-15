# Qarnayel Admin

Content management dashboard for the Qarnayel website. Built with Next.js 15, Firebase, and TypeScript.

---

## Prerequisites

- Node.js 20+
- A Firebase project with Authentication, Firestore, and Storage enabled
- The `qarnayel-fe` public site (optional, for preview links)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase project values. All `NEXT_PUBLIC_FIREBASE_*` values are found in the Firebase Console under **Project Settings → General → Your apps**.

### 3. Start the development server

```bash
npm run dev
```

The admin runs on [http://localhost:3001](http://localhost:3001) by default. Set the port in `package.json` under the `dev` script if needed.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `NEXT_PUBLIC_APP_ENV` | ✅ | `development`, `staging`, or `production` |
| `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` | — | Named Firestore database (e.g. `staging`). Leave empty for the default production database. |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | ✅ | URL of the public-facing site (used for preview links) |
| `NEXT_PUBLIC_ADMIN_SITE_URL` | ✅ | URL of this admin app |

---

## Firebase Setup

### Authentication

1. Go to **Authentication → Sign-in method** and enable **Email/Password**.
2. Under **Authentication → Users**, add the accounts that should have admin access.

### Firestore

1. Go to **Firestore Database** and create a database in your preferred region.
2. **Production** uses the default `(default)` database.
3. **Staging / development** uses a named database called `staging`.
   Create it via **Firestore → Databases → Create database** and choose the name `staging`.
4. Deploy the Firestore security rules from `firestore.rules` (when present).

### Storage

1. Go to **Storage** and create a default bucket.
2. Deploy the Storage security rules from `storage.rules` (when present).

---

## Staging vs. Production

The admin uses **one Firebase project** with two Firestore databases:

| Environment | `NEXT_PUBLIC_APP_ENV` | `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` | Database |
|---|---|---|---|
| Local development | `development` | `staging` | Named `staging` database |
| Staging preview | `staging` | `staging` | Named `staging` database |
| Production | `production` | *(empty)* | Default `(default)` database |

Set these variables in your hosting provider's environment configuration for each deployment target.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type check without emitting |

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `qarnayel-admin`.
4. Add all environment variables under **Settings → Environment Variables**.
   - Add production values for the `production` environment.
   - Add staging values for the `preview` environment.
5. Deploy.

---

## Project Structure

```
qarnayel-admin/
├── src/
│   ├── app/                   # Next.js App Router pages and layouts
│   │   ├── (admin)/           # Admin shell (auth-guarded)
│   │   │   ├── dashboard/
│   │   │   ├── places/
│   │   │   ├── history/
│   │   │   ├── pages/
│   │   │   ├── media/
│   │   │   └── settings/
│   │   └── login/
│   ├── features/              # Feature modules (collocated components, forms, repos)
│   │   ├── places/
│   │   ├── history/
│   │   ├── pages/
│   │   ├── media/
│   │   ├── settings/
│   │   └── shared/            # Cross-cutting UI and form primitives
│   ├── lib/                   # Framework integrations (Firebase, auth, i18n)
│   │   ├── auth/
│   │   ├── firebase/
│   │   ├── i18n/
│   │   ├── permissions/
│   │   ├── preview/
│   │   └── validation/
│   ├── config/                # App-wide constants and route definitions
│   ├── styles/                # Global CSS and admin layout styles
│   └── types/                 # Shared TypeScript types
├── docs/                      # Architecture and setup documentation
├── .env.example
└── package.json
```

---

## Architecture Notes

- **Repository pattern** — all Firestore access goes through `src/features/*/repositories/`. UI components never import Firebase directly.
- **Mapper pattern** — raw Firestore documents are validated with Zod and mapped to typed domain objects before use.
- **Bilingual content** — Arabic and English are both required before a document can be published (`LocalizedText = { ar: string; en: string }`).
- **No Tailwind** — styles use plain CSS with BEM naming and CSS custom properties (design tokens). See `src/styles/`.
- **Strict TypeScript** — `any` is disallowed. All data crossing a boundary is validated with Zod.

See [`docs/architecture.md`](docs/architecture.md) for a full breakdown.
