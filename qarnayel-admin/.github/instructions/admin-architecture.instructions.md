---
applyTo: '**'
---

# Admin Architecture Instructions

## Folder structure

All source code lives under `src/`. Follow this domain-driven structure strictly:

```
src/
  app/                          # Next.js App Router entries — thin routes only
    layout.tsx
    page.tsx
    (admin)/
      layout.tsx                # Admin shell with sidebar
      dashboard/
        page.tsx
      places/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
          edit/
            page.tsx
      history/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      pages/
        page.tsx
        [slug]/
          edit/
            page.tsx
      media/
        page.tsx
      settings/
        page.tsx
  config/
    constants.ts                # All magic strings — routes, collections, enums
    routes.ts                   # ADMIN_ROUTES helpers
    collections.ts              # Firestore collection name constants
    locales.ts                  # Locale constants re-exported
  features/
    dashboard/
      components/               # Dashboard home widgets
    places/
      components/               # PlaceList, PlaceRow, PlaceStatusBadge, etc.
      forms/                    # PlaceForm, form section components
      repositories/             # places.repository.ts (read + write)
      mappers/                  # place.mapper.ts
      schemas/                  # place.schema.ts, placeForm.schema.ts
      types/                    # index.ts — feature-local type re-exports
      constants/                # index.ts — place feature constants
      utils/                    # index.ts — slug gen, publish check helpers
    history/
      components/
      forms/
      repositories/
      mappers/
      schemas/
      types/
    pages/
      components/
      forms/
      repositories/
      mappers/
      schemas/
      types/
    media/
      components/               # MediaPicker, UploadZone, MediaGrid
      repositories/             # media.repository.ts
      mappers/                  # media.mapper.ts
      schemas/
      types/
      utils/                    # storage path helpers
    settings/
      components/
      forms/
      repositories/
      schemas/
      types/
    shared/
      components/               # AdminHeader, Sidebar, StatusBadge, ConfirmDialog, Toast, EmptyState
      forms/                    # LocalizedTextField, LocalizedTextareaField, BilingualSection
      utils/                    # shared utilities
      validation/               # translation completeness checker
  lib/
    env/
      index.ts                  # Validated env vars via zod
    firebase/
      client.ts                 # Firebase app + db + storage init (named-database aware)
      collections.ts            # Typed collection references
      storage.ts                # Storage helpers
    i18n/
      locales.ts
      helpers.ts
      dictionaries/
        en.ts
        ar.ts
    auth/
      index.ts                  # Auth helpers (placeholder + real Firebase Auth)
    permissions/
      index.ts                  # Role-based permission helpers (placeholder)
    preview/
      index.ts                  # Preview URL builder
    validation/
      index.ts                  # Shared zod utilities
  styles/
    globals.css                 # Design tokens, reset, utility classes, shared components
    admin.css                   # Admin shell, sidebar, layout-specific styles
  types/
    index.ts                    # Global type exports
```

## Module dependency rules

```
app/           → features/, lib/
features/      → lib/, shared/ (within features/)
lib/           → (no imports from features/)
config/        → (no imports — constants only)
types/         → (no imports — types only)
```

## Route files must be thin

- `app/**/page.tsx` calls repository functions or invokes server-side data loaders
- Route files must not contain form logic, Firestore SDK calls, or business logic
- Delegate UI rendering to feature components

## Component responsibility matrix

| Layer                      | Fetches data | Writes data | Renders UI | Has state       |
| -------------------------- | ------------ | ----------- | ---------- | --------------- |
| `app/**/page.tsx`          | ✅ (server)  | ❌          | ❌         | ❌              |
| `features/*/components/`   | ❌           | ❌          | ✅         | Sometimes       |
| `features/*/forms/`        | ❌           | ❌          | ✅         | ✅ (form state) |
| `features/*/repositories/` | ✅           | ✅          | ❌         | ❌              |
| `features/*/mappers/`      | ❌           | ❌          | ❌         | ❌              |

## Guardrails

- Never place direct `collection()`, `doc()`, `getDocs()`, `setDoc()` calls inside components or forms
- Never create a flat `/components` dumping ground
- Never put non-related domain types in the same types file without clear separation
- Always centralise collection names in `config/collections.ts`
- Always centralise route strings in `config/routes.ts`
- Always use feature-scoped types re-exports in `features/{domain}/types/index.ts`
