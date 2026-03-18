import { PLACE_CATEGORIES, PLACE_TYPES } from '@/config/constants';
import { PlaceFilters } from '@/features/places/components/PlaceFilters/PlaceFilters';
import { PlaceList } from '@/features/places/components/PlaceList/PlaceList';
import { fetchPublishedPlaces } from '@/features/places/repositories/places.repository';
import type { PlaceCategory, PlaceType } from '@/features/places/types';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 1800;

type PlacesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; category?: string }>;
};

export async function generateMetadata({
  params,
}: PlacesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.places.pageTitle,
    description: dict.places.metaDescription,
    locale,
    path: `/${locale}/places`,
  });
}

export default async function PlacesPage({
  params,
  searchParams,
}: PlacesPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const { type, category } = await searchParams;

  const [dict, places] = await Promise.all([
    getDictionary(locale),
    fetchPublishedPlaces({
      ...(type !== undefined ? { placeType: type as PlaceType } : {}),
      ...(category !== undefined
        ? { category: category as PlaceCategory }
        : {}),
    }),
  ]);

  const categoryLabels = Object.fromEntries(
    (Object.keys(dict.categories) as PlaceCategory[]).map((k) => [
      k,
      dict.categories[k],
    ]),
  );

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>
        {dict.places.pageTitle}
      </h1>

      <PlaceFilters
        allLabel={dict.places.allCategories}
        typeLabels={
          {
            all: dict.places.allTypes,
            ...Object.fromEntries(
              (Object.values(PLACE_TYPES) as PlaceType[]).map((t) => [
                t,
                dict.placeTypes[t],
              ]),
            ),
          } as Record<PlaceType | 'all', string>
        }
        categoryLabels={
          {
            all: dict.places.allCategories,
            ...categoryLabels,
          } as Record<PlaceCategory | 'all', string>
        }
        availableTypes={Object.values(PLACE_TYPES) as PlaceType[]}
        availableCategories={Object.values(PLACE_CATEGORIES) as PlaceCategory[]}
        filterByTypeLabel={dict.places.filterByType}
        filterByCategoryLabel={dict.places.filterByCategory}
      />

      <div style={{ marginTop: 'var(--space-8)' }}>
        <PlaceList
          places={places}
          locale={locale}
          emptyCopy={dict.places.noResults}
          categoryLabels={categoryLabels}
        />
      </div>
    </div>
  );
}
