import { placeSchema } from '@/features/places/schemas/place.schema';
import { coerceTimestampToString } from '@/lib/validation';
import type { Place } from '@/features/places/types';

// ---------------------------------------------------------------------------
// toPlace — converts a raw Firestore document to a typed Place domain model
// ---------------------------------------------------------------------------
export function toPlace(
  id: string,
  raw: Record<string, unknown>,
): Place | null {
  const withCoercedDates = {
    ...raw,
    id,
    createdAt: coerceTimestampToString(raw['createdAt']),
    updatedAt: coerceTimestampToString(raw['updatedAt']),
  };

  const result = placeSchema.safeParse(withCoercedDates);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[place.mapper] Failed to parse place "${id}":`,
        result.error.flatten(),
      );
    }
    return null;
  }

  return result.data;
}
