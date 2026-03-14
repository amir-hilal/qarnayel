import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLocale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturedPlaces } from '@/features/home/components/FeaturedPlaces';
import { TownIntroduction } from '@/features/home/components/TownIntroduction';
import { fetchSiteSettings } from '@/features/pages/repositories/pages.repository';
import { fetchFeaturedPlaces } from '@/features/places/repositories/places.repository';
import { buildHomeViewModel } from '@/features/home/view-models/home.view-model';
import { ROUTES } from '@/config/constants';

export const revalidate = 3600;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.common.siteName,
    description: dict.home.metaDescription,
    locale,
    pathname: `/${locale}`,
  });
}

export default async function HomePage({ params }: HomePageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, settings, featuredPlaces] = await Promise.all([
    getDictionary(locale),
    fetchSiteSettings(),
    fetchFeaturedPlaces(6),
  ]);

  const vm = buildHomeViewModel(settings, featuredPlaces, locale);

  return (
    <>
      <HeroSection
        heroTitle={vm.heroTitle}
        heroSubtitle={vm.heroSubtitle}
        ctaExplorePlaces={dict.cta.explorePlaces}
        ctaDiscoverHistory={dict.cta.discoverHistory}
        heroImageAlt={vm.heroImageAlt}
        explorePlacesHref={ROUTES.places(locale)}
        discoverHistoryHref={ROUTES.history(locale)}
      />

      {vm.townIntroduction && (
        <TownIntroduction heading={dict.home.aboutHeading} body={vm.townIntroduction} />
      )}

      <FeaturedPlaces
        title={dict.home.featuredPlacesHeading}
        places={vm.featuredPlaces}
        exploreMoreLabel={dict.cta.explorePlaces}
        explorePlacesHref={ROUTES.places(locale)}
      />
    </>
  );
}
