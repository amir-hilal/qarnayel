import type { Locale } from '@/lib/i18n/locales';
import type { Dictionary } from './dictionaries/ar';

// ---------------------------------------------------------------------------
// getDictionary — returns the static UI dictionary for the given locale
// ---------------------------------------------------------------------------
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === 'en') {
    const { en } = await import('./dictionaries/en');
    return en;
  }
  const { ar } = await import('./dictionaries/ar');
  return ar;
}

export type { Dictionary };
