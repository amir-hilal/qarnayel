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
/ar/contact                → Arabic contact page
/en/contact                → English contact page
/ar/[slug]                 → Arabic dynamic page (admin-created pageContent)
/en/[slug]                 → English dynamic page (admin-created pageContent)
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
    ├── contact/
    │   └── page.tsx
    └── [slug]/
        └── page.tsx                  # Dynamic page renderer for admin-created pageContent
```

### Dynamic page route (`[locale]/[slug]`)

Any slug that does not match a static Next.js route (e.g. `places`, `history`, `contact`) is caught by `[locale]/[slug]/page.tsx`. This route:

1. Calls `fetchPublishedPageBySlug(slug)` — a direct `getDoc` on `pageContent/{slug}`.
2. Calls `notFound()` if the document doesn't exist or is not `published`.
3. Renders the bilingual title and body from the `pageContent` document.
4. Exports `generateMetadata` for locale-aware SEO.
5. Uses `revalidate = 3600` (ISR) so newly published pages appear within an hour without a full rebuild.

**Route precedence**: Next.js static segments always win over `[slug]`. So `/places` is handled by the static `places/page.tsx`, not by `[slug]/page.tsx`.

---

## Route constants

Always use the `ROUTES` helpers from `src/config/constants.ts`:

```ts
ROUTES.HOME('ar')              // → '/ar'
ROUTES.PLACES('en')            // → '/en/places'
ROUTES.PLACE_DETAIL('ar', 'qarnayel-cedar-forest')  // → '/ar/places/qarnayel-cedar-forest'
ROUTES.HISTORY('ar')           // → '/ar/history'
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

Navigation is now **data-driven**, managed via Admin → Pages → Navigation Order section.

- `navItems` is stored in `siteSettings/global` as an ordered array.
- Home (`/`) is always pinned as the first entry and is never stored in Firestore.
- Up to 5 items are shown in the nav bar; additional items collapse into an "Other / المزيد" dropdown.
- Static routes (e.g. `/places`) and admin-created pages (e.g. `/tourism`) both appear as nav items.
- Publishing a `pageContent` page auto-appends it to `navItems`; drafting/archiving auto-removes it.

The following built-in routes are available to add via the Navigation Order manager:

| Path | Label (ar) | Label (en) |
|---|---|---|
| `/places` | الأماكن | Places |

`pageContent`-backed routes (e.g. `/history`, `/contact`, custom admin pages) appear in the picker automatically when they are published.
