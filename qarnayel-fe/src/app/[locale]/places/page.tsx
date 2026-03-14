import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLocale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo/metadata';
import { fetchPublishedPlaces } from '@/features/places/repositories/places.repository';
import { PlaceList } from '@/features/places/components/PlaceList';
import { PlaceFilters } from '@/features/places/components/PlaceFilters';
import type { PlaceType, PlaceCategory } from '@/features/places/types';
import { PLACE_TYPES, PLACE_CATEGORIES } from '@/config/constants';

export const revalidate = 1800;

type PlacesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; category?: string }>;
};

export async function generateMetadata({ params }: PlacesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.places.title,
    description: dict.places.metaDescription,
    locale,
    pathname: `/${locale}/places`,
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
      type: type as PlaceType | undefined,
      category: category as PlaceCategory | undefined,
    }),
  ]);

  const categoryLabels = Object.fromEntries(
    (Object.keys(dict.categories) as PlaceCategory[]).map(k => [k, dict.categories[k]])
  );

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>{dict.places.title}</h1>

      <PlaceFilters
        allLabel={dict.common.all}
        typeLabels={{
          all: dict.common.all,
          ...Object.fromEntries(
            (Object.values(PLACE_TYPES) as PlaceType[]).map(t => [t, dict.placeTypes[t]])
          ),
        } as Record<PlaceType | 'all', string>}
        categoryLabels={{
          all: dict.common.all,
          ...categoryLabels,
        } as Record<PlaceCategory | 'all', string>}
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
