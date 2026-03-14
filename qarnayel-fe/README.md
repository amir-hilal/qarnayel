# Qarnayel — Public Website

The official public website for **Qarnayel** (قرنايل), a historic mountain village in Lebanon.

Built with **Next.js App Router**, **TypeScript**, **Firebase Firestore**, and plain **CSS**.

---

## Prerequisites

- Node.js 20 LTS or later
- npm 10+
- A Firebase project (see [docs/firebase-setup.md](docs/firebase-setup.md))

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and fill in your Firebase config
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to `/{locale}` (default: `/ar`).

---

## Environment variables

All required variables are documented in [`.env.example`](.env.example).

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL (e.g. `https://qarnayel.lb`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale — `ar` |
| `NEXT_PUBLIC_APP_ENV` | `development`, `staging`, or `production` |

See [docs/environment-setup.md](docs/environment-setup.md) for the full setup guide.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server after build |
| `npm run type-check` | Run `tsc --noEmit` for type checking |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── app/                         # Next.js App Router
│   ├── [locale]/                # Locale segment (ar, en)
│   │   ├── layout.tsx           # Sets html lang + dir, header/footer shell
│   │   ├── page.tsx             # Homepage
│   │   ├── places/              # /places listing + /places/[slug] detail
│   │   ├── history/             # /history page
│   │   ├── about/               # /about page
│   │   └── contact/             # /contact page
│   ├── layout.tsx               # Root layout (minimal)
│   ├── page.tsx                 # Root redirect → /{defaultLocale}
│   ├── globals.css              # Global styles and CSS custom properties
│   ├── sitemap.ts               # Dynamic XML sitemap
│   └── robots.ts                # robots.txt
│
├── config/
│   └── constants.ts             # ROUTES, COLLECTIONS, PLACE_TYPES, etc.
│
├── features/                    # Domain-driven feature modules
│   ├── home/                    # Homepage view-model and components
│   ├── places/                  # Places domain: types, schema, mapper, repo, components
│   ├── history/                 # History domain
│   ├── pages/                   # CMS page content domain
│   └── shared/                  # Shared UI components (Header, Footer, etc.)
│
├── lib/
│   ├── env/                     # Zod-validated env vars
│   ├── firebase/                # Firebase client singleton + typed collection refs
│   ├── i18n/                    # Locale helpers, dictionaries, getDictionary()
│   ├── seo/                     # buildMetadata(), JSON-LD helpers
│   └── validation/              # Shared Zod schemas
│
└── types/
    └── index.ts                 # Global domain types
```

---

## Internationalisation

The site is fully bilingual — **Arabic** (default) and **English**.
Locale is determined by the URL path: `/ar/...` and `/en/...`.

See [docs/i18n-setup.md](docs/i18n-setup.md) for details.

---

## Firebase

The public site is **read-only**. All writes happen through a separate admin tool.

- Firebase Firestore is accessed only inside `src/lib/firebase/` and `src/features/*/repositories/`
- Published-only reads are enforced in both code and Firestore security rules

See [docs/firebase-setup.md](docs/firebase-setup.md) and [docs/firebase-storage-guide.md](docs/firebase-storage-guide.md).

---

## Deployment

Deployed on **Vercel**.

- `main` branch → production environment (`qarnayel-production`)
- `staging` branch → preview environment (`qarnayel-staging`)

See [docs/deployment.md](docs/deployment.md) and [docs/staging-vs-production.md](docs/staging-vs-production.md).

---

## Documentation

| Document | Description |
|---|---|
| [docs/project-overview.md](docs/project-overview.md) | Goals and scope |
| [docs/architecture.md](docs/architecture.md) | Folder structure and module boundaries |
| [docs/routing-plan.md](docs/routing-plan.md) | URL structure and route conventions |
| [docs/content-model.md](docs/content-model.md) | Firestore data model |
| [docs/firebase-setup.md](docs/firebase-setup.md) | Firebase project configuration |
| [docs/environment-setup.md](docs/environment-setup.md) | Environment variables guide |
| [docs/i18n-setup.md](docs/i18n-setup.md) | Internationalisation configuration |
| [docs/seo-content-guidelines.md](docs/seo-content-guidelines.md) | SEO requirements |
| [docs/deployment.md](docs/deployment.md) | Deployment guide |
| [docs/manual-setup-checklist.md](docs/manual-setup-checklist.md) | Pre-launch checklist |

---

## Copilot instructions

AI-assisted development guidelines live in `.github/copilot-instructions.md` and `.github/instructions/`.
These enforce architecture rules, coding standards, Firebase usage boundaries, i18n patterns, and accessibility requirements.
