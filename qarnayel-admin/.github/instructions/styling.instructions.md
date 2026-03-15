---
applyTo: 'src/styles/**,**/*.css,**/*.tsx,**/*.ts'
---

# Styling Instructions

## Core rule: No Tailwind

This project uses **plain CSS only**. Never use Tailwind utility classes, never install or reference Tailwind.

## CSS philosophy

- Same philosophy as the Qarnayel public website
- All design tokens live in `styles/globals.css` as CSS custom properties on `:root`
- Component-level styles use BEM naming: `.block__element--modifier`
- CSS logical properties for RTL support: `margin-inline-start`, `padding-inline-end`, etc.
- No inline `style` attributes on elements

## File organization

```
src/styles/
  globals.css    # Tokens, reset, base styles, utility classes, shared component styles
  admin.css      # Admin shell: sidebar, header, layout grid, admin-specific components
```

## Design tokens (same as public website)

These tokens are already defined in `globals.css` and must be used everywhere:

```css
/* Colors */
--color-primary: #6a863f;
--color-primary-dark: #506830;
--color-primary-light: #e8f3dc;
--color-secondary: #3e603e;
--color-secondary-dark: #2d4a2d;
--color-surface: #ffffff;
--color-surface-alt: #f7f7f5;
--color-border: #e2e2df;
--color-text: #1a1a18;
--color-text-muted: #666660;
--color-text-inverse: #ffffff;
--color-error: #c0392b;
--color-error-bg: #fdf0ee;

/* Admin-specific additions */
--color-warning: #b45309;
--color-warning-bg: #fffbeb;
--color-success: #2d6a2d;
--color-success-bg: #edf7ed;
--color-sidebar-bg: #f4f4f2;
--color-sidebar-width: 15rem;
```

## Typography tokens

```css
--font-arabic: 'Cairo', 'Arial', sans-serif;
--font-latin: 'Inter', 'Helvetica Neue', sans-serif;
--font-body: var(--font-latin); /* Admin UI defaults to Latin */
```

## Buttons

Use the shared `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--outline`, `.btn--ghost`, `.btn--danger` classes defined in `globals.css`.

Admin adds `.btn--ghost` and `.btn--danger` extensions:

```css
.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
.btn--ghost:hover {
  background: var(--color-surface-alt);
}
.btn--danger {
  background: var(--color-error);
  color: var(--color-text-inverse);
  border-color: var(--color-error);
}
.btn--danger:hover {
  background: #a02e22;
}
```

## Status badges

```css
.status-badge { ... }                  /* base styles */
.status-badge--draft { ... }           /* neutral/grey */
.status-badge--published { ... }       /* green */
.status-badge--archived { ... }        /* orange/muted */
```

## Form styles

```css
.form-field { ... }                    /* wrapper div */
.form-field__label { ... }             /* label */
.form-field__input { ... }             /* input/textarea */
.form-field__error { ... }             /* error message */
.form-section { ... }                  /* collapsible section */
.form-section__heading { ... }         /* section heading */
.bilingual-field { ... }               /* two-column ar/en input pair */
.bilingual-field__ar { dir: rtl }
.bilingual-field__en { dir: ltr }
```

## Admin shell layout

```css
.admin-shell { display: grid; grid-template-columns: var(--color-sidebar-width) 1fr; }
.admin-sidebar { ... }
.admin-content { ... }
.admin-header { ... }
.admin-nav__item { ... }
.admin-nav__item--active { ... }
```

## BEM naming discipline

- Block names must describe the component: `.place-list`, `.history-form`, `.media-picker`
- Element separator: `__` — `.place-list__row`, `.place-list__empty`
- Modifier separator: `--` — `.place-list__row--archived`
- Never use deeply nested BEM (more than 2 levels of `__`)

## Accessibility

- All interactive elements must have visible focus styles (`outline` or custom ring)
- Minimum contrast ratio 4.5:1 for text
- Never remove `outline` without providing a custom focus style
- Use `:focus-visible` rather than `:focus` for keyboard-only focus rings

## RTL support

- Sidebar layout must handle RTL (use `margin-inline-start` not `margin-left`)
- Arabic content preview areas: wrap in `<div dir="rtl">` with `--font-body: var(--font-arabic)`
- Admin nav and shell default to LTR; content editing areas for Arabic fields use `dir="rtl"`
