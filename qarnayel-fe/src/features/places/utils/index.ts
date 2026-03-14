import type { PlaceCategory, PlaceType } from '@/features/places/types';
import type { Locale } from '@/lib/i18n/locales';

// ---------------------------------------------------------------------------
// Place feature utility functions (pure — no Firebase, no side effects)
// ---------------------------------------------------------------------------

// Get the primary image URL from a place's images array
export function getPrimaryImageUrl(
  images: { url: string; isPrimary: boolean }[],
): string | undefined {
  return images.find(img => img.isPrimary)?.url ?? images[0]?.url;
}

// Build the places listing URL with optional filter params
export function buildPlacesUrl(
  locale: Locale,
  filters: { category?: PlaceCategory; type?: PlaceType } = {},
): string {
  const base = `/${locale}/places`;
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.type) params.set('type', filters.type);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// Check whether a place has any contact info available
export function hasContactInfo(contact: {
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
}): boolean {
  return !!(contact.phone ?? contact.email ?? contact.whatsapp ?? contact.website);
}
