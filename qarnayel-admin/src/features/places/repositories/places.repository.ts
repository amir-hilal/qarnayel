import { toPlace } from '@/features/places/mappers/place.mapper';
import type {
  Place,
  PlaceCategory,
  PlaceFormValues,
  PlaceType,
  PublishStatus,
} from '@/features/places/types';
import { placeDoc, placesCollection } from '@/lib/firebase/collections';
import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';

// =============================================================================
// Places repository — all Firestore read/write for the places collection
// =============================================================================

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch all places (all statuses) for the admin list.
 */
export async function fetchAllPlaces(options?: {
  category?: PlaceCategory;
  placeType?: PlaceType;
  status?: PublishStatus;
}): Promise<Place[]> {
  try {
    const constraints = [];

    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }
    if (options?.category) {
      constraints.push(where('category', '==', options.category));
    }
    if (options?.placeType) {
      constraints.push(where('placeType', '==', options.placeType));
    }

    constraints.push(orderBy('updatedAt', 'desc'));

    const q = query(placesCollection(), ...constraints);
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toPlace(d.id, d.data() as Record<string, unknown>))
      .filter((p): p is Place => p !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[places.repository] fetchAllPlaces failed', err);
    }
    return [];
  }
}

/**
 * Fetch a single place by ID.
 */
export async function fetchPlaceById(id: string): Promise<Place | null> {
  try {
    const snap = await getDoc(placeDoc(id));
    if (!snap.exists()) return null;
    return toPlace(snap.id, snap.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[places.repository] fetchPlaceById("${id}") failed`, err);
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/**
 * Create a new place document. Returns the new document ID.
 */
export async function createPlace(data: PlaceFormValues): Promise<string> {
  const docRef = await addDoc(placesCollection(), {
    ...serializePlaceFormValues(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing place document.
 */
export async function updatePlace(
  id: string,
  data: Partial<PlaceFormValues>,
): Promise<void> {
  await updateDoc(placeDoc(id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Set the status of a place (publish, archive, restore to draft).
 * Use checkTranslationCompleteness before calling with 'published'.
 */
export async function setPlaceStatus(
  id: string,
  status: PublishStatus,
): Promise<void> {
  await updateDoc(placeDoc(id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

/**
 * Prepare PlaceFormValues for writing to Firestore.
 * Strips undefined optional fields to avoid writing null-ish data.
 */
function serializePlaceFormValues(data: PlaceFormValues): DocumentData {
  return {
    slug: data.slug,
    placeType: data.placeType,
    category: data.category,
    contactMode: data.contactMode,
    status: data.status,
    featured: data.featured,
    title: data.title,
    subtitle: data.subtitle,
    shortDescription: data.shortDescription,
    description: data.description,
    seo: data.seo,
    contact: data.contact,
    location: data.location,
    images: data.images,
    resources: data.resources,
  };
}
