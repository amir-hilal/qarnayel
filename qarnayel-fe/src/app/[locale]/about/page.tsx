import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLocale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo/metadata';
import { fetchPageContent } from '@/features/pages/repositories/pages.repository';
import { AboutSection } from '@/features/pages/components/AboutSection';
import { PAGE_SLUGS } from '@/config/constants';

export const revalidate = 86400;

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.about.title,
    description: dict.about.metaDescription,
    locale,
    pathname: `/${locale}/about`,
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
