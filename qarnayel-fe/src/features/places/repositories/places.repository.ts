import { PUBLISH_STATUS } from '@/config/constants';
import { toPlace } from '@/features/places/mappers/place.mapper';
import type { Place, PlaceCategory, PlaceType } from '@/features/places/types';
import { placesCollection } from '@/lib/firebase/collections';
import { getDocs, limit, query, where } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// fetchPublishedPlaces — returns all published places, with optional filters
// ---------------------------------------------------------------------------
export async function fetchPublishedPlaces(options?: {
  category?: PlaceCategory;
  placeType?: PlaceType;
}): Promise<Place[]> {
  try {
    const constraints = [where('status', '==', PUBLISH_STATUS.PUBLISHED)];

    if (options?.category) {
      constraints.push(where('category', '==', options.category));
    }

    if (options?.placeType) {
      constraints.push(where('placeType', '==', options.placeType));
    }

    const q = query(placesCollection(), ...constraints);
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toPlace(d.id, d.data() as Record<string, unknown>))
      .filter((p): p is Place => p !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[places.repository] fetchPublishedPlaces failed', err);
    }
    return [];
  }
}

// ---------------------------------------------------------------------------
// fetchFeaturedPlaces — returns featured published places for the homepage
// ---------------------------------------------------------------------------
export async function fetchFeaturedPlaces(maxCount = 6): Promise<Place[]> {
  try {
    const q = query(
      placesCollection(),
      where('status', '==', PUBLISH_STATUS.PUBLISHED),
      where('featured', '==', true),
      limit(maxCount),
    );
    const snap = await getDocs(q);

    return snap.docs
      .map((d) => toPlace(d.id, d.data() as Record<string, unknown>))
      .filter((p): p is Place => p !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[places.repository] fetchFeaturedPlaces failed', err);
    }
    return [];
  }
}

// ---------------------------------------------------------------------------
// fetchPlaceBySlug — returns a single published place by its slug
// ---------------------------------------------------------------------------
export async function fetchPlaceBySlug(slug: string): Promise<Place | null> {
  try {
    const q = query(
      placesCollection(),
      where('status', '==', PUBLISH_STATUS.PUBLISHED),
      where('slug', '==', slug),
      limit(1),
    );
    const snap = await getDocs(q);

    if (snap.empty) return null;

    const firstDoc = snap.docs[0];
    if (!firstDoc) return null;

    return toPlace(firstDoc.id, firstDoc.data() as Record<string, unknown>);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[places.repository] fetchPlaceBySlug("${slug}") failed`,
        err,
      );
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// fetchAllPublishedSlugs — used in generateStaticParams
// ---------------------------------------------------------------------------
export async function fetchAllPublishedSlugs(): Promise<string[]> {
  try {
    const q = query(
      placesCollection(),
      where('status', '==', PUBLISH_STATUS.PUBLISHED),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => (d.data() as Record<string, unknown>)['slug'])
      .filter((s): s is string => typeof s === 'string');
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[places.repository] fetchAllPublishedSlugs failed', err);
    }
    return [];
  }
}
