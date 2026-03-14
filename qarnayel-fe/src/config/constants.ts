// =============================================================================
// Site-wide constants
// Never use magic strings — always import from here
// =============================================================================

// Routes — use these helpers everywhere, never hard-code paths
export const ROUTES = {
  HOME: (locale: string) => `/${locale}`,
  PLACES: (locale: string) => `/${locale}/places`,
  PLACE_DETAIL: (locale: string, slug: string) => `/${locale}/places/${slug}`,
  HISTORY: (locale: string) => `/${locale}/history`,
  ABOUT: (locale: string) => `/${locale}/about`,
  CONTACT: (locale: string) => `/${locale}/contact`,
} as const;

// Firestore collection names
export const COLLECTIONS = {
  PLACES: 'places',
  HISTORY: 'history',
  PAGE_CONTENT: 'pageContent',
  SITE_SETTINGS: 'siteSettings',
} as const;

// Firestore document IDs
export const DOCUMENT_IDS = {
  SITE_SETTINGS_GLOBAL: 'global',
} as const;

// Publish status values
export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// Place type values
export const PLACE_TYPES = {
  ATTRACTION: 'attraction',
  SERVICE: 'service',
} as const;

// Place category values
export const PLACE_CATEGORIES = {
  FOREST: 'forest',
  LAKE: 'lake',
  RESTAURANT: 'restaurant',
  SHOP: 'shop',
  PHARMACY: 'pharmacy',
  SALON: 'salon',
  LANDMARK: 'landmark',
  OTHER: 'other',
} as const;

// Contact mode values
export const CONTACT_MODES = {
  GUIDE: 'guide',
  OWNER: 'owner',
  NONE: 'none',
} as const;

// Page content slugs
export const PAGE_SLUGS = {
  ABOUT: 'about',
  CONTACT: 'contact',
} as const;

// Navigation items (resolved by locale in dictionaries)
export const NAV_ITEMS = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'places', route: ROUTES.PLACES },
  { key: 'history', route: ROUTES.HISTORY },
  { key: 'about', route: ROUTES.ABOUT },
  { key: 'contact', route: ROUTES.CONTACT },
] as const;
