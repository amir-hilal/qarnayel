import { siteSettingsSchema } from '@/features/settings/schemas/settings.schema';
import { coerceTimestampToString } from '@/lib/validation';
import type { SiteSettings } from '@/types';

// =============================================================================
// Settings mapper — convert raw Firestore document to typed SiteSettings model
// =============================================================================

/**
 * Map a raw Firestore document to typed SiteSettings.
 * Returns null when parsing fails (treated as a data-schema mismatch in dev).
 */
export function toSiteSettings(
  id: string,
  raw: Record<string, unknown>,
): SiteSettings | null {
  const data: Record<string, unknown> = {
    ...raw,
    id,
    updatedAt: coerceTimestampToString(raw.updatedAt),
  };

  const result = siteSettingsSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[settings.mapper] Failed to parse site settings "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
