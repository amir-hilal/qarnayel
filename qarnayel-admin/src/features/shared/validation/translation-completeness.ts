import type {
  PageContentFormValues,
  PlaceFormValues,
  SiteSettingsFormValues,
} from '@/types';

// =============================================================================
// Translation completeness validation
// Checks that all mandatory bilingual fields contain non-empty content in both
// Arabic (ar) and English (en) before a document can be published.
// =============================================================================

export interface TranslationCompletenessResult {
  /** True when all required fields are present in both locales. */
  isComplete: boolean;
  /** List of human-readable field labels missing a translation. */
  missingFields: string[];
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Collect bilingual field labels where one or both locale strings are empty.
 */
function checkLocalizedFields(
  fields: { label: string; ar: string | undefined; en: string | undefined }[],
): string[] {
  const missing: string[] = [];

  for (const field of fields) {
    if (!field.ar?.trim()) missing.push(`${field.label} (Arabic)`);
    if (!field.en?.trim()) missing.push(`${field.label} (English)`);
  }

  return missing;
}

// ---------------------------------------------------------------------------
// Per-content-type validators
// ---------------------------------------------------------------------------

/**
 * Check translation completeness for a place.
 * Required bilingual fields: title, shortDescription, description.
 */
export function checkPlaceTranslationCompleteness(
  values: PlaceFormValues,
): TranslationCompletenessResult {
  const missingFields = checkLocalizedFields([
    {
      label: 'Title',
      ar: values.title?.ar,
      en: values.title?.en,
    },
    {
      label: 'Short description',
      ar: values.shortDescription?.ar,
      en: values.shortDescription?.en,
    },
    {
      label: 'Description',
      ar: values.description?.ar,
      en: values.description?.en,
    },
  ]);

  return { isComplete: missingFields.length === 0, missingFields };
}

/**
 * Check translation completeness for a page content document.
 * Required bilingual fields: title, body.
 */
export function checkPageContentTranslationCompleteness(
  values: PageContentFormValues,
): TranslationCompletenessResult {
  const missingFields = checkLocalizedFields([
    {
      label: 'Title',
      ar: values.title?.ar,
      en: values.title?.en,
    },
    {
      label: 'Body',
      ar: values.body?.ar,
      en: values.body?.en,
    },
  ]);

  return { isComplete: missingFields.length === 0, missingFields };
}

/**
 * Check translation completeness for site settings.
 * Required bilingual fields: siteName, tagline.
 */
export function checkSiteSettingsTranslationCompleteness(
  values: SiteSettingsFormValues,
): TranslationCompletenessResult {
  const missingFields = checkLocalizedFields([
    {
      label: 'Site name',
      ar: values.siteName?.ar,
      en: values.siteName?.en,
    },
    {
      label: 'Tagline',
      ar: values.tagline?.ar,
      en: values.tagline?.en,
    },
  ]);

  return { isComplete: missingFields.length === 0, missingFields };
}
