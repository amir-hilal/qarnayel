import { placeSchema } from '@/features/places/schemas/place.schema';
import type {
  Place,
  PlaceContact,
  PlaceLocation,
} from '@/features/places/types';
import { coerceTimestampToString } from '@/lib/validation';

// =============================================================================
// Place mapper — converts raw Firestore documents to typed Place domain models
// =============================================================================

function stripContact(c: {
  phone?: string | undefined;
  email?: string | undefined;
  whatsapp?: string | undefined;
  website?: string | undefined;
}): PlaceContact {
  return Object.fromEntries(
    Object.entries(c).filter(([, v]) => v !== undefined),
  ) as PlaceContact;
}

function stripLocation(l: {
  mapUrl?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  address?: { ar: string; en: string } | undefined;
}): PlaceLocation {
  return Object.fromEntries(
    Object.entries(l).filter(([, v]) => v !== undefined),
  ) as PlaceLocation;
}

/**
 * Convert a raw Firestore document to a typed Place.
 * Returns null if validation fails (logs in development).
 */
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

  const d = result.data;

  return {
    ...d,
    contact: stripContact(d.contact),
    location: stripLocation(d.location),
  };
}
