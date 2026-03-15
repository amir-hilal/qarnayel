# Styling System Guide

## Core principle

The admin dashboard uses the **same design system** as the Qarnayel public website. No Tailwind. Plain CSS only, organised with design tokens as CSS custom properties, using BEM naming conventions.

## Files

```
src/styles/
  globals.css    # Tokens, reset, base styles, shared component styles (same as public)
  admin.css      # Admin shell layout, sidebar, admin-specific components
```

Both files are imported in `src/app/layout.tsx`.

## Design tokens

All tokens are CSS custom properties on `:root`. They are identical to the public website tokens:

```css
:root {
  /* Brand colors */
  --color-primary: #6a863f;
  --color-primary-dark: #506830;
  --color-primary-light: #e8f3dc;
  --color-secondary: #3e603e;
  --color-secondary-dark: #2d4a2d;

  /* Surface and text */
  --color-surface: #ffffff;
  --color-surface-alt: #f7f7f5;
  --color-border: #e2e2df;
  --color-text: #1a1a18;
  --color-text-muted: #666660;
  --color-text-inverse: #ffffff;

  /* Semantic */
  --color-error: #c0392b;
  --color-error-bg: #fdf0ee;
  --color-warning: #b45309;
  --color-warning-bg: #fffbeb;
  --color-success: #2d6a2d;
  --color-success-bg: #edf7ed;

  /* Admin-specific */
  --color-sidebar-bg: #f4f4f2;
  --sidebar-width: 15rem;

  /* Typography */
  --font-arabic: 'Cairo', 'Arial', sans-serif;
  --font-latin: 'Inter', 'Helvetica Neue', sans-serif;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --border-width: 1px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

## BEM naming convention

Class names follow the BEM convention: `.block__element--modifier`

Do not invent arbitrary class names. Map classes to components:

| Component | Block class |
|---|---|
| Admin shell | `.admin-shell` |
| Sidebar | `.admin-sidebar` |
| Top header | `.admin-header` |
| Nav item | `.admin-nav__item` |
| Place list | `.place-list` |
| Place row | `.place-list__row` |
| Status badge | `.status-badge` |
| Form section | `.form-section` |
| Bilingual field | `.bilingual-field` |
| Confirm dialog | `.confirm-dialog` |
| Toast | `.toast` |

## Shared button classes

```css
.btn              /* base */
.btn--primary     /* green CTA */
.btn--secondary   /* dark green */
.btn--outline     /* bordered */
.btn--ghost       /* minimal */
.btn--danger      /* red destructive action */
.btn--sm          /* small size */
.btn--lg          /* large size */
```

## Status badge classes

```css
.status-badge              /* base */
.status-badge--draft       /* grey */
.status-badge--published   /* green */
.status-badge--archived    /* orange */
```

## CSS logical properties

Use logical properties for RTL/LTR compatibility:

| Avoid | Use instead |
|---|---|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |

## Font assignment

- Admin UI text: `--font-latin` (Inter)
- Arabic content input fields: `--font-arabic` (Cairo), `dir="rtl"`
- English content input fields: `--font-latin` (Inter), `dir="ltr"`

## Dark theme

The `globals.css` includes dark theme overrides under `[data-theme="dark"]`. The admin dashboard may support dark mode in the future using the same token overrides.

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Focus styles: use `:focus-visible` with a 2px `outline` using `var(--color-primary)`
- Never use `outline: none` without a custom replacement
- Interactive elements must have visible focus rings

## No Tailwind

Never install or use Tailwind in this project. If you see Tailwind classes (`text-sm`, `flex`, `p-4`, etc.) in code, remove them and replace with proper BEM CSS classes or CSS custom properties.
