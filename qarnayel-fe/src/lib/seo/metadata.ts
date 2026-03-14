import { env } from '@/lib/env';
import type { Locale } from '@/lib/i18n/locales';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/locales';
import type { LocalizedSeo, LocalizedText } from '@/types';
import type { Metadata } from 'next';

type BuildMetadataInput = {
  locale: Locale;
  title: string | LocalizedText;
  description: string | LocalizedText;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

// ---------------------------------------------------------------------------
// buildMetadata — creates a Next.js Metadata object for a page
// ---------------------------------------------------------------------------
export function buildMetadata({
  locale,
  title,
  description,
  path,
  image,
  keywords,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const resolvedTitle = typeof title === 'string' ? title : title[locale];
  const resolvedDescription =
    typeof description === 'string' ? description : description[locale];

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${path}`;

  const alternates: Record<Locale, string> = {} as Record<Locale, string>;
  for (const loc of LOCALES) {
    const alternatePath = path.replace(`/${locale}`, `/${loc}`);
    alternates[loc] = `${siteUrl}${alternatePath}`;
  }

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...alternates,
        'x-default': `${siteUrl}/${DEFAULT_LOCALE}${path.replace(`/${locale}`, '')}`,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      locale: locale === 'ar' ? 'ar_LB' : 'en_LB',
      alternateLocale: locale === 'ar' ? 'en_LB' : 'ar_LB',
      siteName: 'Qarnayel | قرنايل',
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ---------------------------------------------------------------------------
// buildLocalizedSeoMetadata — builds metadata from a LocalizedSeo object
// ---------------------------------------------------------------------------
export function buildLocalizedSeoMetadata(
  seo: LocalizedSeo,
  locale: Locale,
  path: string,
  image?: string,
): Metadata {
  return buildMetadata({
    locale,
    title: seo[locale].title,
    description: seo[locale].description,
    path,
    ...(seo[locale].keywords !== undefined
      ? { keywords: seo[locale].keywords }
      : {}),
    ...(image !== undefined ? { image } : {}),
  });
}
