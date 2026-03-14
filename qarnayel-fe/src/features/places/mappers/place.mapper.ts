import { placeSchema } from '@/features/places/schemas/place.schema';
import type {
  Place,
  PlaceContact,
  PlaceLocation,
} from '@/features/places/types';
import { coerceTimestampToString } from '@/lib/validation';

type RawSeoLocale = {
  title: string;
  description: string;
  keywords?: string[] | undefined;
};

function stripSeoLocale(f: RawSeoLocale) {
  const { keywords, ...rest } = f;
  return { ...rest, ...(keywords !== undefined ? { keywords } : {}) };
}

function stripContact(c: {
  phone?: string | undefined;
  email?: string | undefined;
  whatsapp?: string | undefined;
  website?: string | undefined;
}): PlaceContact {
  const { phone, email, whatsapp, website } = c;
  return {
    ...(phone !== undefined ? { phone } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(whatsapp !== undefined ? { whatsapp } : {}),
    ...(website !== undefined ? { website } : {}),
  };
}

function stripLocation(l: {
  mapUrl?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  address?: { ar: string; en: string } | undefined;
}): PlaceLocation {
  const { mapUrl, lat, lng, address } = l;
  return {
    ...(mapUrl !== undefined ? { mapUrl } : {}),
    ...(lat !== undefined ? { lat } : {}),
    ...(lng !== undefined ? { lng } : {}),
    ...(address !== undefined ? { address } : {}),
  };
}

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

  const d = result.data;
  return {
    ...d,
    seo: {
      ar: stripSeoLocale(d.seo.ar),
      en: stripSeoLocale(d.seo.en),
    },
    contact: stripContact(d.contact),
    location: stripLocation(d.location),
  };
}
