import type { Locale } from '@/lib/i18n/locales';
import type { LocalizedText } from '@/types';

// =============================================================================
// i18n helper utilities — shared with public website conventions
// =============================================================================

/**
 * Resolve a LocalizedText to a single string for the given locale.
 * Falls back to English if the locale value is empty.
 */
export function localise(text: LocalizedText, locale: Locale): string {
  const value = text[locale];
  if (value && value.trim().length > 0) return value;
  return text['en'] ?? '';
}

/**
 * Get the text direction for a locale.
 */
export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Format a date string in a locale-aware way.
 */
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

/**
 * Check if a LocalizedText has content for a specific locale.
 */
export function hasLocaleContent(text: LocalizedText, locale: Locale): boolean {
  return typeof text[locale] === 'string' && text[locale].trim().length > 0;
}

/**
 * Check if a LocalizedText has content for both locales.
 */
export function hasBothLocales(text: LocalizedText): boolean {
  return hasLocaleContent(text, 'ar') && hasLocaleContent(text, 'en');
}
