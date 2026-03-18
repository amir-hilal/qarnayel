import './SiteFooter.css';
import Link from 'next/link';
import { ROUTES } from '@/config/constants';
import type { Locale } from '@/lib/i18n/locales';
import type { SiteSettings } from '@/types';
import { localise } from '@/lib/i18n/helpers';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';

type SiteFooterProps = {
  locale: Locale;
  settings: SiteSettings | null;
};

export function SiteFooter({ locale, settings }: SiteFooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__site-name">
            {settings ? localise(settings.siteName, locale) : 'Qarnayel | قرنايل'}
          </p>
          {settings?.tagline && (
            <p className="site-footer__tagline">{localise(settings.tagline, locale)}</p>
          )}
        </div>

        <nav className="site-footer__nav" aria-label={locale === 'ar' ? 'روابط سريعة' : 'Quick links'}>
          <Link href={ROUTES.PLACES(locale)} className="site-footer__link">
            {locale === 'ar' ? 'الأماكن' : 'Places'}
          </Link>
          <Link href={ROUTES.HISTORY(locale)} className="site-footer__link">
            {locale === 'ar' ? 'التاريخ' : 'History'}
          </Link>
          <Link href={ROUTES.ABOUT(locale)} className="site-footer__link">
            {locale === 'ar' ? 'عن قرنايل' : 'About'}
          </Link>
          <Link href={ROUTES.CONTACT(locale)} className="site-footer__link">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
          </Link>
        </nav>

        {settings?.socialLinks && (
          <div className="site-footer__social">
            {settings.socialLinks.facebook && (
              <SafeExternalLink
                href={settings.socialLinks.facebook}
                className="site-footer__social-link"
                ariaLabel="Facebook"
              >
                Facebook
              </SafeExternalLink>
            )}
            {settings.socialLinks.instagram && (
              <SafeExternalLink
                href={settings.socialLinks.instagram}
                className="site-footer__social-link"
                ariaLabel="Instagram"
              >
                Instagram
              </SafeExternalLink>
            )}
          </div>
        )}

        <p className="site-footer__copyright">
          &copy; {currentYear} Qarnayel, Lebanon
        </p>
      </div>
    </footer>
  );
}
