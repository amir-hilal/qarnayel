# Maps and Location Setup

## Overview

Place location data consists of:
- A Google Maps URL (opens in Google Maps)
- Optional latitude and longitude coordinates
- An optional localised address string

---

## Firestore location structure

```json
{
  "location": {
    "mapUrl": "https://maps.google.com/?q=...",
    "lat": 33.9,
    "lng": 35.7,
    "address": {
      "ar": "قرنايل، قضاء المتن، لبنان",
      "en": "Qarnayel, Metn District, Lebanon"
    }
  }
}
```

---

## Rendering a map link

The public website displays a "View on Map" link that opens Google Maps in a new tab. Use the `SafeExternalLink` component:

```tsx
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';

{place.location.mapUrl && (
  <SafeExternalLink href={place.location.mapUrl}>
    {locale === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
  </SafeExternalLink>
)}
```

---

## No embedded map iframes (default)

By default, this project does **not** embed interactive map iframes. This keeps the page fast and avoids Google Maps API quota issues.

To add an embedded map in the future:
1. Obtain a Google Maps Embed API key
2. Add `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` to `.env.example`
3. Store the key in Vercel environment variables
4. Create an `EmbeddedMap` component that uses the Maps Embed API
5. Never hard-code the API key

---

## Coordinates (lat/lng)

If coordinates are provided, they can be used to:
- Generate a static map image (Google Static Maps API)
- Build a custom map pin URL
- Pass to a future embedded map component

Coordinates are stored as number fields in Firestore and typed as `number | undefined` in the domain model.

---

## Google Maps URL guidelines

When adding map URLs in the admin, use:
- `https://maps.google.com/?q={lat},{lng}` for coordinate-based links
- `https://maps.google.com/maps?q={address}` for address-based links
- `https://goo.gl/maps/...` short links are acceptable but less stable

The URL is stored by the admin project and displayed as-is by the public website.

---

## Lebanon-specific notes

- Qarnayel is in the Metn District, Mount Lebanon Governorate
- Approximate coordinates: 33.89°N, 35.69°E
- Many local addresses in Lebanon lack standardised postal codes — coordinate-based links are more reliable
- Google Maps coverage in Qarnayel is reasonable but some places may need manual coordinate entry
