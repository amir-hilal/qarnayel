import { NAV_ITEMS, ROUTES } from '@/config/constants';
import { LocaleSwitcher } from '@/features/shared/components/LocaleSwitcher/LocaleSwitcher';
import { ThemeSwitcher } from '@/features/shared/components/ThemeSwitcher/ThemeSwitcher';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locales';
import Link from 'next/link';
import './SiteHeader.css';

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

type NavKey = keyof Dictionary['nav'];

// ---------------------------------------------------------------------------
// SiteHeader — server component shell, contains the client LocaleSwitcher
// ---------------------------------------------------------------------------
export function SiteHeader({
  locale,
  dict,
}: SiteHeaderProps): React.ReactElement {
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

        <nav
          className="site-header__nav"
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.route(locale)}
              className="site-header__nav-link"
            >
              {dict.nav[item.key as NavKey]}
            </Link>
          ))}
        </nav>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <LocaleSwitcher currentLocale={locale} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
