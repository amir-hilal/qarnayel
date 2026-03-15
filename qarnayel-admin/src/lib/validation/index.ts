import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// =============================================================================
// Shared zod utility schemas — used across all feature schemas
// =============================================================================

export const localizedTextSchema = z.object({
  ar: z.string().default(''),
  en: z.string().default(''),
});

export const seoFieldsSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  keywords: z.array(z.string()).optional(),
});

export const localizedSeoSchema = z.object({
  ar: seoFieldsSchema,
  en: seoFieldsSchema,
});

export const publishStatusSchema = z.enum(['draft', 'published', 'archived']);

export const mediaReferenceSchema = z.object({
  storagePath: z.string().min(1),
  downloadUrl: z.string().url(),
  altText: localizedTextSchema.optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const placeResourceSchema = z.object({
  label: localizedTextSchema,
  url: z.string().url(),
});

// =============================================================================
// Timestamp coercion utility
// Firestore Timestamps are objects with toDate(). Coerce them to ISO strings.
// =============================================================================

export function coerceTimestampToString(value: unknown): string {
  if (!value) return new Date().toISOString();

  // Firestore Timestamp object
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  ) {
    return (value as Timestamp).toDate().toISOString();
  }

  // Already a string
  if (typeof value === 'string') return value;

  // Number (unix ms)
  if (typeof value === 'number') return new Date(value).toISOString();

  return new Date().toISOString();
}
