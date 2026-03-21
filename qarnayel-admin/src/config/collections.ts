// =============================================================================
// Firestore collection name constants
// Never use raw strings for collection names — always import from here.
// =============================================================================

export const COLLECTIONS = {
  PLACES: 'places',
  PAGE_CONTENT: 'pageContent',
  SITE_SETTINGS: 'siteSettings',
} as const;

export const DOCUMENT_IDS = {
  SITE_SETTINGS_GLOBAL: 'global',
} as const;
