# i18n Setup Guide

## Overview

The public website supports **Arabic** (`ar`) and **English** (`en`) from day one. Arabic is the primary locale. All content is bilingual — there is no content that exists only in one language.

---

## Locale strategy

### URL-based locale routing

The locale is the first path segment:

```
/ar/         ← Arabic
/en/         ← English
```

The root `/` redirects to `/ar` by default (configurable via `NEXT_PUBLIC_DEFAULT_LOCALE`).

### No separate collections per language

Content is **not** split into separate Firestore collections by language. Instead, localised fields use a bilingual object:

```json
{
  "title": {
    "ar": "غابة الأرز",
    "en": "Cedar Forest"
  }
}
```

---

## LocalizedText type

```ts
type LocalizedText = {
  ar: string;
  en: string;
};
```

Use this for all user-visible text that needs both languages. Do not use it for technical fields like `slug`, `status`, `id`, `phone`.

---

## Locale helper

```ts
// src/lib/i18n/helpers.ts
import type { LocalizedText } from '@/types';
import type { Locale } from '@/lib/i18n/locales';

export function localise(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text['en'] ?? '';
}
```

Usage:
```tsx
<h1>{localise(place.title, locale)}</h1>
```

---

## Static UI strings (dictionary)

Static labels, button text, navigation items, and empty state messages are stored in dictionary files:

```
src/lib/i18n/dictionaries/
  ar.ts
  en.ts
```

Example:
```ts
// ar.ts
export const ar = {
  nav: {
    home: 'الرئيسية',
    places: 'الأماكن',
    history: 'التاريخ',
    about: 'عن قرنايل',
    contact: 'تواصل معنا',
  },
  places: {
    filterBy: 'تصفية حسب',
    noResults: 'لا توجد أماكن مطابقة',
    exploreAll: 'اكتشف جميع الأماكن',
  },
  cta: {
    explorePlaces: 'استكشف الأماكن',
    discoverHistory: 'اكتشف التاريخ',
  },
} as const;
```

---

## Locale context in components

The locale is passed as a prop to all components that render localised content:

```tsx
// Accept locale as a prop
type Props = {
  locale: Locale;
  place: Place;
};

export function PlaceCard({ locale, place }: Props) {
  return (
    <article className="place-card">
      <h2 className="place-card__title">{localise(place.title, locale)}</h2>
      <p>{localise(place.shortDescription, locale)}</p>
    </article>
  );
}
```

Do **not** read locale from a global singleton inside component render functions. Pass it through props or use a React context for deeply nested trees.

---

## RTL support

### HTML lang and dir

Set on the `<html>` element in the root layout:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### CSS — logical properties

Use CSS logical properties instead of physical left/right:

```css
/* ✅ RTL-safe */
.nav-item {
  margin-inline-end: 1rem;
  padding-inline-start: 0.5rem;
}

/* ❌ Not RTL-safe */
.nav-item {
  margin-right: 1rem;
  padding-left: 0.5rem;
}
```

### Arabic typography

Include Arabic font in `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --font-arabic: 'Cairo', 'Segoe UI', sans-serif;
  --font-latin: 'Inter', 'Helvetica Neue', sans-serif;
}

html[lang='ar'] body {
  font-family: var(--font-arabic);
}

html[lang='en'] body {
  font-family: var(--font-latin);
}
```

---

## Locale switcher

The `LocaleSwitcher` component is a **client component**. It allows users to toggle between Arabic and English by navigating to the same page in the other locale.

```tsx
'use client';
// src/features/shared/components/LocaleSwitcher.tsx
```

It reads the current path and replaces the locale segment.

---

## SEO — locale-aware metadata

Each page's `generateMetadata` must use the active locale:

```ts
export async function generateMetadata({ params }: { params: { locale: string } }) {
  return buildMetadata({
    locale: params.locale as Locale,
    title: seo[params.locale as Locale].title,
    description: seo[params.locale as Locale].description,
  });
}
```

---

## Translation completeness policy

Both `ar` and `en` are **required** for every `LocalizedText` field. The admin project is responsible for enforcing this before publishing. The public website assumes all published content is complete in both languages.

If a field is empty in the active locale, the `localise()` helper falls back to English, but this fallback should be treated as a content bug, not a feature.
