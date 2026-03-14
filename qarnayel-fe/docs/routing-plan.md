# Routing Plan

## URL structure

The locale is always the first path segment. There is no locale-free route — all content is served under a locale prefix.

```
/                          → redirects to /ar (or browser-preferred locale)
/ar/                       → Arabic homepage
/en/                       → English homepage
/ar/places                 → Arabic places listing
/en/places                 → English places listing
/ar/places/[slug]          → Arabic place detail
/en/places/[slug]          → English place detail
/ar/history                → Arabic history page
/en/history                → English history page
/ar/about                  → Arabic about page
/en/about                  → English about page
/ar/contact                → Arabic contact page
/en/contact                → English contact page
```

---

## App Router file layout

```
src/app/
├── layout.tsx                        # Root layout — sets <html lang dir>
├── page.tsx                          # Root redirect to /ar
├── not-found.tsx                     # Global 404
├── error.tsx                         # Global error boundary
├── globals.css
├── sitemap.ts
├── robots.ts
└── [locale]/
    ├── layout.tsx                    # Locale layout — nav, footer, locale context
    ├── page.tsx                      # Homepage
    ├── loading.tsx                   # Homepage loading skeleton
    ├── error.tsx                     # Homepage error boundary
    ├── places/
    │   ├── page.tsx                  # Places listing
    │   ├── loading.tsx
    │   ├── error.tsx
    │   └── [slug]/
    │       ├── page.tsx              # Place detail
    │       ├── loading.tsx
    │       └── not-found.tsx         # Place slug not found
    ├── history/
    │   ├── page.tsx
    │   └── loading.tsx
    ├── about/
    │   └── page.tsx
    └── contact/
        └── page.tsx
```

---

## Route constants

Always use the `ROUTES` helpers from `src/config/constants.ts`:

```ts
ROUTES.HOME('ar')              // → '/ar'
ROUTES.PLACES('en')            // → '/en/places'
ROUTES.PLACE_DETAIL('ar', 'qarnayel-cedar-forest')  // → '/ar/places/qarnayel-cedar-forest'
ROUTES.HISTORY('ar')           // → '/ar/history'
ROUTES.ABOUT('en')             // → '/en/about'
ROUTES.CONTACT('ar')           // → '/ar/contact'
```

---

## generateStaticParams usage

For place detail pages, export `generateStaticParams` to pre-render all published places at build time:

```ts
// src/app/[locale]/places/[slug]/page.tsx
export async function generateStaticParams() {
  const places = await fetchPublishedPlaces();
  const locales = ['ar', 'en'];
  return locales.flatMap(locale =>
    places.map(place => ({ locale, slug: place.slug }))
  );
}
```

Use `revalidate` for ISR to pick up newly published places without a full rebuild:

```ts
export const revalidate = 3600; // 1 hour
```

---

## Locale detection and redirect

The root `src/app/page.tsx` should redirect to the preferred locale:

```ts
// src/app/page.tsx
import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';

export default function RootPage() {
  // TODO: Enhance with Accept-Language header detection if needed
  redirect(`/${DEFAULT_LOCALE}`);
}
```

---

## 404 behaviour

1. Unknown locale segment → Next.js catches with root `not-found.tsx`
2. Unknown slug in `/[locale]/places/[slug]` → call `notFound()` from `next/navigation` in the page
3. All 404 responses must render a bilingual, locale-aware message

---

## Filtering on the places page

Filters (category, placeType) are passed as URL search params — not React state:

```
/ar/places?category=restaurant
/en/places?type=attraction&category=forest
```

The `places/page.tsx` reads `searchParams` as a Server Component and passes them to the repository query. No client-side state manipulation needed.

---

## Navigation items

| Label (ar) | Label (en) | Route helper |
|---|---|---|
| الرئيسية | Home | `ROUTES.HOME(locale)` |
| الأماكن | Places | `ROUTES.PLACES(locale)` |
| التاريخ | History | `ROUTES.HISTORY(locale)` |
| عن قرنايل | About | `ROUTES.ABOUT(locale)` |
| تواصل معنا | Contact | `ROUTES.CONTACT(locale)` |
