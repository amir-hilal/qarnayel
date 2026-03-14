# Firebase Storage Guide

## Overview

Firebase Storage is used to host place images and any other media assets. The **admin project** handles all uploads. The **public website** only reads public download URLs.

---

## Storage folder structure

```
/places/
  {placeId}/
    hero.jpg              ← Primary display image
    gallery-1.jpg
    gallery-2.jpg
    ...
/general/
  og-default.jpg          ← Default OG image for pages without a specific image
  favicon.png
  logo.svg
```

### Rules

- `placeId` matches the Firestore document ID of the corresponding place
- All image filenames should be lowercase, hyphenated, and descriptive
- The admin project is responsible for uploading and managing files
- This project never calls any Storage write API

---

## How media references work

When the admin project uploads an image to Storage, it stores a `MediaReference` object in the place's Firestore document:

```json
{
  "path": "places/abc123/hero.jpg",
  "url": "https://firebasestorage.googleapis.com/v0/b/{bucket}/o/places%2Fabc123%2Fhero.jpg?alt=media&token=...",
  "alt": {
    "ar": "منظر من غابة قرنايل",
    "en": "View from Qarnayel Cedar Forest"
  },
  "isPrimary": true
}
```

The public website reads the `url` field directly and renders it using `next/image`.

---

## Rendering images

Use `next/image` for all images from Firebase Storage:

```tsx
import Image from 'next/image';
import type { MediaReference } from '@/types';
import type { Locale } from '@/lib/i18n/locales';
import { localise } from '@/lib/i18n/helpers';

type Props = {
  media: MediaReference;
  locale: Locale;
};

export function PlaceImage({ media, locale }: Props) {
  return (
    <Image
      src={media.url}
      alt={localise(media.alt, locale)}
      width={800}
      height={600}
      className="place-image"
    />
  );
}
```

---

## next.config.ts — allowed image domains

You must add Firebase Storage hostname(s) to `next.config.ts`:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
};
```

---

## Alt text requirements

- Every `MediaReference` must have `alt.ar` and `alt.en`
- Alt text must describe the image content meaningfully
- Generic alt text like "image" or "photo" is not acceptable
- Alt text is managed by the admin project at upload time

---

## Storage bucket separation

Each Firebase project (staging and production) has its own Storage bucket. The bucket name is set by `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in each environment's `.env` file.

| Environment | Example bucket |
|---|---|
| Staging | `qarnayel-staging.appspot.com` |
| Production | `qarnayel-production.appspot.com` |

---

## Image optimisation guidelines

The admin project should upload images at appropriate sizes:
- Hero images: 1600×900 px minimum
- Card images: 800×600 px minimum
- Format: JPEG or WebP preferred
- Maximum file size: 500 KB per image (compress before upload)

The public website uses `next/image` which handles resizing and format conversion automatically via Next.js image optimisation.

---

## No direct Storage SDK calls in this project

The public website **must not** use:
- `uploadBytes()`
- `uploadBytesResumable()`
- `deleteObject()`
- `updateMetadata()`

These are admin-only operations. Only `getDownloadURL()` is technically available but is unnecessary since URLs are pre-stored in Firestore.
