import { PAGE_SLUGS } from '@/config/constants';
import { ContactSection } from '@/features/pages/components/ContactSection/ContactSection';
import {
  fetchPageContent,
  fetchSiteSettings,
} from '@/features/pages/repositories/pages.repository';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale } from '@/lib/i18n/locales';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    title: dict.contact.pageTitle,
    description: dict.contact.metaDescription,
    locale,
    path: `/${locale}/contact`,
  });
}

export default async function ContactPage({
  params,
}: ContactPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, page, settings] = await Promise.all([
    getDictionary(locale),
    fetchPageContent(PAGE_SLUGS.CONTACT),
    fetchSiteSettings(),
  ]);

  if (!page) notFound();

  return (
    <ContactSection
      page={page}
      settings={settings}
      locale={locale}
      emailLabel={dict.contact.emailLabel}
      phoneLabel={dict.contact.phoneLabel}
      socialLabel={dict.contact.socialLabel}
    />
  );
}
