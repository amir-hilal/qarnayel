import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared zod utilities used across feature schemas
// ---------------------------------------------------------------------------

// LocalizedText — both ar and en are required
export const localizedTextSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

// LocalizedText — with min-length requirement
export const requiredLocalizedTextSchema = z.object({
  ar: z.string().min(1, 'Arabic text is required'),
  en: z.string().min(1, 'English text is required'),
});

// SeoFields
export const seoFieldsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).optional(),
});

// LocalizedSeo
export const localizedSeoSchema = z.object({
  ar: seoFieldsSchema,
  en: seoFieldsSchema,
});

// MediaReference
export const mediaReferenceSchema = z.object({
  path: z.string().min(1),
  url: z.string().url(),
  alt: localizedTextSchema,
  isPrimary: z.boolean(),
});

// PublishStatus
export const publishStatusSchema = z.enum(['draft', 'published', 'archived']);

// PlaceResource
export const placeResourceSchema = z.object({
  label: localizedTextSchema,
  url: z.string().url(),
  type: z.enum(['article', 'video', 'pdf', 'website', 'other']),
});

// HistorySource
export const historySourceSchema = z.object({
  label: localizedTextSchema,
  url: z.string().url().optional(),
});

// Firestore Timestamp to ISO string coercion helper
export function coerceTimestampToString(
  value: unknown,
): string {
  if (typeof value === 'string') return value;
  if (
    value !== null &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}
