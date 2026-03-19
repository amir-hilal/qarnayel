import { PAGE_SLUGS } from '@/config/constants';
import { HistoryIntro } from '@/features/history/components/HistoryIntro/HistoryIntro';
import { fetchPageContent } from '@/features/pages/repositories/pages.repository';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

type HistoryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.history.pageTitle,
    description: dict.history.metaDescription,
    locale,
    path: `/${locale}/history`,
  });
}

export default async function HistoryPage({
  params,
}: HistoryPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, historyPage] = await Promise.all([
    getDictionary(locale),
    fetchPageContent(PAGE_SLUGS.HISTORY),
  ]);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <h1 style={{ marginBottom: 'var(--space-12)' }}>
        {dict.history.pageTitle}
      </h1>
      {historyPage && <HistoryIntro body={historyPage.body} locale={locale} />}
    </div>
  );
}
