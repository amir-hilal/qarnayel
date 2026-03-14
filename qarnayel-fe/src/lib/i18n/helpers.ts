import type { LocalizedText } from '@/types';
import type { Locale } from '@/lib/i18n/locales';

// ---------------------------------------------------------------------------
// Resolve a LocalizedText to a single string for the active locale.
// Falls back to English if the locale string is empty.
// Treats empty-string as missing.
// ---------------------------------------------------------------------------
export function localise(text: LocalizedText, locale: Locale): string {
  const value = text[locale];
  if (value && value.trim().length > 0) return value;
  return text['en'] ?? '';
}

// ---------------------------------------------------------------------------
// Format a date string in a locale-aware way
// ---------------------------------------------------------------------------
export function formatLocaleDate(isoDate: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-LB' : 'en-LB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

// ---------------------------------------------------------------------------
// Get the text direction for a locale
// ---------------------------------------------------------------------------
export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// ---------------------------------------------------------------------------
// Switch locale in a path
// E.g. switchLocalePath('/ar/places', 'en') → '/en/places'
// ---------------------------------------------------------------------------
export function switchLocalePath(path: string, targetLocale: Locale): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;
  segments[0] = targetLocale;
  return `/${segments.join('/')}`;
}
