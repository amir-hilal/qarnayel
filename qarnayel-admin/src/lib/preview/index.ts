import { env } from '@/lib/env';

// =============================================================================
// Preview URL builder
// Builds public website URLs for previewing admin-managed content.
// =============================================================================

type PreviewLocale = 'ar' | 'en';

function getPublicBaseUrl(): string {
  return env.NEXT_PUBLIC_PUBLIC_SITE_URL.replace(/\/$/, '');
}

/**
 * Build a preview URL for a place on the public website.
 */
export function buildPlacePreviewUrl(
  slug: string,
  locale: PreviewLocale = 'en',
): string {
  return `${getPublicBaseUrl()}/${locale}/places/${slug}`;
}

/**
 * Build a preview URL for the history page.
 */
export function buildHistoryPreviewUrl(locale: PreviewLocale = 'en'): string {
  return `${getPublicBaseUrl()}/${locale}/history`;
}

/**
 * Build a preview URL for a static page by slug.
 */
export function buildPagePreviewUrl(
  slug: string,
  locale: PreviewLocale = 'en',
): string {
  return `${getPublicBaseUrl()}/${locale}/${slug}`;
}

/**
 * Build a preview URL for the homepage.
 */
export function buildHomePreviewUrl(locale: PreviewLocale = 'en'): string {
  return `${getPublicBaseUrl()}/${locale}`;
}
