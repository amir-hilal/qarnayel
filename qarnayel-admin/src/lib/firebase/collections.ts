import { COLLECTIONS, DOCUMENT_IDS } from '@/config/collections';
import { db } from '@/lib/firebase/client';
import { collection, doc } from 'firebase/firestore';

// =============================================================================
// Typed collection and document references
// Use these in repositories — never call collection() / doc() inline.
// =============================================================================

export const placesCollection = () => collection(db, COLLECTIONS.PLACES);

export const pageContentCollection = () =>
  collection(db, COLLECTIONS.PAGE_CONTENT);

export const siteSettingsDoc = () =>
  doc(db, COLLECTIONS.SITE_SETTINGS, DOCUMENT_IDS.SITE_SETTINGS_GLOBAL);

export const placeDoc = (id: string) => doc(db, COLLECTIONS.PLACES, id);

export const pageContentDoc = (slug: string) =>
  doc(db, COLLECTIONS.PAGE_CONTENT, slug);
