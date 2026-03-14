---
applyTo: 'src/features/**/components/**,src/app/**'
---

# UI & Accessibility Rules

## Semantic HTML

- Use the correct HTML element for its semantic purpose
- Page sections use `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<aside>`
- Headings follow a logical hierarchy: one `<h1>` per page, followed by `<h2>`, `<h3>`
- Interactive elements must be `<button>` or `<a>` — never `<div onClick>`
- Forms must have `<label>` elements wired to inputs via `htmlFor` / `id`
- Lists use `<ul>` / `<ol>` + `<li>` — not `<div>` wrappers

## Images

- Every `<img>` and `next/image` must have a descriptive, locale-aware `alt` attribute
- Use `alt=""` only for purely decorative images
- Use `MediaReference.alt` (type `LocalizedText`) for Firestore-sourced images

## Buttons and links

- Buttons that only navigate should be `<a>` — not `<button>`
- Buttons that trigger actions should be `<button>` — not `<a>`
- Disabled state must be communicated visually AND via `disabled` or `aria-disabled`

## External links

Use the shared `SafeExternalLink` component for all outbound links:

```tsx
// src/features/shared/components/SafeExternalLink.tsx
<SafeExternalLink href={url}>Read source</SafeExternalLink>
```

This component always applies `target="_blank" rel="noopener noreferrer"` — never do this inline.

## ARIA

- Use `aria-label` on icon-only buttons
- Use `aria-current="page"` on the active nav item
- Use `role="status"` on loading indicators
- Use `aria-live="polite"` on regions that update dynamically
- Do not misuse ARIA roles — prefer semantic HTML where a native element exists

## Loading states

- Every data-fetching route segment must have a `loading.tsx` file
- Loading UI must use visual skeleton placeholders (see `SkeletonLoader` component)
- Add `role="status"` and `aria-label="Loading..."` (localised) on skeleton containers

## Empty states

- Every list-rendering component must handle the empty case
- Empty state components must include a helpful localised message
- Use the shared `EmptyState` component or implement an equivalent

## Error states

- Every data-fetching route segment must have an `error.tsx` file
- Error UI must be user-friendly, actionable, and not expose technical details
- Log errors in `error.tsx` only in development: `process.env.NODE_ENV === 'development'`

## Focus and keyboard navigation

- All interactive elements must be keyboard reachable
- Custom interactive components must manage `tabIndex` correctly
- Focus rings must be visible — do not suppress `outline` without providing a custom focus indicator

## RTL readiness

- Use CSS logical properties: `margin-inline-start/end`, `padding-inline-start/end`, `text-align: start/end`
- Icons and directional arrows should be mirrored for RTL using CSS `transform` or `[dir="rtl"]` selectors
- Do not hard-code `left`/`right` in positioning styles — prefer `start`/`end` equivalents
- Test layout with `dir="rtl"` on `<html>` to catch RTL breakage early

## CSS conventions

- Plain CSS only — no Tailwind, no CSS Modules unless consistent, no inline styles
- Scope component styles with a BEM-inspired class naming: `.place-card`, `.place-card__title`, `.place-card--featured`
- Global styles go in `src/app/globals.css`
- Component-specific styles go in co-located `.css` files
- Use CSS custom properties (variables) for colours, spacing, and typography tokens

## Colour and contrast

- Text must meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Do not rely on colour alone to convey meaning
- Category badges must have sufficient contrast in both light modes

## Typography

- Arabic text must use an Arabic-capable font (e.g. Noto Sans Arabic, Cairo, Tajawal)
- Latin text must use a Latin font that complements the Arabic choice
- Font loading must use `font-display: swap`
