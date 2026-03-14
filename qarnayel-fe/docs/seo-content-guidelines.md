# SEO Content Guidelines

## Overview

Search engine optimisation for the Qarnayel website requires both technical implementation and content quality. This guide covers the content side.

---

## Page title conventions

Format: `{Page Name} | قرنايل - Qarnayel`

Examples:
- Arabic: `الأماكن | قرنايل`
- English: `Places | Qarnayel`
- Place detail: `غابة الأرز | قرنايل` / `Cedar Forest | Qarnayel`
- History: `تاريخ قرنايل` / `History of Qarnayel`

Title lengths:
- Aim for 50–60 characters
- Never truncate the place name

---

## Meta description guidelines

- 120–160 characters
- Must accurately describe the page content
- Must be written in the language of the locale
- Must be provided for both Arabic and English for every place/page
- Include relevant local keywords (e.g. قرنايل، لبنان، المتن)

---

## Arabic SEO considerations

- Use proper Arabic terminology for place categories
- Include Lebanese Arabic and Modern Standard Arabic variants where appropriate
- Include relevant Arabic keywords in descriptions
- Google indexes Arabic content — quality Arabic content ranks well

---

## Place SEO fields

Each place has a `seo` field in Firestore:

```json
{
  "seo": {
    "ar": {
      "title": "مطعم ...",
      "description": "...",
      "keywords": ["مطعم", "قرنايل", "مطبخ لبناني"]
    },
    "en": {
      "title": "Restaurant ...",
      "description": "...",
      "keywords": ["restaurant", "Qarnayel", "Lebanese cuisine"]
    }
  }
}
```

---

## Open Graph images

- Every place should have a primary image that is suitable for social sharing (1200×630 px recommended)
- Static pages (About, History) should use the site's default OG image
- OG image URL comes from the primary `MediaReference` in the place's `images` array

---

## Structured data — JSON-LD

### Tourist attractions

Use `TouristAttraction` schema for `placeType: 'attraction'`:

```json
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Cedar Forest",
  "description": "...",
  "url": "https://qarnayel.lb/en/places/cedar-forest",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.89,
    "longitude": 35.69
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Qarnayel",
    "addressCountry": "LB"
  }
}
```

### Local businesses

Use `LocalBusiness` for `placeType: 'service'`:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Restaurant Name",
  "telephone": "+961...",
  "address": { ... }
}
```

---

## URL structure and crawlability

- All public pages are accessible without JavaScript (Server Components)
- Sitemap at `/sitemap.xml` lists all published place pages in both locales
- `robots.txt` allows all crawlers on public pages
- No `noindex` on public pages

---

## Content freshness

- Update `updatedAt` in Firestore when content changes — this helps search engines understand freshness
- ISR revalidation ensures content updates propagate within hours

---

## Do not

- Use the same title/description across multiple pages
- Write keyword-stuffed descriptions
- Use "Lorem ipsum" or placeholder text in published content
- Leave SEO fields empty before publishing
