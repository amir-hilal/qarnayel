import { HistorySection } from '@/features/history/components/HistorySection/HistorySection';
import { fetchPublishedHistory } from '@/features/history/repositories/history.repository';
import { EmptyState } from '@/features/shared/components/EmptyState/EmptyState';
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

  const [dict, entries] = await Promise.all([
    getDictionary(locale),
    fetchPublishedHistory(),
  ]);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <h1 style={{ marginBottom: 'var(--space-12)' }}>
        {dict.history.pageTitle}
      </h1>
      {entries.length === 0 ? (
        <EmptyState message={dict.history.noHistory} />
      ) : (
        entries.map((entry) => (
          <HistorySection
            key={entry.id}
            entry={entry}
            locale={locale}
            sourcesHeading={dict.history.sources}
          />
        ))
      )}
    </div>
  );
}
