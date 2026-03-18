import { NAV_ITEMS } from '@/config/constants';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';
import { SiteNav } from '@/features/shared/components/SiteNav/SiteNav';
import type { Dictionary } from '@/lib/i18n';
import { localise } from '@/lib/i18n/helpers';
import type { Locale } from '@/lib/i18n/locales';
import type { SiteSettings } from '@/types';
import './SiteFooter.css';

type NavKey = keyof Dictionary['nav'];

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings | null;
};

export function SiteFooter({
  locale,
  dict,
  settings,
}: SiteFooterProps): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__site-name">
            {settings
              ? localise(settings.siteName, locale)
              : 'Qarnayel | قرنايل'}
          </p>
          {settings?.tagline && (
            <p className="site-footer__tagline">
              {localise(settings.tagline, locale)}
            </p>
          )}
        </div>

        <SiteNav
          className="site-footer__nav"
          ariaLabel={locale === 'ar' ? 'روابط سريعة' : 'Quick links'}
          items={NAV_ITEMS.filter((item) => item.key !== 'home').map(
            (item) => ({
              href: item.route(locale),
              label: dict.nav[item.key as NavKey],
            }),
          )}
        />

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
