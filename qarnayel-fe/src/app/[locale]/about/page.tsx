import { PAGE_SLUGS } from '@/config/constants';
import { AboutSection } from '@/features/pages/components/AboutSection/AboutSection';
import { fetchPageContent } from '@/features/pages/repositories/pages.repository';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.about.pageTitle,
    description: dict.about.metaDescription,
    locale,
    path: `/${locale}/about`,
  });
}

export default async function AboutPage({
  params,
}: AboutPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = await fetchPageContent(PAGE_SLUGS.ABOUT);

  if (!page) notFound();

  return <AboutSection page={page} locale={locale} />;
}
