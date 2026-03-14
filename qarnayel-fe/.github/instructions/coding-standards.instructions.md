---
applyTo: '**/*.ts,**/*.tsx'
---

# Coding Standards

## TypeScript

- Enable and obey all `strict` flags in `tsconfig.json`
- **`any` is forbidden** — use `unknown` for truly untyped data, then narrow it
- Use explicit return types on all exported functions
- Use `type` for object shapes; use `interface` only when extension is intentional
- Never use type assertions (`as Type`) without a guard or explicit narrowing comment
- Use `satisfies` when you want compile-time shape-checking without widening

## Naming conventions

| Element               | Convention                            | Example                           |
| --------------------- | ------------------------------------- | --------------------------------- |
| Files (components)    | PascalCase                            | `PlaceCard.tsx`                   |
| Files (utilities/lib) | camelCase                             | `place.mapper.ts`                 |
| Files (constants)     | camelCase                             | `index.ts` inside `constants/`    |
| React components      | PascalCase                            | `PlaceCard`                       |
| Functions             | camelCase                             | `fetchPublishedPlaces`            |
| Types / Interfaces    | PascalCase                            | `Place`, `LocalizedText`          |
| Zod schemas           | camelCase + `Schema` suffix           | `placeSchema`                     |
| Constants             | SCREAMING_SNAKE_CASE                  | `PLACES_COLLECTION`               |
| CSS class names       | kebab-case BEM-style                  | `.place-card__title`              |
| Environment vars      | `NEXT_PUBLIC_` prefix for client-safe | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |

## No magic strings

Use constants for:

- Firestore collection names → `src/config/constants.ts`
- Route paths → `src/config/constants.ts`
- Locale keys → `src/lib/i18n/locales.ts`
- Category values → `src/features/places/constants/index.ts`

```ts
// BAD
const ref = collection(db, 'places');
router.push('/places');

// GOOD
import { COLLECTIONS } from '@/config/constants';
import { ROUTES } from '@/config/constants';
const ref = collection(db, COLLECTIONS.PLACES);
router.push(ROUTES.PLACES);
```

## Zod usage

- Parse Firestore documents through zod schemas in mappers
- Catch parse errors and log them; do not crash the page
- Keep schemas co-located with their domain in `features/{domain}/schemas/`

```ts
const result = placeSchema.safeParse(raw);
if (!result.success) {
  console.error('[place.mapper] Invalid place document', result.error);
  return null;
}
return result.data;
```

## Functions and exports

- Prefer named exports over default exports for utilities and components
- Default exports are acceptable only for Next.js route files (`page.tsx`, `layout.tsx`, etc.)
- Keep functions short and single-purpose
- No side effects in mappers or schemas

## Error handling

- Use `try/catch` around all Firestore calls in repositories
- Log errors with a consistent prefix: `[repository-name]`
- Return `null` or `[]` on failure (never throw from a repository to a Server Component render path)
- Document error return shapes in function signatures

## Avoid

- Inline styles
- Anonymous default exports (except Next.js route files)
- Barrel re-exports that hide the actual source file
- Importing from `lib/firebase/` inside any component or feature type file
- Console logs in production — guard with `process.env.NODE_ENV === 'development'`
