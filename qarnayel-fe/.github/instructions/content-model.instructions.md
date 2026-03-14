---
applyTo: 'src/features/**,src/types/**'
---

# Content Model Rules

## Core domain types

### PublishStatus

```ts
type PublishStatus = 'draft' | 'published' | 'archived';
```

The public website **only queries `published` documents**.

### Locale

```ts
type Locale = 'ar' | 'en';
```

### LocalizedText

```ts
type LocalizedText = {
  ar: string;
  en: string;
};
```

Used for every field that must appear in Arabic and English.

### PlaceType

```ts
type PlaceType = 'attraction' | 'service';
```

- `attraction`: Forests, lakes, landmarks, natural sites
- `service`: Restaurants, shops, pharmacies, salons

### PlaceCategory

```ts
type PlaceCategory =
  | 'forest'
  | 'lake'
  | 'restaurant'
  | 'shop'
  | 'pharmacy'
  | 'salon'
  | 'landmark'
  | 'other';
```

### ContactMode

```ts
type ContactMode = 'guide' | 'owner' | 'none';
```

- `guide`: Contact a local guide to reach or learn about this place
- `owner`: Contact the business/place directly
- `none`: No contact CTA available

---

## Place model

```ts
type Place = {
  id: string;
  slug: string;
  placeType: PlaceType;
  category: PlaceCategory;
  contactMode: ContactMode;
  status: PublishStatus; // always 'published' when returned from public repo
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
  createdAt: string; // ISO date string
  updatedAt: string;
};
```

### PlaceContact

```ts
type PlaceContact = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
};
```

### PlaceLocation

```ts
type PlaceLocation = {
  mapUrl?: string;
  lat?: number;
  lng?: number;
  address?: LocalizedText;
};
```

### PlaceResource

```ts
type PlaceResource = {
  label: LocalizedText;
  url: string;
  type: 'article' | 'video' | 'pdf' | 'website' | 'other';
};
```

---

## MediaReference model

```ts
type MediaReference = {
  path: string; // Firebase Storage path e.g. places/{id}/hero.jpg
  url: string; // Public download URL
  alt: LocalizedText;
  isPrimary: boolean;
};
```

---

## LocalizedSeo model

```ts
type LocalizedSeo = {
  ar: SeoFields;
  en: SeoFields;
};

type SeoFields = {
  title: string;
  description: string;
  keywords?: string[];
};
```

---

## PageContent model

```ts
type PageContent = {
  id: string;
  slug: string; // matches page e.g. 'about', 'contact'
  title: LocalizedText;
  body: LocalizedText;
  seo: LocalizedSeo;
  updatedAt: string;
};
```

---

## HistoryEntry model

```ts
type HistoryEntry = {
  id: string;
  order: number;
  title: LocalizedText;
  body: LocalizedText;
  period?: LocalizedText; // e.g. "Ottoman era", "Byzantine period"
  sources: HistorySource[];
  status: PublishStatus;
  updatedAt: string;
};

type HistorySource = {
  label: LocalizedText;
  url?: string;
  // TODO: All history content must be verified against primary or secondary academic sources
};
```

---

## SiteSettings model

```ts
type SiteSettings = {
  siteName: LocalizedText;
  tagline: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  ctaExplorePlaces: LocalizedText;
  ctaDiscoverHistory: LocalizedText;
  townIntroduction: LocalizedText;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: SocialLinks;
};

type SocialLinks = {
  facebook?: string;
  instagram?: string;
};
```

---

## Firestore collection schema

| Collection     | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `places`       | All place documents. Query with `status == 'published'`                   |
| `history`      | History entries. Query with `status == 'published'`, order by `order` asc |
| `pageContent`  | Static page content (about, contact, etc.)                                |
| `siteSettings` | Single-document global settings (`doc('siteSettings', 'global')`)         |

---

## Field completeness requirements

| Field path           | ar required | en required |
| -------------------- | ----------- | ----------- |
| `title`              | ✅          | ✅          |
| `subtitle`           | ✅          | ✅          |
| `shortDescription`   | ✅          | ✅          |
| `description`        | ✅          | ✅          |
| `seo.ar.title`       | ✅          | —           |
| `seo.en.title`       | —           | ✅          |
| `seo.ar.description` | ✅          | —           |
| `seo.en.description` | —           | ✅          |
| `images[].alt`       | ✅          | ✅          |
| `location.address`   | ✅          | ✅          |
