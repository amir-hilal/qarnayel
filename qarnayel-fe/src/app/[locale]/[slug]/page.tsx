import { fetchPublishedPageBySlug } from '@/features/pages/repositories/pages.repository';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Dynamic page renderer for admin-created pageContent pages.
// Static routes (history/, contact/, places/) take precedence over this
// dynamic segment in Next.js App Router. Only new slugs reach here.

export const revalidate = 3600;

type DynamicPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const page = await fetchPublishedPageBySlug(slug);
  if (!page) return {};

  const title = locale === 'ar' ? page.seo.ar.title : page.seo.en.title;
  const description =
    locale === 'ar' ? page.seo.ar.description : page.seo.en.description;

  return buildMetadata({
    title,
    description,
    locale,
    path: `/${locale}/${slug}`,
  });
}

export default async function DynamicPageContentPage({
  params,
}: DynamicPageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const page = await fetchPublishedPageBySlug(slug);

  if (!page) notFound();

  const title = locale === 'ar' ? page.title.ar : page.title.en;
  const body = locale === 'ar' ? page.body.ar : page.body.en;

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      <h1 style={{ marginBlockEnd: 'var(--space-8)' }}>{title}</h1>
      <div
        style={{
          fontSize: 'var(--font-size-base)',
          lineHeight: 1.8,
          color: 'var(--color-text)',
        }}
      >
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i} style={{ marginBlockEnd: 'var(--space-4)' }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
