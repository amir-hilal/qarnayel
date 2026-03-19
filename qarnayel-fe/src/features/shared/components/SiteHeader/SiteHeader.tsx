import { ROUTES } from '@/config/constants';
import { LocaleSwitcher } from '@/features/shared/components/LocaleSwitcher/LocaleSwitcher';
import { MobileMenu } from '@/features/shared/components/MobileMenu/MobileMenu';
import type { SiteNavItem } from '@/features/shared/components/SiteNav/SiteNav';
import { SiteNav } from '@/features/shared/components/SiteNav/SiteNav';
import { ThemeSwitcher } from '@/features/shared/components/ThemeSwitcher/ThemeSwitcher';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locales';
import type { SiteSettings } from '@/types';
import Link from 'next/link';
import './SiteHeader.css';

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  settings?: SiteSettings | null;
};

// ---------------------------------------------------------------------------
// SiteHeader — server component shell, contains the client LocaleSwitcher.
// Navigation is built from siteSettings.navItems (data-driven) with a
// hardcoded fallback when settings are unavailable or navItems is empty.
// ---------------------------------------------------------------------------
export function SiteHeader({
  locale,
  dict,
  settings,
}: SiteHeaderProps): React.ReactElement {
  // Home is always the first entry and is not stored in navItems.
  const homeItem: SiteNavItem = {
    href: ROUTES.HOME(locale),
    label: dict.nav.home,
  };

  // Derive remaining nav items from siteSettings.navItems when available,
  // otherwise fall back to the hardcoded defaults (places, history, contact).
  const dynamicItems: SiteNavItem[] =
    settings?.navItems && settings.navItems.length > 0
      ? settings.navItems.map((item) => ({
          href: `/${locale}${item.path}`,
          label: locale === 'ar' ? item.label.ar : item.label.en,
        }))
      : [
          { href: ROUTES.PLACES(locale), label: dict.nav.places },
          { href: ROUTES.HISTORY(locale), label: dict.nav.history },
          { href: ROUTES.CONTACT(locale), label: dict.nav.contact },
        ];

  const allNavItems: SiteNavItem[] = [homeItem, ...dynamicItems];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href={ROUTES.HOME(locale)}
          className="site-header__logo"
          aria-label="Qarnayel — Home"
        >
          {locale === 'ar' ? (
            <span lang="ar">قرنايل</span>
          ) : (
            <span lang="en">Qarnayel</span>
          )}
        </Link>

        <SiteNav
          className="site-header__nav"
          ariaLabel={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
          otherLabel={locale === 'ar' ? 'المزيد' : 'More'}
          items={allNavItems}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <LocaleSwitcher currentLocale={locale} />
          <ThemeSwitcher />
          <MobileMenu
            items={allNavItems}
            ariaLabel={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
            openLabel={locale === 'ar' ? 'فتح القائمة' : 'Open menu'}
            closeLabel={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
          />
        </div>
      </div>
    </header>
  );
}
