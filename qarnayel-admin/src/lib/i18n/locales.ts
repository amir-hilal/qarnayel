// =============================================================================
// Locale constants — shared with public website conventions
// =============================================================================

export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ar';

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
} as const;

export const LOCALE_DIRS: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
} as const;

export function isValidLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}
