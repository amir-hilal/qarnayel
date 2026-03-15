# Preview Workflow

## Purpose

The preview feature lets admins see how a place or content item will look on the public website before or after publishing.

## How it works

1. Admin edits a place in the admin dashboard
2. Admin clicks the "Preview" button in the publish section
3. The admin app builds a preview URL for the public website
4. The URL opens in a new tab, showing the place as it would appear to visitors

## Preview URL structure

Preview URLs are built by `buildPreviewUrl(slug, locale)` in `lib/preview/index.ts`:

```
{PUBLIC_SITE_URL}/{locale}/places/{slug}
```

Environment-aware:
- Development: `http://localhost:3000/en/places/{slug}`
- Staging: `https://staging.qarnayel.com/en/places/{slug}`
- Production: `https://qarnayel.com/en/places/{slug}`

The public URL is configured via `NEXT_PUBLIC_PUBLIC_SITE_URL`.

## Preview for unpublished content

If a place is in `draft` status, the public website will NOT show it (it only shows `published` content). Preview for drafts opens the public URL anyway — it will show a 404 if the content is not yet published.

> **Future enhancement**: implement a draft preview token or `/api/preview` route on the public website to allow previewing draft content securely.

## Implementation

```ts
// lib/preview/index.ts
export function buildPreviewUrl(slug: string, locale: 'ar' | 'en' = 'en'): string {
  const baseUrl = env.NEXT_PUBLIC_PUBLIC_SITE_URL.replace(/\/$/, '');
  return `${baseUrl}/${locale}/places/${slug}`;
}
```

## Preview button behaviour

- A "Preview" or "View on site" button appears in the `PublishSection` form component
- Clicking opens the preview URL in a **new tab**
- Always links to the currently saved version (not the unsaved form state)
- Available for all statuses — though draft previews will 404 until published

## History and page content preview

Same pattern applies:
- History page: `{PUBLIC_SITE_URL}/{locale}/history`
- About page: `{PUBLIC_SITE_URL}/{locale}/about`
- Contact page: `{PUBLIC_SITE_URL}/{locale}/contact`
