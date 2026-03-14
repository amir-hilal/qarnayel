import type { Place, SiteSettings } from '@/types';
import type { Locale } from '@/lib/i18n/locales';
import { localise } from '@/lib/i18n/helpers';
import { ROUTES } from '@/config/constants';
import { getPrimaryImageUrl } from '@/features/places/utils';

// ---------------------------------------------------------------------------
// HomeViewModel — prepared data for the homepage
// ---------------------------------------------------------------------------
export type HomeViewModel = {
  heroTitle: string;
  heroSubtitle: string;
  ctaExplorePlaces: { label: string; href: string };
  ctaDiscoverHistory: { label: string; href: string };
  townIntroduction: string;
  featuredPlaces: FeaturedPlaceViewModel[];
};

export type FeaturedPlaceViewModel = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  imageUrl: string | undefined;
  href: string;
};

export function buildHomeViewModel(
  settings: SiteSettings,
  featuredPlaces: Place[],
  locale: Locale,
): HomeViewModel {
  return {
    heroTitle: localise(settings.heroTitle, locale),
    heroSubtitle: localise(settings.heroSubtitle, locale),
    ctaExplorePlaces: {
      label: localise(settings.ctaExplorePlaces, locale),
      href: ROUTES.PLACES(locale),
    },
    ctaDiscoverHistory: {
      label: localise(settings.ctaDiscoverHistory, locale),
      href: ROUTES.HISTORY(locale),
    },
    townIntroduction: localise(settings.townIntroduction, locale),
    featuredPlaces: featuredPlaces.map(place => ({
      id: place.id,
      slug: place.slug,
      title: localise(place.title, locale),
      shortDescription: localise(place.shortDescription, locale),
      category: place.category,
      imageUrl: getPrimaryImageUrl(place.images),
      href: ROUTES.PLACE_DETAIL(locale, place.slug),
    })),
  };
}
