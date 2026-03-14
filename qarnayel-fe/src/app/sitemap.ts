import { ROUTES } from '@/config/constants';
import { fetchAllPublishedSlugs } from '@/features/places/repositories/places.repository';
import { LOCALES } from '@/lib/i18n/locales';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://qarnayel.lb';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchAllPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}${ROUTES.home(locale)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}${ROUTES.home(l)}`]),
        ),
      },
    },
    {
      url: `${SITE_URL}${ROUTES.places(locale)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${ROUTES.history(locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${ROUTES.about(locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}${ROUTES.contact(locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]);

  const placeRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${SITE_URL}${ROUTES.placeDetail(locale, slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}${ROUTES.placeDetail(l, slug)}`]),
        ),
      },
    })),
  );

  return [...staticRoutes, ...placeRoutes];
}
