# Content Schema

## Collections

| Collection | Document Key | Purpose |
|---|---|---|
| `places` | auto-generated ID | Place entries (all statuses) |
| `pageContent` | slug (e.g. `history`) | Static page content |
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

## PageContent document shape (collection: `pageContent`)

Document ID equals the page slug. The document ID is the canonical identifier; the `slug` field mirrors it for convenience in mapped types.

Active slugs: `history` (and any number of admin-created custom pages). `contact` is a hardcoded route — it is not stored in `pageContent`.

```ts
{
  id: string;               // = slug (document ID)
  slug: string;
  status: PublishStatus;    // 'draft' | 'published' | 'archived'
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: Timestamp;
}
```

### Nav auto-sync behaviour

When the admin creates or edits a `pageContent` document, the nav is automatically kept in sync:

- **Publishing** a page (status → `published`) **appends** it to `siteSettings/global.navItems` if not already present.
- **Drafting or archiving** a page (status → `draft` | `archived`) **removes** it from `navItems` if present.

This is handled by `syncNavItemForPage()` in `settings.repository.ts`. The admin can still manually reorder or add/remove items via the Navigation Order manager in Admin → Pages.

### Required fields before publish

Both locales required:
- `title.ar`, `title.en`
- `body.ar`, `body.en`
- `seo.ar.title`, `seo.ar.description`
- `seo.en.title`, `seo.en.description`

---

## SiteSettings document shape (collection: `siteSettings`, ID: `global`)

```ts
{
  id: 'global';
  siteName: LocalizedText;
  tagline: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  ctas: Array<{ label: LocalizedText; href: string }>;
  townIntroduction: LocalizedText;
  contactEmail?: string;
  contactPhone?: string | null;
  socialLinks?: {
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
  };
  /**
   * Ordered navigation items. Home (/) is always prepended by SiteHeader
   * and is never stored here. Each item is displayed in the nav bar;
   * items beyond the 5th appear in an "Other" dropdown.
   */
  navItems: Array<{
    label: LocalizedText;   // e.g. { ar: 'الأماكن', en: 'Places' }
    path: string;           // locale-agnostic path, e.g. '/places'
  }>;
  updatedAt: Timestamp;
}
```

### navItems management

- Managed via the **Navigation Order** section in Admin → Pages (drag-and-drop, save button).
- Auto-synced when pages are published or drafted (see nav auto-sync behaviour above).
- The Settings form does **not** touch `navItems`; it is updated exclusively via `updateNavItems()`.
- Static routes (e.g. `/places`) must be added manually through the Navigation Order manager.
- The public site cap is **5 visible nav items**; overflow items collapse into an "Other / المزيد" dropdown.

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
