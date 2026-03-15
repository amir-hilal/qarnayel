---
applyTo: '**/*.ts,**/*.tsx'
---

# Coding Standards Instructions

## TypeScript

- Strict mode is mandatory — `tsconfig.json` must include `"strict": true`
- `any` is **forbidden** — use `unknown` and narrow with type guards or zod
- All exported functions must have explicit return types
- All props must have explicit interfaces or type aliases
- Prefer `type` over `interface` for everything except extensible public API contracts
- Use `satisfies` operator where type checking is needed without type widening
- Use `unknown` when receiving external or untyped data; narrow before use
- Prefer discriminated unions over boolean flags
- Never cast with `as T` unless after a runtime check

## Naming conventions

- Files: `kebab-case.ts` / `PascalCase.tsx` for React components
- Types: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` for string/enum constants in `config/`
- Functions: `camelCase`
- React components: `PascalCase`
- CSS class names: `BEM` — `.block__element--modifier`
- Zod schemas: `camelCase` ending in `Schema` (e.g. `placeSchema`, `placeFormSchema`)

## Constants

- Never hard-code collection names, route strings, status values, or category strings inline
- Always import from `@/config/constants`, `@/config/routes`, or `@/config/collections`
- If a constant is only used in one feature, put it in `features/{domain}/constants/index.ts`

## Zod usage

- All form values must be validated with a zod schema before submission
- All Firestore documents must be validated through a zod schema in the mapper
- Use `z.safeParse()` in mappers (log error, return null)
- Use `z.parse()` or React Hook Form's `zodResolver` in forms
- Never invent runtime type guards manually when zod can do it
- Export both `Schema` and derived `type` from schema files

## Error handling

- Repositories must catch errors, log in development only, and return safe fallbacks
- Forms must show per-field validation errors from zod
- Never swallow errors silently in production paths
- Always show loading, empty, and error states in list and detail views

## React components

- Server Components by default — add `'use client'` only when state, effects, or browser APIs are needed
- Keep components small and single-purpose — extract when a component exceeds ~150 lines
- Props: destructure inline for clarity
- Avoid index-based keys in lists — use stable IDs
- No inline styles or `style` attribute on elements

## Imports

- Use `@/` path alias for all non-relative imports
- Group imports: external libraries → internal lib → internal features → relative
- Never circular-import between feature domains

## File size

- Keep files under ~200 lines; split by responsibility when exceeded
- One exported component per file for React components
- Types, schemas, and constants may be co-located in index files within their folder
