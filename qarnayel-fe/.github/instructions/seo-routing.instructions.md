---
applyTo: 'src/app/**,src/lib/seo/**'
---

# SEO & Routing Rules

## URL structure

The locale is the top-level path segment:

```
/[locale]/                     → Homepage
/[locale]/places               → Places listing
/[locale]/places/[slug]        → Place detail
/[locale]/history              → History page
/[locale]/about                → About page
/[locale]/contact              → Contact page
```

The root `/` must redirect to `/{defaultLocale}/` (`/ar/` by default, or via browser preference detection).

## Route constants

All route strings must be defined in `src/config/constants.ts`:

```ts
export const ROUTES = {
  HOME: (locale: string) => `/${locale}`,
  PLACES: (locale: string) => `/${locale}/places`,
  PLACE_DETAIL: (locale: string, slug: string) => `/${locale}/places/${slug}`,
  HISTORY: (locale: string) => `/${locale}/history`,
  ABOUT: (locale: string) => `/${locale}/about`,
  CONTACT: (locale: string) => `/${locale}/contact`,
} as const;
```

Never hard-code `/ar/places` or `/en/places` inline — always use the `ROUTES` helper.

## Metadata API

Every page must export a `generateMetadata` function or a static `metadata` export.

```ts
// src/app/[locale]/places/page.tsx
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  return buildMetadata({
    locale: params.locale,
    title: { ar: 'الأماكن - قرنايل', en: 'Places - Qarnayel' },
    description: { ar: '...', en: '...' },
    path: ROUTES.PLACES(params.locale),
  });
}
```

## Canonical URLs

- Every page must have a canonical `<link rel="canonical">` tag
- The base URL is read from `NEXT_PUBLIC_SITE_URL` env var
- Canonical URLs always use the production domain, not staging

## hreflang

- Every page must include `hreflang` alternate links for both `ar` and `en`
- Add `x-default` pointing to the default locale

```html
<link rel="alternate" hreflang="ar" href="https://qarnayel.lb/ar/places" />
<link rel="alternate" hreflang="en" href="https://qarnayel.lb/en/places" />
<link
  rel="alternate"
  hreflang="x-default"
  href="https://qarnayel.lb/ar/places"
/>
```

## Open Graph and social

- All pages must have OG title, description, type
- Place detail pages must have OG image using the primary `MediaReference` URL
- Site title suffix must always include "قرنايل | Qarnayel"

## Structured data (JSON-LD)

- Place detail pages should include JSON-LD `LocalBusiness` or `TouristAttraction` schema
- History page may include JSON-LD `Article` schema
- Structured data helpers go in `src/lib/seo/`

## robots.txt and sitemap

- Generate a `sitemap.xml` using Next.js `app/sitemap.ts`
- The sitemap must include both locale variants of every page
- The sitemap must only include `published` place slugs
- `robots.txt` must disallow `/api/` and allow everything else

## slug conventions

- Slugs are lowercase, hyphen-separated
- Slugs must be ASCII-safe (transliterate Arabic to Latin for slugs)
- Slugs are set by the admin project — never auto-generate them in this project
- A place's slug is stable and must not change after publication

## 404 handling

- Every dynamic route segment must have a `not-found.tsx`
- Call `notFound()` from `next/navigation` when a slug returns null from the repository
- The global `not-found.tsx` in `src/app/` must be locale-aware

## Performance

- Use `next/image` for all image rendering
- Prefer static generation (`generateStaticParams`) for place detail pages
- Add `revalidate` to `fetch` or use ISR where Firestore content changes infrequently
