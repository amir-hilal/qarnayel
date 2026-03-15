// =============================================================================
// Firestore collection name constants
// Never use raw strings for collection names — always import from here.
// =============================================================================

export const COLLECTIONS = {
  PLACES: 'places',
  HISTORY: 'history',
  PAGE_CONTENT: 'pageContent',
  MEDIA: 'media',
  SITE_SETTINGS: 'siteSettings',
} as const;

export const DOCUMENT_IDS = {
  SITE_SETTINGS_GLOBAL: 'global',
} as const;
