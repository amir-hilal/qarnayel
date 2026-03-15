---
applyTo: 'src/features/*/schemas/**,src/features/*/types/**,src/types/**'
---

# Content Schema Instructions

## Domain types

All canonical domain types live in `src/types/index.ts`. Feature-specific type re-exports live in `features/{domain}/types/index.ts`.

### Core types

```ts
type Locale = 'ar' | 'en';
type LocalizedText = { ar: string; en: string };
type SeoFields = { title: string; description: string; keywords?: string[] };
type LocalizedSeo = { ar: SeoFields; en: SeoFields };
type PublishStatus = 'draft' | 'published' | 'archived';
type PlaceType = 'attraction' | 'service';
type PlaceCategory =
  | 'forest'
  | 'lake'
  | 'restaurant'
  | 'shop'
  | 'pharmacy'
  | 'salon'
  | 'landmark'
  | 'other';
type ContactMode = 'guide' | 'owner' | 'none';
```

### Place domain model

```ts
type PlaceContact = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
};

type PlaceLocation = {
  mapUrl?: string;
  lat?: number;
  lng?: number;
  address?: LocalizedText;
};

type PlaceResource = {
  label: LocalizedText;
  url: string;
};

type MediaReference = {
  storagePath: string;
  downloadUrl: string;
  altText?: LocalizedText;
  width?: number;
  height?: number;
};

type Place = {
  id: string;
  slug: string;
  placeType: PlaceType;
  category: PlaceCategory;
  contactMode: ContactMode;
  status: PublishStatus;
  featured: boolean;
  title: LocalizedText;
  subtitle: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  seo: LocalizedSeo;
  contact: PlaceContact;
  location: PlaceLocation;
  images: MediaReference[];
  resources: PlaceResource[];
  createdAt: string;
  updatedAt: string;
};
```

### Form values model

`PlaceFormValues` is the form-state equivalent of `Place`. It must NOT include `id`, `createdAt`, `updatedAt` (these are system fields set by the repository):

```ts
type PlaceFormValues = Omit<Place, 'id' | 'createdAt' | 'updatedAt'>;
```

## Firestore collections

| Collection     | Purpose                                                 |
| -------------- | ------------------------------------------------------- |
| `places`       | All place documents (all statuses)                      |
| `history`      | History entry documents                                 |
| `pageContent`  | Static page content (about, contact, homepage sections) |
| `media`        | Media asset metadata records                            |
| `siteSettings` | Global settings (single `global` document)              |

## Schema rules

- All zod schemas live in `features/{domain}/schemas/`
- Two schemas per domain: one for Firestore document validation (`placeSchema`), one for form values (`placeFormSchema`)
- The Firestore schema includes `id`, `createdAt`, `updatedAt`; the form schema does not
- Use `z.enum([...])` for all enum-like fields — never `z.string()` for typed values
- Use `localizedTextSchema` and `localizedSeoSchema` from `@/lib/validation` for shared sub-schemas
- Required localized fields for publish: `title`, `shortDescription`, `description`, `seo` (both `ar` and `en`)

## Status workflow

```
draft → published   (blocked if translation incomplete)
published → draft   (allowed)
published → archived
archived → draft    (restore)
```

- Never hard-delete published or archived documents
- Archiving sets `status: 'archived'` only
- The public website only reads documents with `status === 'published'`
- Admin reads all statuses

## Media model

```ts
type MediaAsset = {
  id: string;
  storagePath: string;
  downloadUrl: string;
  altText?: LocalizedText;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  uploadedBy?: string;
};
```

## HistoryEntry model

```ts
type HistoryEntry = {
  id: string;
  title: LocalizedText;
  summary?: LocalizedText;
  content: LocalizedText;
  periodStart: string;
  periodEnd?: string;
  sources: PlaceResource[];
  status: PublishStatus;
  order: number;
  seo?: LocalizedSeo;
  createdAt: string;
  updatedAt: string;
};
```

## PageContent model

```ts
type PageContent = {
  id: string;
  slug: string;
  status: PublishStatus;
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: string;
};
```

## SiteSettings model

```ts
type SiteSettings = {
  id: string;
  siteName: LocalizedText;
  tagline: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  ctaExplorePlaces: LocalizedText;
  ctaDiscoverHistory: LocalizedText;
  townIntroduction: LocalizedText;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  updatedAt: string;
};
```
