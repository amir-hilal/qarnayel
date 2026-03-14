import { COLLECTIONS, DOCUMENT_IDS } from '@/config/constants';
import { db } from '@/lib/firebase/client';
import { collection, doc } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Typed collection and document references
// Use these instead of calling collection() / doc() inline in repositories
// ---------------------------------------------------------------------------

export const placesCollection = () => collection(db, COLLECTIONS.PLACES);

export const historyCollection = () => collection(db, COLLECTIONS.HISTORY);

export const pageContentCollection = () =>
  collection(db, COLLECTIONS.PAGE_CONTENT);

export const siteSettingsDoc = () =>
  doc(db, COLLECTIONS.SITE_SETTINGS, DOCUMENT_IDS.SITE_SETTINGS_GLOBAL);
