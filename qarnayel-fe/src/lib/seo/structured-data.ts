import type { Place } from '@/types';
import type { Locale } from '@/lib/i18n/locales';
import { localise } from '@/lib/i18n/helpers';
import { env } from '@/lib/env';
import { ROUTES } from '@/config/constants';

// ---------------------------------------------------------------------------
// JSON-LD structured data for a TouristAttraction
// ---------------------------------------------------------------------------
export function buildTouristAttractionJsonLd(place: Place, locale: Locale): string {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: localise(place.title, locale),
    description: localise(place.shortDescription, locale),
    url: `${siteUrl}${ROUTES.PLACE_DETAIL(locale, place.slug)}`,
    ...(place.images[0] ? { image: place.images[0].url } : {}),
    ...(place.location.lat && place.location.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.location.lat,
            longitude: place.location.lng,
          },
        }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'ar' ? 'قرنايل' : 'Qarnayel',
      addressRegion: locale === 'ar' ? 'جبل لبنان' : 'Mount Lebanon',
      addressCountry: 'LB',
    },
  };

  return JSON.stringify(jsonLd);
}

// ---------------------------------------------------------------------------
// JSON-LD structured data for a LocalBusiness
// ---------------------------------------------------------------------------
export function buildLocalBusinessJsonLd(place: Place, locale: Locale): string {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: localise(place.title, locale),
    description: localise(place.shortDescription, locale),
    url: `${siteUrl}${ROUTES.PLACE_DETAIL(locale, place.slug)}`,
    ...(place.contact.phone ? { telephone: place.contact.phone } : {}),
    ...(place.contact.website ? { sameAs: [place.contact.website] } : {}),
    ...(place.images[0] ? { image: place.images[0].url } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'ar' ? 'قرنايل' : 'Qarnayel',
      addressRegion: locale === 'ar' ? 'جبل لبنان' : 'Mount Lebanon',
      addressCountry: 'LB',
    },
  };

  return JSON.stringify(jsonLd);
}

// ---------------------------------------------------------------------------
// Build the correct JSON-LD based on placeType
// ---------------------------------------------------------------------------
export function buildPlaceJsonLd(place: Place, locale: Locale): string {
  if (place.placeType === 'attraction') {
    return buildTouristAttractionJsonLd(place, locale);
  }
  return buildLocalBusinessJsonLd(place, locale);
}
