import { fetchSiteSettings } from '@/features/pages/repositories/pages.repository';
import { SiteFooter } from '@/features/shared/components/SiteFooter';
import { SiteHeader } from '@/features/shared/components/SiteHeader';
import { getDictionary } from '@/lib/i18n';
import { getDir } from '@/lib/i18n/helpers';
import { isValidLocale, LOCALES } from '@/lib/i18n/locales';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ---------------------------------------------------------------------------
// Locale layout — sets html lang/dir, renders header + footer shell
// ---------------------------------------------------------------------------
export async function generateStaticParams(): Promise<{ locale: string }[]> {
  return LOCALES.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: {
      template: `%s | ${dict.common.siteName}`,
      default: dict.common.siteName,
    },
    description: dict.home.metaDescription,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<React.ReactElement> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    fetchSiteSettings(),
  ]);

  return (
    <html lang={locale} dir={getDir(locale)}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=dark_mode,language,light_mode"
        />
      </head>
      <body>
        <div className="page-layout">
          <SiteHeader locale={locale} dict={dict} />
          <main id="main-content" className="page-main">
            {children}
          </main>
          <SiteFooter locale={locale} settings={settings} />
        </div>
      </body>
    </html>
  );
}
