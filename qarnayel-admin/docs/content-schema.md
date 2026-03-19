# Content Schema

## Collections

| Collection | Document Key | Purpose |
|---|---|---|
| `places` | auto-generated ID | Place entries (all statuses) |
| `pageContent` | slug (e.g. `history`) | Static page content |
| `media` | auto-generated ID | Media asset metadata |
| `siteSettings` | `global` | Global site configuration |

---

## Shared field types

### LocalizedText

```ts
type LocalizedText = { ar: string; en: string };
```

Every user-visible text field uses this shape. One document, both languages.

### LocalizedSeo

```ts
type SeoFields = { title: string; description: string; keywords?: string[] };
type LocalizedSeo = { ar: SeoFields; en: SeoFields };
```

### PublishStatus

```ts
type PublishStatus = 'draft' | 'published' | 'archived';
```

### PlaceType

```ts
type PlaceType = 'attraction' | 'service';
```

### PlaceCategory

```ts
type PlaceCategory = 'forest' | 'lake' | 'restaurant' | 'shop' | 'pharmacy' | 'salon' | 'landmark' | 'other';
```

### ContactMode

```ts
type ContactMode = 'guide' | 'owner' | 'none';
```

Guide contact applies to nature attractions; owner contact applies to businesses.

---

## Place document shape

```ts
{
  id: string;                    // Firestore document ID
  slug: string;                  // URL-safe identifier (e.g. "qornayel-lake")
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
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    website?: string;
  };
  location: {
    mapUrl?: string;
    lat?: number;
    lng?: number;
    address?: LocalizedText;
  };
  images: MediaReference[];
  resources: PlaceResource[];
  createdAt: Timestamp;          // Firestore Timestamp
  updatedAt: Timestamp;          // Firestore Timestamp
}
```

### Required fields before publish

Both locales required:
- `title.ar`, `title.en`
- `shortDescription.ar`, `shortDescription.en`
- `description.ar`, `description.en`
- `seo.ar.title`, `seo.ar.description`
- `seo.en.title`, `seo.en.description`

Non-localized required:
- `slug`, `placeType`, `category`, `contactMode`, `status`

---

## MediaReference (embedded in place.images)

```ts
type MediaReference = {
  storagePath: string;       // Firebase Storage path
  downloadUrl: string;       // Public download URL
  altText?: LocalizedText;   // Accessibility alt text
  width?: number;
  height?: number;
};
```

---

## PlaceResource (embedded in place.resources)

```ts
type PlaceResource = {
  label: LocalizedText;
  url: string;               // Must be a valid URL
};
```

---

## Media asset document shape (collection: `media`)

```ts
{
  id: string;
  storagePath: string;
  downloadUrl: string;
  altText?: LocalizedText;
  mimeType: string;          // e.g. "image/jpeg"
  sizeBytes: number;
  width?: number;
  height?: number;
  uploadedAt: Timestamp;
  uploadedBy?: string;       // Firebase UID
}
```

---

## PageContent document shape (collection: `pageContent`)

Document IDs match the page slug. Active slugs: `history`, `contact`.

```ts
{
  id: string;               // = slug
  slug: string;
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: Timestamp;
}
```

---

## SiteSettings document shape (collection: `siteSettings`, ID: `global`)

```ts
{
  id: 'global';
  cta: {
    explorePlaces: LocalizedText;
    discoverHistory: LocalizedText;
  };
  contactEmail?: string;
  contactPhone?: string;
  updatedAt: Timestamp;
}
```

---

## Status workflow

```
draft ─────────────────────────────────► published (requires translation completeness)
  ▲                                           │
  │                                           ▼
  └──────────── archived ◄────────────────────┘
```

- `archived` documents are never publicly visible
- The public website ONLY reads documents where `status === 'published'`
- The admin reads all statuses
- Hard deletion is not standard — use archiving
