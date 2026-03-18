'use client';

import type { Locale } from '@/lib/i18n/locales';
import { LOCALE_DIRS } from '@/lib/i18n/locales';
import { useLayoutEffect } from 'react';

/**
 * Keeps <html lang> and <html dir> in sync with the active locale on every
 * client-side navigation. Runs in useLayoutEffect (before paint) so there is
 * no direction flash when switching between Arabic ↔ English.
 *
 * The initial page-load case is already handled by public/scripts/init.js.
 * This component covers all subsequent client-side route transitions.
 */
export function HtmlLocaleSync({ locale }: { locale: Locale }): null {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIRS[locale];
  }, [locale]);

  return null;
}
