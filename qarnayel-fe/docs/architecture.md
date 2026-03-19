# Architecture

## Guiding principles

1. **Domain-driven structure** — code is organised by feature/domain, not by type
2. **Thin routes** — `app/**/page.tsx` files delegate to features immediately
3. **Repository pattern** — all Firestore access is encapsulated in repository functions
4. **Mapper pattern** — raw Firestore documents are converted to typed domain models before they touch any component
5. **Strict TypeScript** — `any` is forbidden; every value has a known type
6. **Server-first** — components are Server Components by default; `'use client'` is the exception
7. **Published-only** — public repositories always filter by `status == 'published'`
8. **No admin code** — no write operations, no auth logic, no CMS UI

---

## Folder structure

```
qarnayel-fe/
├── .github/
│   ├── copilot-instructions.md          # Global Copilot rules
│   └── instructions/                    # Topic-level Copilot instruction files
├── docs/                                # Human developer documentation
├── src/
│   ├── styles/                          # Global CSS partials (import hub pattern)
│   │   ├── globals.css                  # @import hub only — do not add styles here
│   │   ├── tokens.css                   # CSS custom properties, dark theme, locale overrides
│   │   ├── reset.css                    # Browser resets
│   │   ├── layout.css                   # .page-layout, .container, .container--narrow
│   │   ├── utilities.css                # .sr-only, :focus-visible, print rules
│   │   ├── buttons.css                  # .btn base + all variants
│   │   └── animations.css              # @keyframes + .skeleton utility
│   ├── app/                             # Next.js App Router entries (thin)
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── places/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── loading.tsx
│   │   │   │       └── not-found.tsx
│   │   │   ├── history/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── layout.tsx                   # Root layout (lang/dir)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── config/
│   │   └── constants.ts                 # Routes, collections, categories, locales
│   ├── features/
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx             # barrel → HeroSection/HeroSection.tsx
│   │   │   │   ├── HeroSection/
│   │   │   │   │   ├── HeroSection.tsx          # implementation + CSS import
│   │   │   │   │   └── HeroSection.css
│   │   │   │   ├── FeaturedPlaces.tsx          # barrel
│   │   │   │   ├── FeaturedPlaces/
│   │   │   │   │   ├── FeaturedPlaces.tsx
│   │   │   │   │   └── FeaturedPlaces.css
│   │   │   │   ├── TownIntroduction.tsx        # barrel
│   │   │   │   ├── TownIntroduction/
│   │   │   │   │   ├── TownIntroduction.tsx
│   │   │   │   │   └── TownIntroduction.css
│   │   │   │   ├── MainCTAs.tsx                # barrel
│   │   │   │   └── MainCTAs/
│   │   │   │       ├── MainCTAs.tsx
│   │   │   │       └── MainCTAs.css
│   │   │   └── view-models/
│   │   │       └── home.view-model.ts
│   │   ├── places/
│   │   │   ├── components/
│   │   │   │   ├── CategoryBadge/
│   │   │   │   │   ├── CategoryBadge.tsx
│   │   │   │   │   └── CategoryBadge.css
│   │   │   │   ├── PlaceCard/
│   │   │   │   │   ├── PlaceCard.tsx
│   │   │   │   │   └── PlaceCard.css
│   │   │   │   ├── PlaceList/
│   │   │   │   │   ├── PlaceList.tsx
│   │   │   │   │   └── PlaceList.css
│   │   │   │   ├── PlaceFilters/
│   │   │   │   │   ├── PlaceFilters.tsx
│   │   │   │   │   └── PlaceFilters.css
│   │   │   │   ├── PlaceDetail/
│   │   │   │   │   ├── PlaceDetail.tsx
│   │   │   │   │   └── PlaceDetail.css
│   │   │   │   ├── ContactCTABlock/
│   │   │   │   │   ├── ContactCTABlock.tsx
│   │   │   │   │   └── ContactCTABlock.css
│   │   │   │   └── ResourceList/
│   │   │   │       ├── ResourceList.tsx
│   │   │   │       └── ResourceList.css
│   │   │   ├── repositories/
│   │   │   │   └── places.repository.ts
│   │   │   ├── mappers/
│   │   │   │   └── place.mapper.ts
│   │   │   ├── schemas/
│   │   │   │   └── place.schema.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       └── index.ts
│   │   ├── history/
│   │   │   └── components/
│   │   │       └── HistoryIntro/
│   │   │           ├── HistoryIntro.tsx         # renders pageContent/history body
│   │   │           └── HistoryIntro.css
│   │   ├── pages/
│   │   │   ├── components/
│   │   │   │   └── ContactSection/
│   │   │   │       ├── ContactSection.tsx
│   │   │   │       └── ContactSection.css
│   │   │   ├── repositories/
│   │   │   │   └── pages.repository.ts
│   │   │   ├── mappers/
│   │   │   │   └── page.mapper.ts
│   │   │   ├── schemas/
│   │   │   │   └── page.schema.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── SiteHeader/
│   │       │   │   ├── SiteHeader.tsx
│   │       │   │   └── SiteHeader.css
│   │       │   ├── SiteFooter/
│   │       │   │   ├── SiteFooter.tsx
│   │       │   │   └── SiteFooter.css
│   │       │   ├── SiteNav/
│   │       │   │   ├── SiteNav.tsx
│   │       │   │   └── SiteNav.css
│   │       │   ├── LocaleSwitcher/
│   │       │   │   ├── LocaleSwitcher.tsx
│   │       │   │   └── LocaleSwitcher.css
│   │       │   ├── ThemeSwitcher/
│   │       │   │   ├── ThemeSwitcher.tsx
│   │       │   │   └── ThemeSwitcher.css
│   │       │   ├── SkeletonLoader/
│   │       │   │   ├── SkeletonLoader.tsx
│   │       │   │   └── SkeletonLoader.css
│   │       │   ├── EmptyState/
│   │       │   │   ├── EmptyState.tsx
│   │       │   │   └── EmptyState.css
│   │       │   ├── HtmlLocaleSync.tsx           # syncs <html> lang/dir on client
│   │       │   └── SafeExternalLink.tsx
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── utils/
│   │           └── index.ts
│   ├── lib/
│   │   ├── env/
│   │   │   └── index.ts                 # Validated env vars
│   │   ├── firebase/
│   │   │   ├── client.ts                # Firebase app + db + storage init
│   │   │   └── collections.ts           # Typed collection references
│   │   ├── i18n/
│   │   │   ├── locales.ts               # Locale type, constants
│   │   │   ├── helpers.ts               # localise(), formatLocaleDate()
│   │   │   └── dictionaries/
│   │   │       ├── ar.ts
│   │   │       └── en.ts
│   │   ├── seo/
│   │   │   ├── metadata.ts              # buildMetadata(), buildAlternates()
│   │   │   └── structured-data.ts       # JSON-LD helpers
│   │   └── validation/
│   │       └── index.ts                 # Shared zod utilities
│   └── types/
│       └── index.ts                     # Global type re-exports
├── .env.example
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Data flow

```
Firestore
  ↓
Repository (features/{domain}/repositories/)
  ↓  uses
Mapper (features/{domain}/mappers/)
  ↓  via
Zod schema (features/{domain}/schemas/)
  ↓  returns typed
Domain model (features/{domain}/types/)
  ↓  passed to
Server Component / Page (app/[locale]/**/)
  ↓  renders
UI Components (features/{domain}/components/)
```

---

## Module dependency rules

```
app/           → features/, lib/
features/      → lib/, shared/ (within features)
lib/           → (no imports from features)
config/        → (no imports — constants only)
types/         → (no imports — types only)
```

---

## Component responsibility matrix

| Layer | Fetches data | Transforms data | Renders UI | Has state |
|---|---|---|---|---|
| `app/**/page.tsx` | ✅ (calls repo) | ❌ | ❌ | ❌ |
| `features/*/view-models/` | ❌ | ✅ | ❌ | ❌ |
| `features/*/components/` | ❌ | ❌ | ✅ | Sometimes |
| `features/*/repositories/` | ✅ | ❌ | ❌ | ❌ |
| `features/*/mappers/` | ❌ | ✅ | ❌ | ❌ |
