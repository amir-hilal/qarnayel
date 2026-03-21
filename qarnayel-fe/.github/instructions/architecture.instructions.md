---
applyTo: '**'
---

# Architecture Instructions

## Folder structure

All source code lives under `src/`. The structure is **domain-driven** and must never be flattened.

```
src/
  app/                        # Next.js App Router routes (thin pages only)
  config/                     # Site-wide constants, route names, collection names
  features/
    home/
      components/             # React components owned by the home domain
      view-models/            # Data-preparation logic for the home page
    places/
      components/
      repositories/           # Firestore read logic
      mappers/                # Firestore doc → domain model conversion
      schemas/                # Zod validation schemas
      types/                  # Domain types for places
      constants/              # Category labels, filter keys, etc.
      utils/                  # Pure helper functions
    history/
      components/
      repositories/
      mappers/
      schemas/
      types/
    pages/                    # Static/CMS pages (About, Contact, etc.)
      components/
      repositories/
      mappers/
      schemas/
      types/
    shared/
      components/             # Cross-feature reusable components
      types/                  # Shared domain types
      utils/                  # Cross-feature utilities
  lib/
    env/                      # Environment variable validation and exports
    firebase/                 # Firebase client init, server init, collection refs
    i18n/                     # Locale helpers, translation types, RTL detection
    seo/                      # Metadata builders, canonical URL helpers
    validation/               # Shared zod utilities
  types/                      # Global TypeScript type declarations
```

## Module boundaries

- **`app/`** only imports from `features/` and `lib/`
- **`features/{domain}/components/`** may import from its own `view-models/`, `types/`, `constants/`, and `shared/`
- **`features/{domain}/repositories/`** imports from `lib/firebase/` and its own `mappers/`
- **`features/{domain}/mappers/`** imports from its own `types/` only
- **`lib/`** modules may not import from `features/`
- **`config/`** has no imports — it only exports constants

## Route files

Route files (`app/**/page.tsx`) must be thin:

```tsx
// GOOD — delegate to feature
import { PlacesView } from '@/features/places/components/PlacesView';
import { fetchPublishedPlaces } from '@/features/places/repositories/places.repository';

export default async function PlacesPage() {
  const places = await fetchPublishedPlaces();
  return <PlacesView places={places} />;
}

// BAD — logic in route file
export default async function PlacesPage() {
  const db = getFirestore();
  const snap = await getDocs(collection(db, 'places'));
  // ... transformation logic ...
}
```

## Server vs client components

- Default to **Server Components**
- Use `'use client'` only for:
  - Components with `useState` / `useEffect`
  - Event handlers (click, submit, etc.)
  - Browser-only APIs
  - Locale switcher (needs client-side state)
- Filter/search UI with URL params can remain server components using `searchParams`

## Composition over monolith

- Break large components into focused sub-components
- Each component file should do one thing
- Prefer passing data down over fetching inside deep components
- Keep JSX files free of business logic

## Error and loading boundaries

- Add `loading.tsx` in every route segment that fetches data
- Add `error.tsx` in every route segment that can fail
- Add `not-found.tsx` where a slug lookup can return null

## Keeping documentation in sync with structure

Every time a file or folder is **created, moved, renamed, or deleted**, the following must happen **in the same edit session**:

1. **`docs/architecture.md`** — update the folder tree to reflect the change. Add a short inline comment when the file's purpose is not self-evident.
2. **`.github/instructions/architecture.instructions.md`** — if the change affects a feature domain, shared layer, or lib folder, update the folder structure block in this file to match.

This rule applies to all structural changes regardless of scope — single file addition, refactor, or wholesale domain creation.

```
// Example: adding a new repository file
// ✅ DO — update both docs/architecture.md AND this file in the same session
// ❌ DON'T — create the file and leave the docs stale
```
