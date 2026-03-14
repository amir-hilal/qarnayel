'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n/locales';
import { switchLocalePath } from '@/lib/i18n/helpers';
import type { Locale } from '@/lib/i18n/locales';

type LocaleSwitcherProps = {
  currentLocale: Locale;
};

// ---------------------------------------------------------------------------
// LocaleSwitcher — client component that navigates to the same page in the
// other locale by replacing the locale segment in the current path.
// ---------------------------------------------------------------------------
export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(targetLocale: Locale): void {
    const newPath = switchLocalePath(pathname, targetLocale);
    router.push(newPath);
  }

  return (
    <nav className="locale-switcher" aria-label="Language switcher">
      {LOCALES.map(locale => (
        <button
          key={locale}
          onClick={() => handleSwitch(locale)}
          className={`locale-switcher__btn${locale === currentLocale ? ' locale-switcher__btn--active' : ''}`}
          aria-current={locale === currentLocale ? 'true' : undefined}
          lang={locale}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </nav>
  );
}
