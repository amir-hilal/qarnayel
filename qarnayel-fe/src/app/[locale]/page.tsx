import { ROUTES } from '@/config/constants';
import { FeaturedPlaces } from '@/features/home/components/FeaturedPlaces';
import { HeroSection } from '@/features/home/components/HeroSection';
import { TownIntroduction } from '@/features/home/components/TownIntroduction';
import { buildHomeViewModel } from '@/features/home/view-models/home.view-model';
import { fetchSiteSettings } from '@/features/pages/repositories/pages.repository';
import { fetchFeaturedPlaces } from '@/features/places/repositories/places.repository';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    ...buildMetadata({
      title: dict.common.siteName,
      description: dict.home.metaDescription,
      locale,
      path: `/${locale}`,
    }),
    title: { absolute: dict.common.siteName },
  };
}

export default async function HomePage({
  params,
}: HomePageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, settings, featuredPlaces] = await Promise.all([
    getDictionary(locale),
    fetchSiteSettings(),
    fetchFeaturedPlaces(6),
  ]);

  if (!settings) notFound();
  const vm = buildHomeViewModel(settings, featuredPlaces, locale);

  return (
    <>
      <HeroSection
        heroTitle={vm.heroTitle}
        heroSubtitle={vm.heroSubtitle}
        heroImageUrl="/images/hero.png"
        ctas={vm.ctas}
        heroImageAlt={dict.home.heroImageAlt}
      />

      {vm.townIntroduction && (
        <TownIntroduction
          heading={dict.home.aboutHeading}
          body={vm.townIntroduction}
        />
      )}

      <FeaturedPlaces
        title={dict.home.featuredPlacesTitle}
        places={vm.featuredPlaces}
        exploreMoreLabel={dict.cta.explorePlaces}
        explorePlacesHref={ROUTES.PLACES(locale)}
      />
    </>
  );
}
