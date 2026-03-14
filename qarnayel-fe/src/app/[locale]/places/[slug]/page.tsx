import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLocale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildPlaceJsonLd } from '@/lib/seo/structured-data';
import {
  fetchPlaceBySlug,
  fetchAllPublishedSlugs,
} from '@/features/places/repositories/places.repository';
import { PlaceDetail } from '@/features/places/components/PlaceDetail';

export const revalidate = 3600;

type PlaceDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await fetchAllPublishedSlugs();
  return ['ar', 'en'].flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const place = await fetchPlaceBySlug(slug);
  if (!place) return {};
  const l = locale as 'ar' | 'en';
  return buildMetadata({
    title: place.title[l] ?? place.title.ar,
    description: place.shortDescription[l] ?? place.shortDescription.ar ?? '',
    locale,
    pathname: `/${locale}/places/${slug}`,
  });
}

export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, place] = await Promise.all([
    getDictionary(locale),
    fetchPlaceBySlug(slug),
  ]);

  if (!place) notFound();

  const l = locale as 'ar' | 'en';
  const jsonLd = buildPlaceJsonLd(place, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaceDetail
        place={place}
        locale={locale}
        dict={{
          contactLabel: dict.places.contactLabel,
          visitLabel: dict.places.visitLabel,
          websiteLabel: dict.places.websiteLabel,
          resourcesHeading: dict.places.resourcesHeading,
          mapLinkLabel: dict.places.mapLinkLabel,
          categoryLabel: dict.categories[place.category],
        }}
      />
    </>
  );
}
