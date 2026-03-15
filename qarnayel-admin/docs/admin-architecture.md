# Admin Architecture

## Guiding principles

1. **Domain-driven structure** — code is organised by feature/domain, not by type
2. **Thin routes** — `app/**/page.tsx` files delegate to features immediately
3. **Repository pattern** — all Firestore and Storage access is encapsulated in repository functions
4. **Mapper pattern** — raw Firestore documents are converted to typed domain models before touching any component
5. **Strict TypeScript** — `any` is forbidden; every value has a known type
6. **Server-first** — components are Server Components by default; `'use client'` is the exception
7. **Write isolation** — all write operations live in repositories only; no Firestore SDK calls in components or forms
8. **Status-aware reads** — admin lists show all statuses; public website reads only `published`
9. **Aligned conventions** — this project follows the same architectural conventions as the public `qarnayel-fe` project

---

## Folder structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx               # Admin shell: sidebar + header
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── places/
│   │   │   ├── page.tsx             # Places list
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── history/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── pages/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── media/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx                   # Root layout
│   ├── not-found.tsx
│   └── error.tsx
├── config/
│   ├── constants.ts                 # All magic strings (enums, status values)
│   ├── routes.ts                    # ADMIN_ROUTES path helpers
│   ├── collections.ts               # Firestore collection name constants
│   └── locales.ts                   # Locale constants
├── features/
│   ├── dashboard/components/
│   ├── places/
│   │   ├── components/
│   │   ├── forms/
│   │   │   ├── PlaceForm.tsx
│   │   │   └── sections/
│   │   ├── repositories/
│   │   ├── mappers/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   ├── history/
│   ├── pages/
│   ├── media/
│   ├── settings/
│   └── shared/
│       ├── components/
│       ├── forms/
│       ├── utils/
│       └── validation/
├── lib/
│   ├── env/index.ts
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── collections.ts
│   │   └── storage.ts
│   ├── i18n/
│   ├── auth/
│   ├── permissions/
│   ├── preview/
│   └── validation/
├── styles/
│   ├── globals.css
│   └── admin.css
└── types/
    └── index.ts
```

---

## Data flow

```
Admin Form
  ↓ submits PlaceFormValues
Repository (features/{domain}/repositories/)
  ↓ writes to Firestore
Firestore (places collection, staging or production DB)
  ↓
Repository (read)
  ↓ raw DocumentData
Mapper (features/{domain}/mappers/)
  ↓ via Zod schema
Domain model (features/{domain}/types/)
  ↓
Page / Component
```

---

## Module dependency rules

```
app/           → features/, lib/
features/      → lib/, shared/ (within features/)
lib/           → (no imports from features/)
config/        → (no imports — constants only)
types/         → (no imports — types only)
```

---

## Component responsibility matrix

| Layer | Fetches data | Writes data | Renders UI | Has state |
|---|---|---|---|---|
| `app/**/page.tsx` | ✅ (server read) | ❌ | ❌ | ❌ |
| `features/*/components/` | ❌ | ❌ | ✅ | Sometimes |
| `features/*/forms/` | ❌ | ❌ | ✅ | ✅ (form) |
| `features/*/repositories/` | ✅ | ✅ | ❌ | ❌ |
| `features/*/mappers/` | ❌ | ❌ | ❌ | ❌ |
