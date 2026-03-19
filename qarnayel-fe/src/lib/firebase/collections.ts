import { COLLECTIONS, DOCUMENT_IDS } from '@/config/constants';
import { db } from '@/lib/firebase/client';
import { collection, doc } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Typed collection and document references
// Use these instead of calling collection() / doc() inline in repositories
// ---------------------------------------------------------------------------

export const placesCollection = () => collection(db, COLLECTIONS.PLACES);

export const pageContentCollection = () =>
  collection(db, COLLECTIONS.PAGE_CONTENT);

export const pageContentDoc = (slug: string) =>
  doc(db, COLLECTIONS.PAGE_CONTENT, slug);

export const siteSettingsDoc = () =>
  doc(db, COLLECTIONS.SITE_SETTINGS, DOCUMENT_IDS.SITE_SETTINGS_GLOBAL);
