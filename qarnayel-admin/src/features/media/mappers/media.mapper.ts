import { mediaAssetSchema } from '@/features/media/schemas/media.schema';
import type { MediaAsset } from '@/features/media/types';
import { coerceTimestampToString } from '@/lib/validation';

// =============================================================================
// Media mapper — convert raw Firestore documents to typed MediaAsset models
// =============================================================================

/**
 * Map a raw Firestore document to a typed MediaAsset.
 * Returns null when parsing fails (treated as a data-schema mismatch in dev).
 */
export function toMediaAsset(
  id: string,
  raw: Record<string, unknown>,
): MediaAsset | null {
  const data: Record<string, unknown> = {
    ...raw,
    id,
    createdAt: coerceTimestampToString(raw.createdAt),
    updatedAt: coerceTimestampToString(raw.updatedAt),
  };

  const result = mediaAssetSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[media.mapper] Failed to parse media asset "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
