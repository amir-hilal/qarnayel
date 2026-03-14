# Media Management Guide

## Overview

All media assets for the Qarnayel website are stored in Firebase Storage. The admin project handles all uploads. The public website reads pre-resolved URLs stored in Firestore.

---

## Media types used

| Type | Usage | Location |
|---|---|---|
| Place images (hero) | Primary place image on cards and detail pages | `places/{placeId}/hero.jpg` |
| Place images (gallery) | Additional images on place detail page | `places/{placeId}/gallery-{n}.jpg` |
| Site assets | Logos, default OG image | `general/` |

---

## Image naming conventions

- All filenames: lowercase, hyphen-separated
- Primary image: always named `hero.jpg` (or `hero.webp`)
- Gallery images: `gallery-1.jpg`, `gallery-2.jpg`, etc.
- No spaces, no special characters, no Arabic in filenames

---

## Image size and format guidelines

| Use | Dimensions | Max size | Format |
|---|---|---|---|
| Hero image | 1600 × 900 px | 400 KB | JPEG or WebP |
| Gallery image | 1200 × 800 px | 300 KB | JPEG or WebP |
| OG image | 1200 × 630 px | 300 KB | JPEG |
| Logo | Scalable | 50 KB | SVG preferred |

---

## MediaReference structure

Every image in Firestore is stored as a `MediaReference` object:

```json
{
  "path": "places/abc123/hero.jpg",
  "url": "https://firebasestorage.googleapis.com/...",
  "alt": {
    "ar": "منظر طبيعي في قرنايل",
    "en": "Scenic view in Qarnayel"
  },
  "isPrimary": true
}
```

- `path`: Storage path for reference / reconstruction
- `url`: Pre-resolved public download URL — used in `<img>` `src`
- `alt`: Must be provided in both Arabic and English
- `isPrimary`: One image per place should be primary (used as OG image, card image)

---

## Adding images via the admin project

1. Open the admin dashboard
2. Navigate to the place you want to add images to
3. Upload images through the admin UI — it handles Storage upload and Firestore update
4. Fill in alt text for both Arabic and English
5. Mark exactly one image as primary

---

## Alt text quality standards

Alt text must:
- Describe what is **in** the image, not just the place name
- Be specific: "Cedar trees with snow-capped peaks in the background" not "forest photo"
- Be translated meaningfully (not word-for-word literal)
- Be fewer than 125 characters

---

## next/image configuration

The `next.config.ts` must include Firebase Storage in the allowed remote patterns:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      pathname: '/v0/b/**',
    },
  ],
},
```

---

## Missing images handling

If a place has no images:
- Place cards show a placeholder illustration with the category icon
- Place detail pages show a placeholder banner
- `alt` on placeholders: `""` (decorative)

---

## Storage CORS configuration

If images fail to load due to CORS errors:

1. Install `gsutil`: `npm install -g @google-cloud/storage`
2. Create a `cors.json` file:
```json
[
  {
    "origin": ["https://qarnayel.lb", "https://staging.qarnayel.lb"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```
3. Apply: `gsutil cors set cors.json gs://your-bucket-name.appspot.com`

---

## Media deletion

When a place is deleted in the admin project, associated Storage files should be cleaned up. This is handled by the admin project's deletion logic, not this public website.
